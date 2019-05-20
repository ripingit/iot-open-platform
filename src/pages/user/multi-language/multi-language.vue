<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">多语言</p>
        <p class="title-en">MULTI-LANGUAGE</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label>
              <el-input v-model="searchForm.variableName" placeholder="请输入变量名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-search" type="primary" @click="getLanguage">查询</el-button>
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
              <a class="success" v-if="item != 'CN'" :key="index" href="javascript:void(0)" @click="viewDetail(scope.row, item)">查看</a>
              <template v-else slot-scope="scope">{{scope.row.str_translation.CN}}</template>
            </template>
            <el-table-column label="操作" width="120" slot="handler" >
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
        <el-col :span="4" class="label-left">变量名：</el-col>
        <el-col :span="20">{{langDetail.variableName}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="4" class="label-left">{{langDetail.label}}：</el-col>
        <el-col :span="20">{{langDetail.translation}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24" class="btn-container">
          <el-button type="primary" class="btn" @click="isDetailVisible = false">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import TableComponent from "@/components/table/table.vue";
import AddUpdateComponent from "./component/add-update.vue";
import { multiLanguage } from "@/lib/const";
import { COOP_I18N_QUERY, COOP_I18N_DELETE } from "@/lib/api.js";

export default {
  components: { TableComponent, AddUpdateComponent },
  data() {
    return {
      isAddUpdateDialogVisible: false,
      isDetailVisible         : false,
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
            label: "变量名",
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
    this.tableSlots = multiLanguage.map(o => o.id)
    multiLanguage.forEach(item => {
      this.tableOptions.columns.push({
        label   : item.name,
        prop    : item.id,
        slotName: item.id
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
      this.langDetail.label = multiLanguage.find(o => o.id === lang).name
      this.langDetail.variableName = row.str_id
      this.langDetail.translation = row.str_translation[lang]
      this.isDetailVisible = true
    },

    updateMultiLanguage (row) {
      this.updateData = row
      this.isAddUpdateDialogVisible = true
      this.addUpdateModel = 1
    },
    
    deleteLanguage (row) {
      const loading = this.vmLoadingFull();
      try {
        const param = this.createFormData({ str_id: row.str_id });
        this.vmConfirm({
          msg            : "确定删除该记录？",
          confirmCallback: async () => {
            const res = await this.$http.post(COOP_I18N_DELETE, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("删除成功！");
              this.getLanguage();
            }
          },
          cancelCallback: () => {
            loading.close()
          }
        });
      } catch (error) {
        loading.close();
        this.vmMsgError("程序错误！");
      }
    },
    async getLanguage () {
      try {
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
        this.vmMsgError("程序错误");
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
</style>
