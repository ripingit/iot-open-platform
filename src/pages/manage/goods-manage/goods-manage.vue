<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">商品管理</p>
        <p class="title-en">THE COMMODITY MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <el-select v-model="classId">
                <el-option label="请选择" value></el-option>
                <el-option
                  v-for="item in tableData.class"
                  :key="item.class_id"
                  :label="item.class_desc"
                  :value="item.class_id"
                ></el-option>
              </el-select>
              <el-select v-model="isOnSale">
                <el-option label="请选择" value></el-option>
                <el-option label="已上架" :value="1"></el-option>
                <el-option label="已下架" :value="2"></el-option>
              </el-select>
              <el-select v-model="country">
                <el-option
                  v-for="(item, index) in countryWithCode"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
              <el-input placeholder="请输入商品ID" v-model="goodId" clearable></el-input>
              <el-button class="btn-search" type="primary" @click="getGoodLists(1)">查询</el-button>
              <el-button
                v-if="vmHasAuth(AdminPermissionsLib.GOODS_ADD, tableData.res)"
                class="btn-circle-delete el-button--primary is-circle"
                type="primary"
                icon="el-icon-plus"
                circle
                @click="addGoods"
              ></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table v-loading="loading" :data="tableData.data" style="width: 100%">
                <el-table-column type="index" label="编号" width="80"></el-table-column>
                <el-table-column prop="goods_name" label="名称"></el-table-column>
                <el-table-column prop="country" label="地区">
                  <template
                    slot-scope="scope"
                  >{{ countryWithCode.find(o=>o.code === scope.row.country).name }}</template>
                </el-table-column>
                <el-table-column prop="class_name" label="类型">
                  <template
                    slot-scope="scope"
                  >{{ tableData.class.find(o => o.class_name === scope.row.class_name).class_desc }}</template>
                </el-table-column>
                <el-table-column prop="goods_lasteddate" label="规格">
                  <template slot-scope="scope">{{ scope.row.goods_lasteddate >= 30 ? (scope.row.goods_lasteddate / 30) + '月' : scope.row.goods_lasteddate + '天' }}</template>
                </el-table-column>
                <el-table-column prop="price" label="价格">
                  <template slot-scope="scope">{{ scope.row.price / 100}}元</template>
                </el-table-column>
                <el-table-column prop="unit" label="币种"></el-table-column>
                <el-table-column prop="goods_adddate" label="创建时间" width="200">
                  <template
                    slot-scope="scope"
                  >{{ dateFormat(new Date(scope.row.goods_adddate * 1000), 'yyyy-MM-dd hh:mm:ss') }}</template>
                </el-table-column>
                <el-table-column prop="goods_sale_all" label="总销量"></el-table-column>
                <el-table-column prop="goods_sale_month" label="月销量"></el-table-column>
                <el-table-column prop="is_onsale" label="商品状态">
                  <template slot-scope="scope">{{ goodSaleCode[scope.row.is_onsale] }}</template>
                </el-table-column>
                <!-- <el-table-column prop="is_promotion" label="促销状态">
                  <template slot-scope="scope">{{ goodPromotionCode[scope.row.is_promotion] }}</template>
                </el-table-column>-->
                <el-table-column
                  label="操作"
                  width="160"
                  v-if="vmHasAuth(AdminPermissionsLib.GOODS_ADD, tableData.res)"
                >
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-bianji"
                      circle
                      @click="updateGood(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-cuxiao"
                      circle
                      v-if="vmHasAuth(AdminPermissionsLib.PROMOTION_ADD, tableData.res) || vmHasAuth(AdminPermissionsLib.PROMOTION_DEL, tableData.res) || vmHasAuth(AdminPermissionsLib.PROMOTION_QUERY, tableData.res) || vmHasAuth(AdminPermissionsLib.PROMOTION_EDIT, tableData.res)"
                      @click="saleSetting(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-shanchu"
                      circle
                      @click="deleteGood(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getGoodLists"
                @current-change="getGoodLists"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="tableData.total"
              ></el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <SaleSettingComponent
      :id="salesId"
      :unit="unit"
      :auth="tableData.res"
      :isVisible="isSaleDialogVisible"
      @close="salesDialogClose"
    ></SaleSettingComponent>

    <el-dialog :title="title" :visible.sync="isDialogVisibleAdd" center>
      <el-form
        label-position="right"
        status-icon
        label-width="100px"
        :model="goodForm"
        :rules="rules"
        ref="goodForm"
      >
        <el-form-item class="form-row" label="类型" prop="goods_class_id">
          <el-select v-model="goodForm.goods_class_id" placeholder="请选择商品类型" no-data-text="无数据">
            <el-option
              v-for="item in tableData.class"
              :key="item.class_id"
              :label="item.class_desc"
              :value="item.class_id"
            ></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="销售区域" prop="country">
          <el-select v-model="goodForm.country" placeholder="请选择销售区域" no-data-text="无数据">
            <el-option
              v-for="(item, index) in countryWithCode"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="商品名称" prop="goods_name">
          <el-select v-model="goodForm.goods_name" placeholder="请选择商品名称" no-data-text="无数据">
            <el-option :key="1" label="3*24小时" value="3*24"></el-option>
            <el-option :key="2" label="7*24小时" value="7*24"></el-option>
            <el-option :key="3" label="新用户专享" value="新用户专享"></el-option>
          </el-select>
          <!-- <el-input v-model="goodForm.goods_name" auto-complete="off" placeholder="请输入商品名称"></el-input> -->
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="商品价格" prop="goods_price">
          <el-input v-model="goodForm.goods_price" auto-complete="off" placeholder="请输入商品价格">
            <template
              slot="append"
            >{{ isNaN(goodForm.goods_price/100) ? 0 : goodForm.goods_price/100}} 元</template>
          </el-input>

          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="币种" prop="unit">
          <el-select v-model="goodForm.unit" placeholder="请选择币种" no-data-text="无数据">
            <el-option
              v-for="(item, index) in currencyWithCode"
              :key="index"
              :label="item.currency"
              :value="item.code"
            ></el-option>
            <!-- <el-option :key="2" label="美元" value="USD"></el-option> -->
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="规格" prop="goods_lasteddate">
          <el-select v-model="goodForm.goods_lasteddate" placeholder="请输入商品规格" no-data-text="无数据">
            <el-option key="7天" label="7天" :value="7"></el-option>
            <el-option key="15天" label="15天" :value="15"></el-option>
            <el-option key="1个月" label="1个月" :value="30"></el-option>
            <el-option key="2个月" label="6个月" :value="180"></el-option>
            <el-option key="3个月" label="12个月" :value="360"></el-option>
          </el-select>
          <!-- <el-input v-model="goodForm.goods_lasteddate" auto-complete="off" placeholder="请输入商品规格"></el-input> -->
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="状态" prop="is_onsale" v-if="goodForm.is_onsale">
          <el-select v-model="goodForm.is_onsale" placeholder="请选择商品状态" no-data-text="无数据">
            <el-option :key="1" label="上架" :value="1"></el-option>
            <el-option :key="2" label="下架" :value="2"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="商品图片" prop="goods_picture">
          <div class="form-btn-upload">
            <UploadComponent
              ref="uploaderGoodPic"
              :path="uploadPath"
              :previewPath="goodForm.goods_picture"
              :accept="['.jpg', '.jpeg', '.png']"
              :size="2"
              model="preview"
              condition="格式为 jpg\jpeg\png 且小于2M"
              @response="getUploadResult"
            ></UploadComponent>
          </div>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="描述" prop="goods_desc">
          <el-input type="textarea" :rows="6" v-model="goodForm.goods_desc" placeholder="请输入商品描述"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import { countrys, currencyCode } from "@/lib/const";
