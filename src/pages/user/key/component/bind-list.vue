<template>
  <div>
    <el-dialog :title="$t('iot_plat_modify_manage')" :visible.sync="isVisible" width="50rem" center class="dialog" :before-close="closeDialog">
      <!-- 内层修改密码dialog -->
      <el-dialog
        width="52rem"
        :title="$t('iot_plat_change_pwd')"
        :visible.sync="innerVisible"
        append-to-body
        center>
        <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="140px">
          <el-form-item :label="$t('iot_plat_new_password')" class="form-row" prop="password">
            <el-input v-model="updateForm.password"></el-input>
            <span class="form-tip">*</span>
          </el-form-item>
          <el-form-item label style="margin-top: 4.33rem;">
            <el-button type="primary" class="btn-submit" @click="submit">{{$t("iot_plat_confirm")}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 外层dialog内容 -->
      <div slot="title">
        <span class="el-dialog__title">{{$t("iot_plat_modify_manage")}}</span>
        <el-button type="primary" class="btn" @click="generate">{{$t("iot_plat_create")}}</el-button>
      </div>
      <TableComponent :options="tableOptions" :data="tableData" v-on:page-change="getBindLists">
        <template slot-scope="scope" slot="updatePass">
          <a class="success" href="javascript:void(0)" @click="showUpdatePassDialog(scope.row)">{{$t("iot_plat_change_pwd")}}</a>
        </template>
      </TableComponent>
    </el-dialog>

    <BindManageComponent ref="bindManage" @refresh="getBindLists"></BindManageComponent>
  </div>
</template>

<script>
import { COOP_KEY_BIND_QUERY, COOP_DEVICE_BIND_UPDATE } from "@/lib/api.js";
import TableComponent from "@/components/table/table.vue";
import BindManageComponent from "./bind-result.vue";
export default {
  components: { TableComponent, BindManageComponent },
  props     : {
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    },
    clientId: {
      type    : String,
      required: true
    }
  },
  data () {
    return {
      tableOptions: {
        loading     : true,
        hasSelection: false,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 5,
          currentPage: 1,
          total      : 0
        },
        columns: [
          {
            label: this.$t("iot_plat_user_name"),
            prop : "user_name"
          },
          {
            slotName: "updatePass",
            label   : this.$t("iot_plat_password")
          }
        ]
      },
      tableData   : [],
      innerVisible: false,
      updateForm  : {
        password: "",
        userId  : ""
      },
      rules: {
        password: [
          { required: true, message: this.$t("iot_plat_input_new_password"), trigger: "blur" }, { min: 6, message: this.$t("iot_plat_password_length_limit"), trigger: "blur" }
        ]
      }
    }
  },
  watch: {
    isVisible (newVal) {
      if (newVal) {
        this.getBindLists()
      }
    }
  },
  methods: {
    generate () {
      this.$refs.bindManage.generate(this.clientId)
    },
    closeDialog () {
      this.tableData = []
      this.$emit("close")
    },

    showUpdatePassDialog(row) {
      this.updateForm.userId = row.user_id
      this.innerVisible = true
    },

    submit() {
      this.$refs.updateForm.validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull()
          try {
            const data = this.createFormData({
              client_id: this.clientId,
              user_id  : this.updateForm.userId,
              password : this.updateForm.password
            })
            const res = await this.$http.post(COOP_DEVICE_BIND_UPDATE, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_edit_success"))
              this.innerVisible = false
            }
          } catch (error) {
            loading.close()
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      });
    },
    async getBindLists() {
      this.tableOptions.loading = true
      try {
        const data = this.createFormData({
          client_id: this.clientId,
          page     : this.tableOptions.pageOptions.currentPage,
          page_size: this.tableOptions.pageOptions.pageSize
        })
        const res = await this.$http.post(COOP_KEY_BIND_QUERY, data)
        this.tableOptions.loading = false
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.tableOptions.pageOptions.total = res.data.total
        }
      } catch (error) {
        this.tableOptions.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }
  }
}
</script>

<style scoped>
.row{
  margin-bottom: 1rem;
  color: #fff;
}
.label-left {
  text-align: right;
}
.btn {
  float: left;
  width: auto;
  margin-top: -0.5rem;
  margin-left: 3rem;
}
.el-dialog__title{
  margin-left: -8rem;
}
.btn-container {
  text-align: center
}
</style>


