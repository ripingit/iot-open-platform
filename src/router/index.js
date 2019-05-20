/* eslint-disable no-undef */
import Vue from "vue"
import Router from "vue-router"
import store from "@/store/index"

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path    : "/",
      redirect: "/signin"
    },
    {
      path     : "/signin",
      component: resolve => require([ "@/pages/user/sign-in" ], resolve),
      meta     : { title: "登录" }
    },
    {
      path     : "/signup",
      component: resolve => require([ "@/pages/user/sign-up" ], resolve),
      meta     : { title: "注册" }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const filter = [ "/signin", "/signup", "/qrcode" ]

  // eslint-disable-next-line no-magic-numbers
  if (filter.includes(to.fullPath) || to.fullPath.indexOf("/qrcode") !== -1) {
    next(); return
  }
  if (store.getters.getUserIdentity !== Vue.prototype.identityCode.ADMIN
    && store.getters.getUserIdentity !== Vue.prototype.identityCode.COOP
    && store.getters.getUserIdentity !== Vue.prototype.identityCode.DEALER) {
    next(from.fullPath); return
  }
  next()
})

router.afterEach(route => {
  let documentTitle = ""
  route.matched.forEach(path => {
    if (path.meta.title) {
      documentTitle += `${path.meta.title}`
    }
  })

  document.title = documentTitle
})

export default router
