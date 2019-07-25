<template>
  <el-dialog :title="$t('iot_plat_goods_sales_setting')" :visible="isVisible" center @close="dialogClose" @closed="dialogColsed">
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
        label-width="150px"
        :model="form"
        :rules="rules"
        ref="goodForm"
        :hide-required-asterisk="true"
      >
        <el-form-item class="form-row" :label="$t('iot_plat_sales_price')" prop="goods_pro_price">
          <el-input v-model="form.goods_pro_price" auto-complete="off" :placeholder="$t('iot_plat_input_sales_price')">
            <template
              slot="append"
            >{{ isNaN(form.goods_pro_price/100) ? 0 : form.goods_pro_price/100}} {{$t("iot_plat_yuan")}}</template>
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>

        <el-form-item class="form-row" :label="$t('iot_plat_sales_time')" required>
          <el-form-item prop="goods_pro_start_time">
            <el-date-picker
              v-model="form.goods_pro_start_time"
              :picker-options="disabledDate"
              type="date"
              :placeholder="$t('iot_plat_select_start_sales_time')"
            ></el-date-picker>
            <span class="form-tip">*</span>
          </el-form-item>
          <el-form-item prop="goods_pro_end_time">
            <el-date-picker
              v-model="form.goods_pro_end_time"
              :picker-options="disabledDate"
              type="date"
              :placeholder="$t('iot_plat_select_end_sales_time')"
            ></el-date-picker>
            <span class="form-tip">*</span>
          </el-form-item>
        </el-form-item>

        <el-form-item class="form-row" :label="$t('iot_plat_one_person_buy_limit')" prop="goods_pro_one_buy_limit">
          <el-input
            v-model="form.goods_pro_one_buy_limit"
            auto-complete="off"
            :placeholder="$t('iot_plat_input_one_person_buy_limit')"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_sales_total')" prop="goods_pro_total">
          <el-input v-model="form.goods_pro_total" auto-complete="off" :placeholder="$t('iot_plat_input_sales_total')"></el-input>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_sales_state')" prop="is_onsale" v-if="!isNew">
          <el-select v-model="form.is_onsale" :placeholder="$t('iot_plat_select_sales_state')" :no-data-text="$t('iot_plat_none_data')">
            <el-option key="1" :label="$t('iot_plat_open')" :value="1"></el-option>
            <el-option key="2" :label="$t('iot_plat_close')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submit">{{$t("iot_plat_submit")}}</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template
      v-if="panel === radioGroupNames.history && vmHasAuth(AdminPermissionsLib.PROMOTION_QUERY, auth)"
    >
      <TableComponent class="sale-table" :options="tableOptions" :data="tableData">
        <el-table-column
          :label="$t('iot_plat_operate')"
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
        callback(new Error(this.$t("iot_plat_input_number_please")));
      }
      callback();
    };
    const CONSTANT = 8.64e7
    return {
      // 用于判断促销信息是新增还是编辑, true 新增，false 编辑
      isNew          : true, 
      radioGroupNames: {
        setting: this.$t("iot_plat_setting"),
        history: this.$t("iot_plat_history")
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
            message : this.$t("iot_plat_input_sales_price"),
            trigger : "change"
          },
          { validator: validatePrice, trigger: "change" }
        ],
        goods_pro_start_time: [
          {
            type    : "date",
            required: true,
            message : this.$t("iot_plat_select_start_sales_time"),
            trigger : "change"
          }
        ],
        goods_pro_end_time: [
          {
            type    : "date",
            required: true,
            message : this.$t("iot_plat_select_end_sales_time"),
            trigger : "change"
          }
        ]
      },
      tableData   : [],
      tableOptions: {
        loading: true,
        columns: [
          {
            label : this.$t("iot_plat_start_time"),
            prop  : "goods_pro_start_time",
            width : "150",
            render: value => moment(new Date(value)).format("YYYY-MM-DD")
          },
          {
            prop  : "goods_pro_end_time",
            label : this.$t("iot_plat_end_time"),
            width : "150",
            render: value => moment(new Date(value)).format("YYYY-MM-DD")
          },
          {
            prop  : "goods_pro_price",
            label : this.$t("iot_plat_price"),
            render: value => `${value / MIN_PRICE}${this.$t("iot_plat_yuan")}`
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
          this.vmMsgSuccess(this.isNew ? this.$t("iot_plat_add_success") : this.$t("iot_plat_update_success"));
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
        msg            : this.$t("iot_plat_confirm_delete_data"),
        confirmCallback: async () => {
          const data = this.createFormData({
            goods_id    : row.goods_id,
            goods_pro_id: row.goods_pro_id
          });
          const wait = this.vmLoadingFull();
          const res = await this.$http.post(ADMIN_SALES_DELETE_POST, data);

          if (this.vmResponseHandler(res)) {
            this.vmMsgSuccess(this.$t("iot_plat_delete_success"));
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
