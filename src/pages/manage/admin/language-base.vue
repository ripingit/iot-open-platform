<template>
  <div class="admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_multi_language_setting")}}</p>
        <p class="title-en">MULTILINGUAL SETTING</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="5">
          <el-button
            icon="el-icon-plus"
            type="primary"
            circle
            class="btn-circle-add"
            v-if="vmHasAuth(AdminPermissionsLib.LANGUAGE_ADD, tableData.res)"
            @click="onShowAddDialog()"
          ></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="queryLanguage" v-on:selection="handleSelectionChange">
            <el-table-column
              :label="$t('iot_plat_operate')" width="100" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-bianji"
                  circle
                  v-if="vmHasAuth(AdminPermissionsLib.LANGUAGE_DELETE, tableData.res)"
                  @click="onShowUpdateDialog(scope.row)"></el-button>
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-shanchu"
                  circle
                  v-if="vmHasAuth(AdminPermissionsLib.LANGUAGE_UPDATE, tableData.res)"
                  @click="onDelete(scope.row)"></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center :before-close="onAddDialogClose">
      <el-form label-width="100px" status-icon :model="form" ref="AddForm" :rules="rules" :hide-required-asterisk="true">
        <el-form-item :label="$t('iot_plat_language')" class="form-row" prop="lang_desc">
          <el-input v-model="form.lang_desc" :placeholder="$t('iot_plat_input_lang_desc')"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_lang_identity')" class="form-row"  prop="language">
          <el-input v-model="form.language" :disabled="!isAdd" :placeholder="$t('iot_plat_input_lang_identity')"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="onAddFormSubmit()">{{$t("iot_plat_confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import TableComponent from "@/components/table/table.vue"
import {
  ADMIN_LANGUAGE_ADD,
  ADMIN_LANGUAGE_QUERY,
  ADMIN_LANGUAGE_UPDATE,
  ADMIN_ALNGUAGE_DELETE
} from "@/lib/api.js";
import _ from "lodash";
export default {
  components: { TableComponent },
  data() {
    return {
      tableOptions: {
        loading    : true,
        hasNumber  : true,
        pageOptions: {
          pageSize   : 20,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: this.$t("iot_plat_lang_name"),
            prop : "language_desc"
          },
          {
            prop : "language",
            label: this.$t("iot_plat_lang_identity")
          }
        ]
      },
      rules: {
        language : [ { required: true, message: this.$t("iot_plat_input_lang_desc"), trigger: "input" } ],
        lang_desc: [ { required: true, message: this.$t("请输入语言标识"), trigger: "input" } ]
      },
      dialogVisible: false,
      form         : {
        language : "",
        lang_desc: ""
      },
      tableData        : [],
      multipleSelection: [],
      isAdd            : false
    };
  },
  computed: {
    dialogTitle () {
      return this.isAdd ? this.$t("iot_plat_add") : this.$t("iot_plat_modify")
    }
  },
  created() {
    this.queryLanguage();
    document.body.addEventListener("keydown", this.keyCodeDown, false);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.keyCodeDown, false);
  },
  methods: {
    keyCodeDown(e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        if (this.dialogVisible) {
          this.onAddFormSubmit();
        }
      }
    },
    async queryLanguage() {
      try {
        const param = this.createFormData({
          page     : this.tableOptions.pageOptions.currentPage,
          page_size: this.tableOptions.pageOptions.pageSize
        });
        const res = await this.$http.post(ADMIN_LANGUAGE_QUERY, param)
        this.tableOptions.loading = false
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableOptions.pageOptions.total = res.data.total
        }
      } catch (error) {
        this.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    onAddFormSubmit: _.debounce(function() {
      this.$refs.AddForm.validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull()
          try {
            const param = this.createFormData(this.form);
            const res = await this.$http.post(this.isAdd ? ADMIN_LANGUAGE_ADD : ADMIN_LANGUAGE_UPDATE, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"));
              this.dialogVisible = false;
              this.resetForm()
              this.queryLanguage();
            }
          } catch (error) {
            loading.close()
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      });
    }, this.DEBOUNCE_TIME),

    onDelete (row) {
      const loading = this.vmLoadingFull();
      try {
        const param = this.createFormData({ language: row.language });
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_data"),
          confirmCallback: async () => {
            const res = await this.$http.post(ADMIN_ALNGUAGE_DELETE, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"));
              this.queryLanguage();
            }
          },
          cancelCallback: () => {
            loading.close()
          }
        });
      } catch (error) {
        loading.close();
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    onShowUpdateDialog (row) {
      this.form.language = row.language
      this.form.lang_desc = row.language_desc
      this.dialogVisible = true
      this.isAdd = false
    },
    onShowAddDialog () {
      this.dialogVisible = true
      this.isAdd = true
    },
    onAddDialogClose (callback) {
      this.resetForm()
      callback()
    },

    resetForm () {
      this.$refs.AddForm.resetFields()
      this.form.language = ""
      this.form.lang_desc = ""
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style scoped>
.admin {
  padding: 1.67rem 2.5rem;
  color: #fff;
}
</style>
<style>
.admin /deep/ .el-dialog {
  width: 54.17rem;
}
</style>
