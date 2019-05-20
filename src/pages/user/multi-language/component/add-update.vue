<template>
  <el-dialog :title="title" :visible.sync="isVisible" width="50rem" center :before-close="close">
    <el-form label-width="120px" status-icon :model="i18nForm" ref="i18nForm" :rules="rules" :hide-required-asterisk="true">
      <el-form-item label="变量名" class="form-row" prop="str_id">
        <el-input v-model="i18nForm.str_id" placeholder="请输入变量名" :disabled="model !== 0"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item v-for="(item, index) in multiLanguage" :key="index" :label="item.name" class="form-row" :prop="item.id">
        <el-input v-model="translation[item.id]" placeholder="请输入翻译语言"></el-input>
      </el-form-item>
      <el-form-item label style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="submit()">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { COOP_I18N_ADD, COOP_I18N_UPDATE } from "@/lib/api";
import { multiLanguage } from "@/lib/const";
import _ from "lodash";

const TITLE = {
  add   : "添加",
  update: "修改"
}

export default {
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    },
    /**
     * 修改时所需数据
     */
    data : { type: Object },
    /**
     * 判断是编辑还是添加，0 添加，1 编辑
     */
    model: {
      type     : Number,
      required : true,
      "default": 0
    }
  },
  watch: {
    isVisible (newVal) {
      if (newVal && this.model === 1) {
        this.i18nForm.str_id = this.data.str_id
        this.translation = _.clone(this.data.str_translation)
      }
    },
    model(newVal) {
      if (newVal || newVal === 0) {
        if (newVal === 0) {
          this.title = TITLE.add
        } else {
          this.title = TITLE.update
        }
      }
    }
  },
  data () {
    return {
      title        : TITLE.add,
      multiLanguage: multiLanguage,
      i18nForm     : {
        str_id         : "",
        str_translation: ""
      },
      translation: {},

      rules: {
        str_id: [
          { required: true, message: "请输入变量名", trigger: "change" }
        ]
      }
    }
  },
  created () {
    multiLanguage.map(o => o.id).forEach(item => {
      this.$set(this.translation, item, "")
    })
  },
  methods: {
    close () {
      this.resetFormData()
      this.$refs.i18nForm.resetFields();
      this.$emit("close")
    },

    resetFormData () {
      Object.keys(this.translation).forEach(key => {
        this.translation[key] = ""
      })
      this.i18nForm.str_id = ""
    },

    submit: _.debounce(function() {
      // 标识翻译是否有填写
      let flag = false
      const keys = Object.keys(this.translation)
      for (let index = 0; index < keys.length; index++) {
        if (this.translation[keys[index]]) {
          flag = true;
          break;
        }
      }

      if (!flag) {
        return this.vmMsgError("请至少填写一种语言翻译！")
      } 

      const loading = this.vmLoadingFull();
      try {
        this.$refs.i18nForm.validate(async valid => {
          if (valid) {
            this.i18nForm.str_translation = JSON.stringify(this.translation)
            const param = this.createFormData(this.i18nForm);
            const url = this.model === 0 ? COOP_I18N_ADD : COOP_I18N_UPDATE
            const res = await this.$http.post(url, param)
            if (this.vmResponseHandler(res)) {
              this.resetFormData()
              this.vmMsgSuccess(this.model === 0 ? "添加成功！" : "修改成功！");
              this.$refs.i18nForm.resetFields();
              this.$emit("close", true)
            }
            loading.close();
          }
        });
      } catch (error) {
        loading.close();
        this.vmMsgError("程序错误！");
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
