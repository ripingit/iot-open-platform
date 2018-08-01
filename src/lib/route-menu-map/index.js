import { adminMenuRouteMap } from '@/lib/route-menu-map/admin'
import { coopMenuRouteMap } from '@/lib/route-menu-map/coop'
import { dealerMenuRouteMap } from '@/lib/route-menu-map/dealer'

function generateMenus (authList, menus) {
  let authCode = authList.map(o => o.cmd_id)
  for (let item of menus) {
    if (item.children) {
      item.auth = item.children.some(o => authCode.includes(o.id))
      generateMenus(authList, item.children)
    } else {
      item.auth = authCode.includes(item.id)
    }
  }
  return menus
}

export {
  adminMenuRouteMap,
  coopMenuRouteMap,
  dealerMenuRouteMap,
  generateMenus
}
