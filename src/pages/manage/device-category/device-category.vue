<template>
  <div class="device-category">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">设备类别</p>
        <p class="title-en">EQUIPMENT CATEGORY</p>
      </el-col>
    </el-row>
    <el-row class="table">
     <el-row>
       <el-col :span="24">
         <el-form :inline="true" :model="formInline" class="demo-form-inline">
           <el-form-item label="">
             <el-date-picker
               class="time"
               v-model="formInline.ChoiceTime"
               type="daterange"
               value-format="yyyy-MM-dd"
               :editable="false"
               range-separator="至"
               start-placeholder="开始日期"
               end-placeholder="结束日期">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="">
             <el-input v-model="formInline.query_by_name"></el-input>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="onSubmit">查询</el-button>
           </el-form-item>
         </el-form>
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
       </el-col>
     </el-row>
      <el-row>
        <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="onSubmit" v-on:selection="handleSelectionChange">
          <el-table-column
            label="操作"
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
    </el-row>

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
            label: "类别名称",
            prop : "prodt_name"
          },
          {
            prop : "prodt_code",
            label: "类别代码",
            width: "180"
          },
          {
            prop : "create_time",
            label: "添加时间"
          },
          {
            prop : "user_name",
            label: "提交人"
          },
          {
            prop : "review_name",
            label: "审核人"
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
        this.vmMsgError("程序错误！")
      }
    }, this.DEBOUNCE_TIME),

    Delete () {
      if (!this.multipleSelection.length) {
        return this.vmMsgWarning("请选择记录")
      }
      const loading = this.vmLoadingFull()
      try {
        const codeArr = []
        this.multipleSelection.forEach(val => {
          codeArr.push(val.prodt_code)
        })
        const param = this.createFormData({ prodt_code: JSON.stringify(codeArr) })
        this.vmConfirm({
          msg            : "确定删除该记录？",
          confirmCallback: async () => {
            const res = await this.$http.post(EQUIPMENT_CATEGORY_DELETE, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("删除成功！")
              this.onSubmit()
            }
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError("程序错误！")
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
