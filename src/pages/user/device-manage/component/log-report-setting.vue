<template>
  <div>
    <el-form label-width="130px" status-icon :model="form" ref="form" :rules="rules" :hide-required-asterisk="true">
      <el-form-item :label="$t('iot_plat_report_level')" class="form-row" prop="log_level">
        <el-select v-model="form.log_level" :placeholder="$t('iot_plat_select_log_level_please')">
          <el-option
            v-for="item in logLevels"
            :key="item.id"
            :label="$t(item.label)"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>

      <el-form-item :label="$t('iot_plat_report_way')" class="form-row" prop="transfer_proto">
        <el-select v-model="form.transfer_proto" :placeholder="$t('iot_plat_select_log_way_please')">
          <el-option 
            v-for="item in protocols"
            :key="item.id"
            :label="$t(item.label)"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_host')" class="form-row" prop="report_host">
        <el-select v-model="form.report_host" :placeholder="$t('iot_plat_select_host_please')">
          <el-option 
            v-for="item in logHosts"
            :key="item.ip"
            :label="item.label"
            :value="item.ip"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_port')" class="form-row" prop="report_port">
        <el-select v-model="form.report_port" :placeholder="$t('iot_plat_select_port_please')">
          <el-option 
            v-for="item in logHostPort"
            :key="item.port"
            :label="item.label"
            :value="item.port"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="submit">{{$t("iot_plat_confirm")}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { logLevels, protocols, logHostPort, logHosts } from "@/lib/mixins"
import { COOP__DEVICE_LOG_SETTING } from "@/lib/api"
import _ from "lodash";

const mixins = {
  data () {
    return { logLevels: logLevels, protocols: protocols, logHostPort: logHostPort, logHosts: logHosts }
  }
}
export default {
  mixins: [ mixins ],
  props : {
    deviceId: {
      type    : String,
      required: true
    },
    data: {
      type    : Object,
      required: true
    }
  },
  data () {
    return {
      form: {
        log_level     : this.data.log_level,
        transfer_proto: this.data.transfer_proto || "",
        device_id     : this.deviceId,
        report_port   : this.data.report_port || "",
        report_host   : this.data.report_host
      },
      rules: {
        log_level     : [ { required: true, message: this.$t("iot_plat_select_log_level_please"), trigger: "change" } ],
        transfer_proto: [ { required: true, message: this.$t("iot_plat_select_log_way_please"), trigger: "change" } ],
        report_port   : [ { required: true, message: this.$t("iot_plat_select_port_please"), trigger: "change" } ],
        report_host   : [ { required: true, message: this.$t("iot_plat_select_host_please"), trigger: "change" } ]
      }
    }
  },
  watch: {
    data () {
      this.form.log_level = this.data.log_level
      this.form.transfer_proto = this.data.transfer_proto || ""
      this.form.device_id = this.deviceId
      this.form.report_port = this.data.report_port || ""
      this.form.report_host = this.data.report_host
    }
  },
  methods: {
    submit: _.debounce(function() {
      this.$refs.form.validate(async valid => { 
        if (valid) {
          const loading = this.vmLoadingFull();
          const param = this.createFormData(this.form);
          try {
            const res = await this.$http.post(COOP__DEVICE_LOG_SETTING, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_set_success"));
              this.$refs.form.resetFields();
              this.$emit("close", true);
            }
          } catch (error) {
            loading.close();
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      })
    }, this.DEBOUNCE_TIME)
  }
}
</script>
