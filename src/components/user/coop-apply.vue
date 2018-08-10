<template>
  <el-row class="content">
    <el-col :span="24">
      <div class="body">
          <div class="pannel" @click="apply(coop)">
            <p class="text-left pan">我是</p>
            <p class="text-left pan-name">合作商</p>
            <div class="icon-pannel">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-hezuochangshang"></use>
              </svg>
            </div>
            <p class="prief">设备生产、型号、固件、app管理等</p>
          </div>
          <div class="pannel" @click="apply(dealer)">
            <p class="text-right pan">我是</p>
            <p class="text-right pan-name">经销商</p>
            <div class="icon-pannel">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jingxiaoshang"></use>
              </svg>
            </div>
            <p class="prief">设备管理等</p>
          </div>
        </div>
    </el-col>
  </el-row>
</template>

<script>
import { UPDATE_AUTH_STATE_POST } from '@/lib/api.js'
export default {
  data () {
    return {
      coop: 'coop',
      dealer: 'dealer',
      applyUrl: {
        coop: `/manage/user/authention`,
        dealer: `/manage/user/dealerRegister`
      }
    }
  },
  methods: {
    apply (identity) {
      if (identity === this.dealer) {
        this.getState(2).then(res => {
          if (res && res.data.DealerAndCompanys) {
            this.vmMsgWarning('你已经是经销商，无法再申请！'); return
          }
          this.$router.push(this.applyUrl[identity])
        })
      } else {
        this.$router.push(this.applyUrl[identity])
      }
    },

    getState (code) {
      return new Promise((resolve, reject) => {
        let loading = this.vmLoadingFull()
        this.$http.post(UPDATE_AUTH_STATE_POST, this.createFormData({role: code})).then(res => {
          loading.close()
          if (this.vmResponseHandler(res)) {
            resolve(res)
          }
          resolve()
        })
      })
    }
  }
}
</script>

<style scoped>
@media (max-width:1366px) { /**小于笔记本屏幕 */
  .content {
    top: -0.08rem;
  }
  .body {
    margin-top: 16.67rem;
  }
}

@media (min-width:1366px) { /**大于笔记本屏幕 */
  .content {
    display: flex;
    height: 100%;
    padding-top: 4.67rem;
    background:#292c31;
  }
  .body {
    height: 100%;
    margin-top: 10.67rem;
  }
}

.body {
  display: flex;
  align-items: center;
}
.pannel {
  width: 23.5rem;
  height: 32.83rem;
  border: 2px solid #fff;
  border-radius: 20px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 2.08rem 1.67rem;
  cursor: pointer;
}
.pan {
  color: #959595;
  font-size: 16px;
}
.pan-name {
  font-size: 32px;
  color: #fff;
  margin-top: 0.75rem;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.icon {
  width: 10.33rem;
  height: 9.25rem;
  margin: 0 auto;
}
.icon-pannel {
  height: 80%;
  display: flex;
  align-items: center;
}

.prief {
  color: #fefefe;
  text-align: center;
  font-size: 13px;
}
</style>
