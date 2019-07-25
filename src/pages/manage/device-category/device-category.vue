<template>
  <div class="device-category">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_device_class")}}</p>
        <p class="title-en">EQUIPMENT CATEGORY</p>
      </el-col>
    </el-row>
    <el-row class="table">
     <el-row>
       <el-col :span="24">
         <!-- 搜索栏开始 -->
         <el-form :inline="true" :model="formInline" class="demo-form-inline">
           <el-form-item label="">
             <el-date-picker
               class="time"
               v-model="formInline.ChoiceTime"
               type="daterange"
               value-format="yyyy-MM-dd"
               :editable="false"
               :range-separator="$t('iot_plat_to')"
               :start-placeholder="$t('iot_plat_start_date')"
               :end-placeholder="$t('iot_plat_end_date')">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="">
             <el-input v-model="formInline.query_by_name"></el-input>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="onSubmit">{{$t("iot_plat_query")}}</el-button>
           </el-form-item>
         </el-form>
         <!-- 搜索栏结束 -->

         <!-- 右上角添加删除按钮开始 -->
         <el-button
           icon="el-icon-plus"
           type="primary"
           circle
           class="btn-circle-add"
           v-if="vmHasAuth(AdminPermissionsLib.ADD_DEVICE_CATE, tableData.res)"
           @click="showDialog(null, 'add')"></el-button>
         <el-button
           icon="el-icon-delete"
           type="danger"
           circle
           class="btn-circle-delete btn-circle-right"
           v-if="vmHasAuth(AdminPermissionsLib.DEL_DEVICE_CATE, tableData.res)"
           @click="Delete()"></el-button>
          <!-- 右上角添加删除按钮结束 -->
       </el-col>
     </el-row>

     <!-- 表格开始 -->
      <el-row>
        <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="onSubmit" v-on:selection="handleSelectionChange">
          <el-table-column
            :label="$t('iot_plat_operate')"
            width="120" slot="handler">
            <template slot-scope="scope">
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-bianji"
                circle
                v-if="vmHasAuth(AdminPermissionsLib.UPDATE_DEVICE_CATE, tableData.res)"
                @click="showDialog(scope.row, 'edit')"></el-button>
            </template>
          </el-table-column>
        </TableComponent>
      </el-row>
      <!-- 表格结束 -->
    </el-row>

    <!-- 编辑添加分类 -->
    <AddEditCategoryComponent
      :title="dialogTitle"
      :isVisible="dialogVisible"
      :model="dialogModel"
      :formData="dialogData"
      @close="dialogClose"></AddEditCategoryComponent>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import { EQUIPMENT_CATEGORY_QUERY, EQUIPMENT_CATEGORY_DELETE } from "../../../lib/api.js"
import TableComponent from "@/components/table/table.vue"
import AddEditCategoryComponent from "./component/add-edit.vue"
import _ from "lodash"
export default {
  components: { TableComponent, AddEditCategoryComponent },
  data () {
    return {
      dialogVisible: false,
      formInline   : {
        ChoiceTime   : "",
        query_by_name: ""
      },
      dialogTitle: "",
      dialogModel: "",
      dialogData : {
        prodt_name: "",
        prodt_code: "",
        sec_type  : "1"
      },

      tableOptions: {
        loading     : true,
        hasSelection: true,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 20,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: this.$t("iot_plat_class_name"),
            prop : "prodt_name"
          },
          {
            prop : "prodt_code",
            label: this.$t("iot_plat_class_code"),
            width: "180"
          },
          {
            prop : "create_time",
            label: this.$t("iot_plat_add_time")
          },
          {
            prop : "user_name",
            label: this.$t("iot_plat_submitter")
          },
          {
            prop : "review_name",
            label: this.$t("iot_plat_reviewer")
          }
        ]
      },
      tableData: {
        data: [],
        res : []
      },
      multipleSelection: []
    }
  },
  created () {
    this.onSubmit()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    resetDialogData () {
      this.dialogData.prodt_name = "";
      this.dialogData.prodt_code = "";
      this.dialogData.sec_type = "1"
    },
    showDialog (row, model) {
      this.resetDialogData()
      this.dialogModel = model;
      if (row) {
        this.dialogData.prodt_name = row.prodt_name;
        this.dialogData.prodt_code = row.prodt_code;
        this.dialogData.sec_type = row.sec_type.toString();
      }
      this.dialogVisible = true
    },
    dialogClose(isToUpdate) {
      if (isToUpdate) {
        this.onSubmit()
      }
      this.dialogVisible = false
    },
    onSubmit: _.debounce(async function () {
      try {
        this.tableOptions.loading = true
        const param = this.createFormData({
          page         : parseInt(this.tableOptions.pageOptions.currentPage),
          page_size    : parseInt(this.tableOptions.pageOptions.pageSize),
          query_by_name: this.formInline.query_by_name,
          start_time   : this.formInline.ChoiceTime ? this.formInline.ChoiceTime[0] : "",
          end_time     : this.formInline.ChoiceTime ? this.formInline.ChoiceTime[1] : ""
        })
        const res = await this.$http.post(EQUIPMENT_CATEGORY_QUERY, param)
        this.tableOptions.loading = false
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableOptions.pageOptions.total = res.data.total
        }
      } catch (error) {
        this.tableOptions.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),

    Delete () {
      if (!this.multipleSelection.length) {
        return this.vmMsgWarning(this.$t("iot_plat_select_value_please"))
      }
      const loading = this.vmLoadingFull()
      try {
        const codeArr = []
        this.multipleSelection.forEach(val => {
          codeArr.push(val.prodt_code)
        })
        const param = this.createFormData({ prodt_code: JSON.stringify(codeArr) })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_data"),
          confirmCallback: async () => {
            const res = await this.$http.post(EQUIPMENT_CATEGORY_DELETE, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
              this.onSubmit()
            }
          },
          cancelCallback: () => {
            loading.close()
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style scoped>
  .device-category{
    padding: 1.67rem 2.5rem;
    color: #fff;
  }
</style>
<style>
  .device-category .el-dialog{
    width:54.17rem;
  }
</style>
