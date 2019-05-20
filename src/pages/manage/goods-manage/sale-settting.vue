<template>
  <el-dialog title="商品促销设置" :visible="isVisible" center @close="dialogClose" @closed="dialogColsed">
    <div class="panel">
      <el-radio-group v-model="panel">
        <el-radio-button
          :label="radioGroupNames.setting"
          v-if="vmHasAuth(AdminPermissionsLib.PROMOTION_ADD, auth) || vmHasAuth(AdminPermissionsLib.PROMOTION_EDIT, auth)"
        ></el-radio-button>
        <el-radio-button
          :label="radioGroupNames.history"
          v-if="vmHasAuth(AdminPermissionsLib.PROMOTION_QUERY, auth)"
        ></el-radio-button>
      </el-radio-group>
    </div>

    <template
      v-if="panel === radioGroupNames.setting && (vmHasAuth(AdminPermissionsLib.PROMOTION_ADD, auth) || (vmHasAuth(AdminPermissionsLib.PROMOTION_EDIT, auth) && !isNew))"
    >
      <el-form
        label-position="right"
        status-icon
        label-width="120px"
        :model="form"
        :rules="rules"
        ref="goodForm"
      >
        <el-form-item class="form-row" label="促销价格" prop="goods_pro_price">
          <el-input v-model="form.goods_pro_price" auto-complete="off" placeholder="请输入促销价格">
            <template
              slot="append"
            >{{ isNaN(form.goods_pro_price/100) ? 0 : form.goods_pro_price/100}} 元</template>
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>

        <el-form-item class="form-row" label="促销时间" required>
          <el-form-item prop="goods_pro_start_time">
            <el-date-picker
              v-model="form.goods_pro_start_time"
              :picker-options="disabledDate"
              type="date"
              placeholder="请选择促销开始时间"
            ></el-date-picker>
            <span class="form-tip">*</span>
          </el-form-item>
          <el-form-item prop="goods_pro_end_time">
            <el-date-picker
              v-model="form.goods_pro_end_time"
              :picker-options="disabledDate"
              type="date"
              placeholder="请选择促销结束时间"
            ></el-date-picker>
            <span class="form-tip">*</span>
          </el-form-item>
        </el-form-item>

        <el-form-item class="form-row" label="单人购买上限" prop="goods_pro_one_buy_limit">
          <el-input
            v-model="form.goods_pro_one_buy_limit"
            auto-complete="off"
            placeholder="请输入单人购买上限"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-row" label="促销总数" prop="goods_pro_total">
          <el-input v-model="form.goods_pro_total" auto-complete="off" placeholder="请输入促销总数"></el-input>
        </el-form-item>
        <el-form-item class="form-row" label="促销状态" prop="is_onsale" v-if="!isNew">
          <el-select v-model="form.is_onsale" placeholder="请选择促销状态" no-data-text="无数据">
            <el-option key="1" label="开启" :value="1"></el-option>
            <el-option key="2" label="关闭" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template
      v-if="panel === radioGroupNames.history && vmHasAuth(AdminPermissionsLib.PROMOTION_QUERY, auth)"
    >
      <TableComponent class="sale-table" :options="tableOptions" :data="tableData">
        <el-table-column
          label="操作"
          width="120"
          slot="handler"
          v-if="vmHasAuth(AdminPermissionsLib.PROMOTION_EDIT, auth) || vmHasAuth(AdminPermissionsLib.PROMOTION_DEL, auth)"
        >
          <template slot-scope="scope">
            <el-button
              class="btn-circle"
              size="mini"
              icon="iconfont icon-bianji"
              circle
              v-if="vmHasAuth(AdminPermissionsLib.PROMOTION_EDIT, auth)"
              @click="editSale(scope.$index, scope.row)"
            ></el-button>
            <el-button
              class="btn-circle"
              size="mini"
              icon="iconfont icon-shanchu"
              circle
              v-if="vmHasAuth(AdminPermissionsLib.PROMOTION_DEL, auth)"
              @click="deleteSales(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </TableComponent>
    </template>
  </el-dialog>
</template>
<script>
import TableComponent from "@/components/table/table.vue";
import {
  ADMIN_SALES_SEARCH_POST,
  ADMIN_SALES_DELETE_POST,
  ADMIN_SALES_ADD_POST,
  ADMIN_SALES_UPDATE_POST
} from "@/lib/api";
import moment from "moment";
import _ from "lodash";

const MIN_PRICE = 100