import UploadComponent from "@/components/uploader/upload.vue";
import SaleSettingComponent from "./sale-settting.vue";
import {
  GET_GOODS_POST,
  GOOD_PIC_UPLOAD_POST,
  ADD_GOOD_POST,
  UPDATE_GOOD_POST,
  DELETE_GOOD_POST
} from "@/lib/api";
import _ from "lodash";

export default {
  components: { UploadComponent, SaleSettingComponent },
  data() {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "goods_name") {
          callback(new Error("请输入商品名称"));
        } else if (rule.field === "goods_class_id") {
          callback(new Error("请选择类型"));
        } else if (rule.field === "goods_price") {
          callback(new Error("请输入商品价格"));
        } else if (rule.field === "unit") {
          callback(new Error("请选择币种"));
        } else if (rule.field === "country") {
          callback(new Error("请选择销售区域"));
        } else if (rule.field === "goods_lasteddate") {
          callback(new Error("请输入商品有效时长"));
        } else if (rule.field === "goods_desc") {
          callback(new Error("请输入商品描述"));
        } else if (rule.field === "goods_picture") {
          callback(new Error("请上传商品图片"));
        } else if (rule.field === "is_onsale") {
          callback(new Error("请选择商品状态"));
        }
      }
      callback();
    };
    return {
      loading            : false,
      title              : "",
      isDialogVisibleList: false,
      isDialogVisibleAdd : false,
      isSaleDialogVisible: false,
      salesId            : "-1",
      unit               : "",
      isOnSale           : "",
      country            : "",
      countryWithCode    : countrys,
      currencyWithCode   : currencyCode,
      goodId             : "",
      classId            : "",
      uploadPath         : GOOD_PIC_UPLOAD_POST,
      tableData          : {
        "class": [],
        data   : [],
        page   : "1",
        res    : [],
        pageAll: 1,
        product: [],
        total  : 1
      },
      goodForm: {
        goods_id        : "",
        goods_name      : "",
        goods_class_id  : "",
        goods_price     : "",
        unit            : "",
        country         : "",
        goods_lasteddate: "",
        goods_desc      : "",
        goods_picture   : "",
        is_onsale       : "",
        url_old         : ""
      },
      rules: {
        goods_name      : [ { validator: validateIsEmpty, trigger: "blur" } ],
        goods_class_id  : [ { validator: validateIsEmpty, trigger: "blur" } ],
        goods_price     : [ { validator: validateIsEmpty, trigger: "blur" } ],
        unit            : [ { validator: validateIsEmpty, trigger: "blur" } ],
        country         : [ { validator: validateIsEmpty, trigger: "blur" } ],
        goods_lasteddate: [ { validator: validateIsEmpty, trigger: "blur" } ],
        goods_desc      : [ { validator: validateIsEmpty, trigger: "blur" } ],
        goods_picture   : [ { validator: validateIsEmpty, trigger: "blur" } ],
        is_onsale       : [ { validator: validateIsEmpty, trigger: "blur" } ]
      }
    };
  },
  created() {
    this.getGoodLists(1);
    document.body.addEventListener("keydown", this.keyCodeDown, false);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.keyCodeDown, false);
  },
  methods: {
    keyCodeDown(e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        if (this.isDialogVisibleAdd) {
          this.submit();
          return;
        }
        this.getGoodLists(1);
      }
    },
    updateGood(index, row) {
      const classType = this.tableData["class"].find(o => o.class_name === row.class_name);
      this.title = "更新商品";
      this.goodForm.goods_id = row.goods_id;
      this.goodForm.goods_name = row.goods_name;
      this.goodForm.goods_class_id = classType ? classType.class_id : "";
      this.goodForm.goods_price = row.price;
      this.goodForm.unit = row.unit;
      this.goodForm.country = row.country;
      this.goodForm.goods_lasteddate = row.goods_lasteddate;
      this.goodForm.goods_desc = row.goods_desc;
      this.goodForm.goods_picture = row.goods_picture;
      this.goodForm.is_onsale = row.is_onsale;
      this.goodForm.url_old = row.goods_picture;
      this.isDialogVisibleAdd = true;
    },

    saleSetting(index, row) {
      this.isSaleDialogVisible = true;
      this.salesId = row.goods_id;
      this.unit = row.unit;
    },

    salesDialogClose() {
      this.isSaleDialogVisible = false;
    },
    getGoodLists: _.debounce(async function(currentPage) {
      try {
        const data = this.createFormData({
          page     : currentPage,
          page_size: 20,
          is_onsale: this.isOnSale,
          class_id : this.classId,
          country  : this.country,
          goods_id : this.goodId
        });
        this.loading = true;
        const res = await this.$http.post(GET_GOODS_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.vmMsgError("程序错误！");
      }
    }, this.DEBOUNCE_TIME),

    getUploadResult(res) {
      if (res) {
        this.goodForm.goods_picture = res.goods_picture;
      }
    },
    addGoods() {
      this.title = "添加商品";
      Object.keys(this.goodForm).forEach(o => {
        this.goodForm[o] = "";
      });
      this.isDialogVisibleAdd = true;
    },
    submit: _.debounce(function() {
      const wait = this.vmLoadingFull();
      try {
        this.$refs.goodForm.validate(async valid => {
          if (valid) {
            const url = this.title === "添加商品" ? ADD_GOOD_POST : UPDATE_GOOD_POST;
            this.goodForm.url_old = this.title === "添加商品" ? "" : this.goodForm.url_old;
            const res = await this.$http.post(url, this.createFormData(this.goodForm))
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("提交成功！");
              this.isDialogVisibleAdd = false;
              this.getGoodLists(this.tableData.page);
              this.$refs.goodForm.resetFields();
              this.$refs.uploaderGoodPic.reset();
            }
            wait.close();
          }
        });  
      } catch (error) {
        wait.close();
        this.vmMsgError("程序错误！");
      }
    }, this.DEBOUNCE_TIME),
    deleteGood: _.debounce(function(row) {
      const wait = this.vmLoadingFull();
      try {
        this.vmConfirm({
          msg            : "确定删除该记录？",
          confirmCallback: async () => {
            const data = this.createFormData({
              goods_id: row.goods_id,
              url_old : row.goods_picture
            });
            const res = await this.$http.post(DELETE_GOOD_POST, data)
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("删除成功！");
              this.getGoodLists(this.tableData.page);
            }
            wait.close();
          }
        });  
      } catch (error) {
        wait.close();
        this.vmMsgError("程序错误！");
      }
    }, this.DEBOUNCE_TIME)
  }
};
</script>
<style scoped>
.content-container /deep/ .el-dialog {
  width: 54rem;
}
.el-dialog .form-img-cert {
  display: inline-block;
  width: 14rem;
  height: 8rem;
  background: #636363;
  vertical-align: middle;
  color: #fff;
  text-align: center;
  line-height: 8rem;
}
.el-dialog .form-btn-upload {
  display: inline-block;
  vertical-align: middle;
}
.el-dialog .form-btn-upload .btn-upload {
  height: 8rem;
  width: 3rem;
  border-radius: 0;
  padding: 0;
  font-size: 1.2rem;
  background: #1f7ecf;
  border: none;
}
</style>
