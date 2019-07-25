
import Vue from "vue"
import VueI18n from "vue-i18n"
import locale from "element-ui/lib/locale";
import messages from "./package/index"

Vue.use(VueI18n)

const i18n = new VueI18n({
  // set locale
  locale        : localStorage.getItem("lang"),
  // 回退语言
  fallbackLocale: "EN",
  // set locale messages
  messages
})
locale.i18n((key, value) => i18n.t(key, value))
export default i18n