export default {
  components: { TableComponent },
  props     : {
    /**
     * 控制促销弹出层的显示隐藏
     */
    isVisible: {
      type     : Boolean,
      "default": false
    },
    /**
     * 商品ID
     */
    id: {
      type    : String,
      required: true
    },
    /**
     * 促销商品的货币单位
     */
    unit: {
      type    : String,
      required: true
    },
    /**
     * 权限
     */
    auth: {
      type    : Array,
      required: true
    }
  },
  data() {
    const validatePrice = (rule, value, callback) => {
      if (isNaN(value / MIN_PRICE)) {
        callback(new Error("请输入数字"));
      }
      callback();
    };
    const CONSTANT = 8.64e7
    return {
      // 用于判断促销信息是新增还是编辑, true 新增，false 编辑
      isNew          : true, 
      radioGroupNames: {
        setting: "设置",
        history: "历史"
      },
      panel       : "",
      disabledDate: { disabledDate: time => time.getTime() < Date.now() - CONSTANT },
      form        : {
        goods_id               : "",
        goods_pro_id           : "",
        goods_pro_price        : "",
        goods_pro_start_time   : "",
        goods_pro_end_time     : "",
        goods_pro_one_buy_limit: "",
        is_onsale              : "",
        goods_pro_total        : ""
      },
      rules: {
        goods_pro_price: [
          {
            required: true,
            message : "请输入促销价格",
            trigger : "change"
          },
          { validator: validatePrice, trigger: "change" }
        ],
        goods_pro_start_time: [
          {
            type    : "date",
            required: true,
            message : "请选择促销开始时间",
            trigger : "change"
          }
        ],
        goods_pro_end_time: [
          {
            type    : "date",
            required: true,
            message : "请选择促销结束时间",
            trigger : "change"
          }
        ]
      },
      tableData   : [],
      tableOptions: {
        loading: true,
        columns: [
          {
            label : "开始时间",
            prop  : "goods_pro_start_time",
            width : "150",
            render: value => moment(new Date(value)).format("YYYY-MM-DD")
          },
          {
            prop  : "goods_pro_end_time",
            label : "结束时间",
            width : "150",
            render: value => moment(new Date(value)).format("YYYY-MM-DD")
          },
          {
            prop  : "goods_pro_price",
            label : "价格",
            render: value => `${value / MIN_PRICE}元`
          }
        ]
      }
    };
  },

  watch: {
    auth() {
      this.panel = this.vmHasAuth(this.AdminPermissionsLib.PROMOTION_ADD,
        this.auth)
        ? this.radioGroupNames.setting
        : this.radioGroupNames.history;
    },
    id(newVal, oldVal) {
      newVal !== oldVal && this.getSalesInfo();
    }
  },
  methods: {
    async getSalesInfo() {
      this.tableOptions.loading = true;
      const sales = await this.$http.post(ADMIN_SALES_SEARCH_POST,
        this.createFormData({ goods_ids: this.id }));
      this.tableData = sales.data.data;
      this.tableOptions.loading = false;
    },
    submit: _.debounce(function() {
      this.$refs.goodForm.validate(async valid => {
        if (!valid) { return; }

        const url = this.isNew ? ADMIN_SALES_ADD_POST : ADMIN_SALES_UPDATE_POST;

        this.form.goods_id = this.id;
        this.form.unit = this.unit;
        this.form.goods_pro_start_time instanceof Date
          && (this.form.goods_pro_start_time = this.form.goods_pro_start_time.getTime());

        this.form.goods_pro_end_time instanceof Date
          && (this.form.goods_pro_end_time = this.form.goods_pro_end_time.getTime());

        const data = this.createFormData(this.form);
        const wait = this.vmLoadingFull();
        const res = await this.$http.post(url, data);
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess(this.isNew ? "添加成功！" : "更新成功！");
          this.$refs.goodForm.resetFields();
          this.resetForm();
          this.getSalesInfo();
          this.isNew = true;
          if (
            this.vmHasAuth(this.AdminPermissionsLib.PROMOTION_EDIT,
              this.auth)
            && !this.vmHasAuth(this.AdminPermissionsLib.PROMOTION_ADD, this.auth)
          ) {
            this.panel = this.radioGroupNames.history;
          }
        }
        wait.close();
      });
    }, this.DEBOUNCE_TIME),

    resetForm() {
      this.form.goods_id = "";
      this.form.goods_pro_id = "";
      this.form.goods_pro_price = "";
      this.form.goods_pro_start_time = "";
      this.form.goods_pro_end_time = "";
      this.form.goods_pro_one_buy_limit = "";
      this.form.goods_pro_total = "";
      this.form.is_onsale = "";
    },
    editSale(index, row) {
      this.isNew = false;
      this.panel = this.radioGroupNames.setting;
      this.form.goods_id = row.goods_id;
      this.form.goods_pro_id = row.goods_pro_id;
      this.form.goods_pro_price = row.goods_pro_price;
      this.form.goods_pro_start_time = row.goods_pro_start_time;
      this.form.goods_pro_end_time = row.goods_pro_end_time;
      this.form.goods_pro_one_buy_limit
        = row.goods_pro_one_buy_limit === -1 ? "" : row.goods_pro_one_buy_limit;
      this.form.goods_pro_total
        = row.goods_pro_total === -1 ? "" : row.goods_pro_total;
      this.form.is_onsale = row.is_onsale;
    },

    deleteSales: _.debounce(function(row) {
      this.vmConfirm({
        msg            : "确定删除该记录？",
        confirmCallback: async () => {
          const data = this.createFormData({
            goods_id    : row.goods_id,
            goods_pro_id: row.goods_pro_id
          });
          const wait = this.vmLoadingFull();
          const res = await this.$http.post(ADMIN_SALES_DELETE_POST, data);

          if (this.vmResponseHandler(res)) {
            this.vmMsgSuccess("删除成功！");
            const sale = this.tableData.find(o => o.goods_pro_id === row.goods_pro_id);
            this.tableData.splice(this.tableData.indexOf(sale), 1);
          }
          wait.close();
        }
      });
    }, this.DEBOUNCE_TIME),
    dialogColsed() {
      this.isNew = true;
      this.panel = this.radioGroupNames.setting;
      this.resetForm();
    },
    dialogClose() {
      // 解决报错 Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders
      this.$emit("close");
    }
  }
};
</script>
<style scoped>
.el-date-editor {
  background: #5e6165 !important;
  border-radius: 0;
}

.panel {
  text-align: center;
  margin-bottom: 2rem;
}

.sale-table /deep/ .el-table {
  margin-top: 0 !important;
}
</style>
