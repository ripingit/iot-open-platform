<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_multi_language")}}</p>
        <p class="title-en">MULTI-LANGUAGE</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label>
              <el-input v-model="searchForm.variableName" :placeholder="$t('iot_plat_input_variable')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-search" type="primary" @click="getLanguage(1)">{{$t("iot_plat_query")}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button 
                v-if="vmHasAuth(CoopPermissionsLib.IMPORT_MULTI_LANGUAGE, tableData.res)"
                class="btn-search" type="primary" @click="exportLanguage">{{$t("iot_plat_export")}}</el-button>
            </el-form-item>
            <el-form-item>
              <UploadComponent
                v-if="vmHasAuth(CoopPermissionsLib.EXPORT_MULTI_LANGUAGE, tableData.res)"
                class="uploader"
                ref="uploaderExcel"
                name="file"
                :path="uploadPath"
                :buttonText="$t('iot_plat_import')"
                :accept="['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']"
                model="btn"
                :condition="$t('iot_plat_upload_excel_file')" @response="getUploadResult"></UploadComponent>
            </el-form-item>
          </el-form>
          <el-button
            icon="el-icon-plus"
            type="primary"
            circle
            v-if="vmHasAuth(CoopPermissionsLib.ADD_MULTI_LANGUAGE, tableData.res)"
            class="btn-circle-add" @click="showAddUpdateDialog"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="getLanguage">
            <template slot-scope="scope" v-for="(item, index) in tableSlots" :slot="item">
              <a class="success" v-if="item != 'CN'" :key="index" href="javascript:void(0)" @click="viewDetail(scope.row, item)">{{$t("iot_plat_view")}}</a>
              <template v-else slot-scope="scope">{{scope.row.str_translation.CN}}</template>
            </template>
            <el-table-column :label="$t('iot_plat_operate')" width="120" slot="handler" >
              <template slot-scope="scope" v-if="vmHasAuth(CoopPermissionsLib.EDIT_MULTI_LANGUAGE, tableData.res) || vmHasAuth(CoopPermissionsLib.DEL_MULTI_LANGUAGE, tableData.res)">
                <el-button
                  v-if="vmHasAuth(CoopPermissionsLib.EDIT_MULTI_LANGUAGE, tableData.res)"
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-bianji"
                  circle
                  @click="updateMultiLanguage(scope.row)"
                ></el-button>
                <el-button
                  v-if="vmHasAuth(CoopPermissionsLib.DEL_MULTI_LANGUAGE, tableData.res)"
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-shanchu"
                  circle
                  @click="deleteLanguage(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>

    <!-- 添加或修改 -->
    <AddUpdateComponent :isVisible="isAddUpdateDialogVisible" :data="updateData" :model="addUpdateModel" @close="closeAddUpdateDialog"></AddUpdateComponent>

    <!-- 除中文外的其他翻译 -->
    <el-dialog :visible.sync="isDetailVisible" width="50rem" center class="dialog">
      <el-row class="row">
        <el-col :span="6" class="label-left">{{$t("iot_plat_variable")}}：</el-col>
        <el-col :span="18">{{langDetail.variableName}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="6" class="label-left">{{langDetail.label}}：</el-col>
        <el-col :span="18">{{langDetail.translation}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24" class="btn-container">
          <el-button type="primary" class="btn" @click="isDetailVisible = false">{{$t("iot_plat_confirm")}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import TableComponent from "@/components/table/table.vue";
import AddUpdateComponent from "./component/add-update.vue";
import UploadComponent from "@/components/uploader/upload.vue"
import { COOP_I18N_QUERY, COOP_I18N_DELETE, COOP_I18N_EXPORT, COOP_I18N_IMPORT } from "@/lib/api.js";

export default {
  components: { TableComponent, AddUpdateComponent, UploadComponent },
  data() {
    return {
      multiLanguage           : this.$store.getters.getLanguages,
      isAddUpdateDialogVisible: false,
      isDetailVisible         : false,
      uploadPath              : COOP_I18N_IMPORT,
      tableSlots              : [],
      searchForm              : { variableName: "" },
      tableData               : {
        data: [],
        res : []
      },
      translateDetail: {
        variable : "",
        translate: ""
      },
      tableOptions: {
        loading     : true,
        hasSelection: false,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 20,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: this.$t("iot_plat_variable"),
            prop : "str_id"
          }
        ]
      },
      langDetail: {
        variableName: "",
        translation : "",
        label       : ""
      },
      updateData    : {},
      addUpdateModel: 0
    };
  },
  created() {
    this.tableSlots = this.multiLanguage.map(o => o.language)
    this.multiLanguage.forEach(item => {
      this.tableOptions.columns.push({
        label   : item.language_desc,
        prop    : item.language,
        slotName: item.language
      })
    })
    this.getLanguage()
  },
  methods: {
    showAddUpdateDialog () {
      this.isAddUpdateDialogVisible = true
      this.addUpdateModel = 0
    },

    closeAddUpdateDialog (isToRefresh) {
      if (isToRefresh) {
        this.getLanguage()
      }
      this.isAddUpdateDialogVisible = false
    },

    viewDetail (row, lang) {
      this.langDetail.label = this.multiLanguage.find(o => o.language === lang).language_desc
      this.langDetail.variableName = row.str_id
      this.langDetail.translation = row.str_translation[lang]
      this.isDetailVisible = true
    },

    updateMultiLanguage (row) {
      this.updateData = row
      this.isAddUpdateDialogVisible = true
      this.addUpdateModel = 1
    },

    exportLanguage () {
      try {
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_export_translate"),
          confirmCallback: () => {
            const aAnchor = document.createElement("a");
            aAnchor.href = COOP_I18N_EXPORT;

            document.body.appendChild(aAnchor)
            aAnchor.click();
          }
        });
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    getUploadResult (res) {
      if (res && res.status) {
        this.getLanguage()
      }
    },

    deleteLanguage (row) {
      const loading = this.vmLoadingFull();
      try {
        const param = this.createFormData({ str_id: row.str_id });
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_data"),
          confirmCallback: async () => {
            const res = await this.$http.post(COOP_I18N_DELETE, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"));
              this.getLanguage();
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
    async getLanguage (isSearch) {
      try {
        if (isSearch) {
          this.tableOptions.pageOptions.currentPage = "1"
        }
        const param = this.createFormData({
          page     : parseInt(this.tableOptions.pageOptions.currentPage),
          page_size: parseInt(this.tableOptions.pageOptions.pageSize),
          str_id   : this.searchForm.variableName
        });
        this.tableOptions.loading = true;
        const res = await this.$http.post(COOP_I18N_QUERY, param)
        this.tableOptions.loading = false;
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data

          this.tableData.data = this.tableData.data.map(o => {
            o.str_translation = JSON.parse(o.str_translation)
            return o
          })

          this.tableOptions.pageOptions.total = res.data.total;
        }
      } catch (e) {
        this.tableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }
  }
};
</script>
<style scoped>
.device-model-admin {
  padding: 1.67rem 2.5rem;
  color: #fff;
}

.row{
  margin-bottom: 1rem;
  color: #fff;
}
.label-left {
  text-align: right;
}
.btn {
  width: auto;
  margin-top: 1rem;
}
.btn-container {
  text-align: center
}
.uploader /deep/ .el-button {
  border-radius: 4px !important;
  height: 3.2rem !important;
}
</style>
