<template>
  <div class="content">
    <el-row>
      <el-col :span="24">
        <div class="main">
          <div class="body">
            <div class="pannel" @click="apply(coop)">
              <p class="text-left pan">{{$t("iot_plat_i_am")}}</p>
              <p class="text-left pan-name">{{$t("iot_plat_partner")}}</p>
              <div class="icon-pannel">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-hezuochangshang"></use>
                </svg>
              </div>
              <p class="prief">{{$t("iot_plat_auth_etc_partner")}}</p>
            </div>
            <div class="pannel" @click="apply(dealer)">
              <p class="text-right pan">{{$t("iot_plat_i_am")}}</p>
              <p class="text-right pan-name">{{$t("iot_plat_dealer")}}</p>
              <div class="icon-pannel">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jingxiaoshang"></use>
                </svg>
              </div>
              <p class="prief">{{$t("iot_plat_auth_etc_dealer")}}</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <p class="coop-ad">{{$t("iot_plat_more_coop_emial")}}</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getState } from "@/lib/mixins"
export default {
  mixins: [ { methods: { getState } } ],
  data () {
    return {
      coop    : "coop",
      dealer  : "dealer",
      applyUrl: {
        coop  : `/manage/user/authention`,
        dealer: `/manage/dealerRegister`
      }
    }
  },
  methods: {
    apply (identity) {
      if (identity === this.dealer) {
        // 经销商
        const DEALER = 2
        this.getState(DEALER).then(() => {
          /*
           * if (res && res.data.DealerAndCompanys) {
           *   this.vmMsgWarning('你已经是经销商，无法再申请！'); return
           * }
           */
          this.$router.push(this.applyUrl[identity])
        })
      } else {
        this.$router.push(this.applyUrl[identity])
      }
    }
  }
}
</script>

<style scoped>
@media (max-width:1366px) { /**小于笔记本屏幕 */
  .content {
    top: -0.08rem;
  }
  .main {
    padding-bottom: 4000px;
    margin-bottom: -4000px;
    background:#292c31;
    height: 100%;
    overflow: auto;
  }
}

@media (min-width:1366px) { /**大于笔记本屏幕 */
  .content {
    height: 100%;
    padding-top: 4.67rem;
    background:#292c31;
  }
  .main, .body {
    height: 100%;
  }
}

.body {
  display: flex;
  align-items: center;
  margin-top: 16.76rem;
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

.coop-ad {
  text-align: center;
  color: #fff;
  font-size: 14px;
  margin-top: 12rem;
}
</style>
