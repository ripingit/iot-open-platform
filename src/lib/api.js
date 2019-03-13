const params = {
  prod: 'manage',
  dev: 'manageTest'
}

const prefix = process.env.DEPLOY_ENV === 'dev' ? params.dev : params.prod

/** 管理员获取权限数据 */
export const ADMIN_AUTH_GET = prefix + '/admin.php?m=Admin&c=Login&a=getRes'

/** 管理员获取Token */
export const ADMIN_TOKEN_POST = prefix + '/admin.php?m=Admin&c=Login&a=index'

/** 管理员登录 */
export const ADMIN_SIGNIN_POST = prefix + '/admin.php?m=Admin&c=Login&a=login'

/** 管理员修改密码 */
export const ADMIN_CHANGE_PASS_POST = prefix + '/admin.php?m=Admin&c=Login&a=changePass'

/** 管理员退出登录 */
export const ADMIN_SIGN_OUT_POST = prefix + '/admin.php?m=Admin&c=Login&a=logOut'

/** 合作商获取权限数据 */
export const COOP_AUTH_GET = prefix + '/index.php?m=Home&c=Login&a=getRes'

/** 获取验证码 */
export const CODE_POST = prefix + '/index.php?m=Home&c=Login&a=vcode'

/** 注册 */
export const SIGNUP_POST = prefix + '/index.php?m=Home&c=Login&a=reg'

/** 获取token */
export const TOKEN_POST = prefix + '/index.php?m=Home&c=Login&a=index'

/** 登录 */
export const SIGNIN_POST = prefix + '/index.php?m=Home&c=Login&a=login'

/** 找回密码 */
export const LOST_PASS_POST = prefix + '/index.php?m=Home&c=Login&a=lostPass'

/** 修改密码 */
export const CHANGE_PASS_POST = prefix + '/index.php?m=Home&c=Login&a=changePass'

/** 退出登录 */
export const SIGN_OUT_POST = prefix + '/index.php?m=Home&c=Login&a=logOut'

/** 合作商认证证件上传 */
export const CERT_UPLOAD_POST = '../' + prefix + '/index.php?m=Home&c=Company&a=putObject'

/** 合作商认证 */
export const PARTNER_AUTH_POST = prefix + '/index.php?m=Home&c=Company&a=companyAdd'

/** 合作商、经销商认证状态查询 */
export const UPDATE_AUTH_STATE_POST = prefix + '/index.php?m=Home&c=Home&a=getCompanyStatus'

/** 合作商app查询 */
export const APP_SELECT_POST = prefix + '/index.php?m=Home&c=App&a=appVerList'

/** 合作商app更新/新增 */
export const APP_ADD_POST = prefix + '/index.php?m=Home&c=App&a=appVerAdd'

/** 合作商app删除 */
export const APP_DEL_POST = prefix + '/index.php?m=Home&c=App&a=appVerDel'

/** 平台的app查询 */
export const APP_MANAGE_SELECT_POST = prefix + '/admin.php?m=Admin&c=App&a=appVerList'

/** 平台的app删除 */
export const APP_MANAGE_DEL_POST = prefix + '/admin.php?m=Admin&c=App&a=appVerDel'

/** 设备类别，类别查询 */
export const EQUIPMENT_CATEGORY_QUERY = prefix + '/admin.php?m=Admin&c=ProductType&a=prodtList'

/** 设备类别，新增类别 */
export const EQUIPMENT_CATEGORY_ADD = prefix + '/admin.php?m=Admin&c=ProductType&a=prodtAdd'

/** 设备类别，删除类别 */
export const EQUIPMENT_CATEGORY_DELETE = prefix + '/admin.php?m=Admin&c=ProductType&a=prodtDel'

/** Admin型号审核，型号列表查询 */
export const GET_ADMIN_AUDIT_MODEL_POST = prefix + '/admin.php?m=AdminA&c=CheckProduct&a=productList'

/** Admin型号审核，删除型号 */
export const DELETE_ADMIN_AUDIT_MODEL_POST = prefix + '/admin.php?m=AdminA&c=CheckProduct&a=productDel'

/** Admin型号审核，审核型号 */
export const REVIEW_ADMIN_AUDIT_MODEL_POST = prefix + '/admin.php?m=AdminA&c=CheckProduct&a=productReview'

/** Admin合作，获取合作商信息 */
export const GET_COOP_COMPANY_POST = prefix + '/admin.php?m=Admin&c=Company&a=companyList'

/** Admin合作，获取合作商信息 */
export const GET_COOP_COMPANYKEY_POST = prefix + '/index.php?m=Admin&c=Company&a=baseList'

/** Admin合作，删除合作商 */
export const DELETE_COOP_COMPANY_POST = prefix + '/admin.php?m=Admin&c=Company&a=companyDel'

/** Admin固件管理，固件列表查询 */
export const GET_ADMIN_FIRMWARES_POST = prefix + '/admin.php?m=Admin&c=Rom&a=deviceRomList'

/** Admin固件管理，获取固件历史信息 */
export const GET_ADMIN_FIRMWARE_HISTORY_POST = prefix + '/admin.php?m=Admin&c=Rom&a=deviceRom'

/** 合作商固件管理，固件列表查询 */
export const GET_COOP_FIRMWARES_POST = prefix + '/index.php?m=Home&c=Rom&a=deviceRomList'

/** 合作商固件管理，上传固件 */
export const COOP_FIRMWARES_UPLOAD_POST = '../' + prefix + '/index.php?m=Home&c=Rom&a=putObject'

/** 合作商固件管理，新增固件 */
export const COOP_FIRMWARES_ADD_POST = prefix + '/index.php?m=Home&c=Rom&a=deviceRomAdd'

/** 合作商固件管理，撤销灰度的固件发布条件 */
export const COOP_CANCEL_RELEASE = prefix + '/index.php?m=Home&c=Rom&a=adminRomUpdCondAddDel'

/** 合作商固件管理，获取固件历史信息 */
export const GET_COOP_FIRMWARE_HISTORY_POST = prefix + '/index.php?m=Home&c=Rom&a=deviceRom'

/** Admin固件审核，固件列表查询 */
export const GET_ADMIN_AUDIT_FIRMWARES_POST = prefix + '/admin.php?m=Admin&c=CheckRom&a=deviceRomList'

/** Admin固件审核，审核固件 */
export const REVIEW_ADMIN_AUDIT_FIRMWARE_POST = prefix + '/admin.php?m=Admin&c=CheckRom&a=deviceRomReview'

/** Admin固件审核，删除固件 */
export const DELETE_ADMIN_AUDIT_FIRMWARE_POST = prefix + '/admin.php?m=Admin&c=CheckRom&a=deviceRomdel'

/** Admin公司审核，获取公司信息 */
export const GET_AUDIT_COMPANY_POST = prefix + '/admin.php?m=Admin&c=CheckCompany&a=companyList'

/** Admin公司审核，删除公司 */
export const DELETE_AUDIT_COMPANY_POST = prefix + '/admin.php?m=Admin&c=CheckCompany&a=companyDel'

/** Admin公司审核，审核公司 */
export const REVIEW_AUDIT_COMPANY_POST = prefix + '/admin.php?m=Admin&c=CheckCompany&a=companyReview'

/** 平台管理，设备型号,型号查询 */
export const EQUIPMENT_MODEL_QUERY = prefix + '/admin.php?m=AdminA&c=Product&a=productList'

/** 平台管理，设备型号,删除型号 */
export const EQUIPMENT_MODEL_DELETE = prefix + '/admin.php?m=AdminA&c=Product&a=productDel'

/** 平台管理，设备型号,编辑型号时上传图片 */
export const ADMIN_EQUIPMENT_MODEL_UPLOADIMG = '../' + prefix + '/admin.php?m=Admin&c=Product&a=putObject'

/** 平台管理，设备型号，编辑型号 */
export const ADMIN_EQUIPMENT_MODEL_UPDATE = prefix + '/admin.php?m=Admin&c=Product&a=productEditPic'

/** 合作商,设备型号查询 */
export const USER_EQUIPMENT_MODEL_QUERY = prefix + '/index.php?m=Home&c=Product&a=productList'

/** 合作商,上传图片 */
export const USER_EQUIPMENT_MODEL_UPLOADIMG = '../' + prefix + '/index.php?m=Home&c=Product&a=putObject'

/** 合作商,新增设备型号 */
export const USER_EQUIPMENT_MODEL_ADD = prefix + '/index.php?m=Home&c=Product&a=productAdd'

/** 合作商,删除设备型号 */
export const USER_EQUIPMENT_MODEL_DEL = prefix + '/index.php?m=Home&c=Product&a=productDel'

/** 合作商,设备型号配置 */
export const USER_EQUIPMENT_MODEL_CONFIG = prefix + '/index.php?m=Home&c=Product&a=productEdit'

/** 审核管理，类别查询 */
export const REVIEW_AUDIT_CATEGORY_SELECT = prefix + '/admin.php?m=Admin&c=CheckProductType&a=prodtList'

/** 审核管理，类别删除 */
export const REVIEW_AUDIT_CATEGORY_DEL = prefix + '/admin.php?m=Admin&c=CheckProductType&a=prodtDel'

/** 审核管理，类别审核 */
export const REVIEW_AUDIT_CATEGORY_REVIEW = '/' + prefix + '/admin.php?m=Admin&c=CheckProductType&a=prodtReview'

/** 管理员,用户信息,用户查询 */
export const ADMIN_USER_QUERY = prefix + '/admin.php?m=Admin&c=Admin&a=userList'

/** 管理员,用户信息,添加用户 */
export const ADMIN_USER_ADD = prefix + '/admin.php?m=Admin&c=Admin&a=userAdd'

/** 管理员,用户信息,删除用户 */
export const ADMIN_USER_DEL = prefix + '/admin.php?m=Admin&c=Admin&a=userDel'

/** 管理员,用户信息,用户添加用户权限（编辑） */
export const ADMIN_USER_POWER_ADD = prefix + '/admin.php?m=Admin&c=Admin&a=groupUserSet'

/** 管理员,用户信息,重置用户密码 */
export const ADMIN_USER_RESET_PWD = prefix + '/admin.php?m=Admin&c=Admin&a=changePassOther'

/** 管理员,权限管理,用户组查询 */
export const ADMIN_POWER_QUERY = prefix + '/admin.php?m=Admin&c=AdminGroup&a=groupList'

/** 管理员,权限管理,添加用户组 */
export const ADMIN_POWER_ADD = prefix + '/admin.php?m=Admin&c=AdminGroup&a=groupAdd'

/** 管理员,权限管理,编辑用户组 */
export const ADMIN_POWER_EDIT = prefix + '/admin.php?m=Admin&c=AdminGroup&a=groupEdit'

/** 管理员,权限管理,删除用户组 */
export const ADMIN_POWER_DEL = prefix + '/admin.php?m=Admin&c=AdminGroup&a=groupDel'

/** 管理员,用户组权限,用户组权限查询 */
export const ADMIN_POWERS_QUERY = prefix + '/admin.php?m=Admin&c=AdminGroup&a=resList'

/** 管理员,用户组权限,修改用户组权限 */
export const ADMIN_POWERS_EDIT = prefix + '/admin.php?m=Admin&c=AdminGroup&a=groupPermission'

/** 管理员,用户组成员,用户组成员查询 */
export const ADMIN_USERS_QUERY = prefix + '/admin.php?m=Admin&c=AdminGroup&a=groupUserList'

/** 管理员,用户组成员,用户组用户解除授权 */
export const ADMIN_USERS_REMOVE = prefix + '/admin.php?m=Admin&c=AdminGroup&a=groupUserSet'

/** 管理员, 用户管理获取用户 */
export const ADMIN_USERS_GET = prefix + '/admin.php?m=Admin&c=UserList&a=userList'

/** 合作商, 用户管理获取用户 */
export const COOP_USERS_GET = prefix + '/index.php?m=Home&c=UserList&a=userList'

/** 管理员，首页 */
export const ADMIN_HOMEDATA_QUERY = '/' + prefix + '/admin.php?m=Admin&c=Index&a=homePage'

/** 合作商，首页 */
export const COOP_HOMEDATA_QUERY = '/' + prefix + '/index.php?m=Home&c=Index&a=homePage'

/** admin商品管理, 获取商品 */
export const GET_GOODS_POST = prefix + '/admin.php?m=Admin&c=Goods&a=goodsquery'

/** admin商品管理，上传商品图片 */
export const GOOD_PIC_UPLOAD_POST = '../' + prefix + '/admin.php?m=Admin&c=Goods&a=putObject'

/** admin商品管理，添加商品 */
export const ADD_GOOD_POST = prefix + '/admin.php?m=Admin&c=Goods&a=goodsgenerate'

/** admin商品管理，修改商品 */
export const UPDATE_GOOD_POST = prefix + '/admin.php?m=Admin&c=Goods&a=goodsupdate'

/** admin商品管理，删除商品 */
export const DELETE_GOOD_POST = prefix + '/admin.php?m=Admin&c=Goods&a=goodsdelete'

/** 合作商固件管理，获取固件版本 */
export const GET_ROM_VER_POST = prefix + '/index.php?m=Home&c=Rom&a=adminRomUpdCondGet'

/** 合作商固件管理，固件升级发布 */
export const FIRMWARE_RELEASE_POST = prefix + '/index.php?m=Home&c=Rom&a=adminRomUpdCondAdd'

/** 合作商Key管理，查询Key */
export const GET_KEY_ID_POST = prefix + '/index.php?m=Home&c=Key&a=oauthBaseList'

/** 合作商Key管理，生成Key */
export const GENERATE_KEY_ID_POST = prefix + '/index.php?m=Home&c=Key&a=oauthBaseAdd'

/** 合作商key管理，删除Key */
export const COOP_DELETE_KEY_POST = prefix + '/index.php?m=Home&c=Key&a=oauthBaseDel'

/** 合作商key管理，设置回调URL */
export const SET_NOTIFY_URL_POST = prefix + '/index.php?m=Home&c=Key&a=adminClientNotifySet'

/** 获取app下载地址 */
export const GET_DOWNLOAD_URL_POST = prefix + '/index.php?m=Home&c=AppQrcode&a=appVerList'

/** 合作商app管理，查询app name */
export const GET_CLIENT_NAME_POST = prefix + '/index.php?m=Home&c=App&a=baseList'

/** 合作商设备生产，查询设备 */
export const GET_EQUIPMENT_POST = prefix + '/index.php?m=Home&c=Production&a=adminDeviceRootsList'

/** 合作商设备生产，设备返修信息查询 */
export const GET_EQUIPMENT_REWORK_POST = prefix + '/index.php?m=Home&c=Production&a=adminDeviceRepairList'

/** 合作商设备生产，设备返修图片上传 */
export const REWORK_UPLOAD_PIC_POST = '../' + prefix + '/index.php?m=Home&c=Production&a=putObject'

/** 合作商设备生产，添加设备返修 */
export const REWORK_ADD_POST = prefix + '/index.php?m=Home&c=Production&a=adminDeviceRepairAdd'

/** admin设备生产，查询设备 */
export const GET_ADMIN_EQUIPMENT_POST = prefix + '/admin.php?m=Admin&c=Production&a=adminDeviceRootsList'

/** admin设备生产，设备返修信息查询 */
export const GET_ADMIN_EQUIPMENT_REWORK_POST = prefix + '/admin.php?m=Admin&c=Production&a=adminDeviceRepairList'

/** 合作商权限管理，用户信息查询 */
export const GET_COOP_AUTH_USER_POST = prefix + '/index.php?m=Home&c=Admin&a=userList'

/** 合作商权限管理，删除用户 */
export const DELETE_COOP_AUTH_USER_POST = prefix + '/index.php?m=Home&c=Admin&a=userDel'

/** 合作商权限管理，添加用户 */
export const ADD_COOP_AUTH_USER_POST = prefix + '/index.php?m=Home&c=Admin&a=userAdd'

/** 合作商权限管理，为用户设置用户组 */
export const SET_COOP_AUTH_USERGROUP_POST = prefix + '/index.php?m=Home&c=Admin&a=groupUserSet'

/** 合作商权限管理，重置用户密码 */
export const RESET_PWD_AUTH_POST = prefix + '/index.php?m=Home&c=Admin&a=changePassOther'

/** 合作商权限管理，用户组查询 */
export const GET_COOP_USERGROUP_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=groupList'

/** 合作商权限管理，用户组添加 */
export const ADD_COOP_USERGROUP_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=groupAdd'

/** 合作商权限管理，用户组设置 */
export const SET_GROUP_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=groupEdit'

/** 合作商权限管理，删除用户组 */
export const DELETE_USERGROUP_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=groupDel'

/** 合作商权限管理，用户组权限数据查询 */
export const GET_USERGROUP_AUTH_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=resList'

/** 合作商权限管理，用户组权限设置 */
export const UPDATE_USERGROUP_AUTH_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=groupPermission'

/** 合作商权限管理，用户组成员查询 */
export const GET_USERGROUP_LIST_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=groupUserList'

/** 合作商权限管理，用户组授权解除 */
export const SET_USERGROUP_LIST_POST = prefix + '/index.php?m=Home&c=AdminGroup&a=groupUserSet'

/** 合作商审核固件查询 */
export const SET_USERFIRMWARE_LIST_POST = prefix + '/index.php?m=Home&c=CheckRom&a=deviceRomList'

/** 合作商审核固件查询 */
export const SET_USERFIRMWAREREVIEW_LIST_POST = prefix + '/index.php?m=Home&c=CheckRom&a=deviceRomReview'

/** 合作商设备管理设备信息查询 */
export const SET_USEREQUIPMENTMANAGEMENT_LIST_POST = prefix + '/index.php?m=Home&c=Device&a=adminDeviceRootsList'

/** 合作商设备管理查看设备返修信息 */
export const GET_USEREQUIPMENTMANAGEMENT_RECORD_POST = prefix + '/index.php?m=Home&c=Device&a=adminDeviceRepairList'

/** 合作商设备管理添加设备返修信息 */
export const USEREQUIPMENTMANAGEMENT_ADD_POST = prefix + '/index.php?m=Home&c=Device&a=adminDeviceRepairAdd'

/** 合作商设备管理添加设备图片上传返修信息 */
export const MANAGEMENTREWORK_UPLOAD_PIC_POST = '../' + prefix + '/index.php?m=Home&c=Device&a=putObject'

/** 合作商key管理，短信设置查询 */
export const COOP_SMS_QUERY_POST = prefix + '/index.php?m=Home&c=Key&a=adminSMSVcodeTempList'

/** 合作商key管理，短信设置添加 */
export const COOP_SMS_ADD_POST = prefix + '/index.php?m=Home&c=Key&a=adminSMSVcodeTempAdd'

/** 合作商key管理，短信设置更新 */
export const COOP_SMS_UPDATE_POST = prefix + '/index.php?m=Home&c=Key&a=adminSMSVcodeTempUpdate'

/** 合作商key管理，邮件设置查询 */
export const COOP_EMAIL_QUERY_POST = prefix + '/index.php?m=Home&c=Key&a=adminMailVcodeTempList'

/** 合作商key管理，邮件设置添加 */
export const COOP_EMAIL_ADD_POST = prefix + '/index.php?m=Home&c=Key&a=adminMailVcodeTempAdd'

/** 合作商key管理，邮件设置更新 */
export const COOP_EMAIL_UPDATE_POST = prefix + '/index.php?m=Home&c=Key&a=adminMailVcodeTempUpdate'

/** 合作商key管理，协议设置添加 */
export const COOP_PROTOCOL_ADD_POST = prefix + '/index.php?m=Home&c=Key&a=adminProtoSet'

/** 合作商key管理，协议设置查询 */
export const COOP_PROTOCOL_QUERY_POST = prefix + '/index.php?m=Home&c=Key&a=adminProtoList'

/** 合作商设备型号，生成设备ID */
export const COOP_GENERATE_DEVICE_ID_POST = prefix + '/index.php?m=Home&c=Product&a=deviceAdd'

/** 合作商经销商用户列表 */
export const COOP_AUTH_USER_LIST_POST = prefix + '/index.php?m=Admin&c=Powers&a=userList'

/** 合作商经销商用户列表的具体权限 */
export const COOP_AUTH_USER_PERMISSIONS_POST = prefix + '/index.php?m=Admin&c=Powers&a=resList'

/** 编辑合作商经销商用户列表的具体权限 */
export const COOP_AUTH_USER_PERMISSIONS_EDIT = prefix + '/index.php?m=Admin&c=Powers&a=aclUserPermission'

/** 合作商，上传app */
export const COOP_APP_UPLOAD_POST = '../' + prefix + '/index.php?m=Home&c=App&a=putObject'

/** 合作商，设备生产下载模板 */
export const COOP_PROD_TEMPLATE_POST = '../' + prefix + '/index.php?m=Home&c=Production&a=examplese'

/** 合作商，设备生产导入数据 */
export const COOP_PROD_IMPORT_POST = '../' + prefix + '/index.php?m=Home&c=Production&a=putObject'

/** 合作商，查询生产数据 */
export const COOP_PROD_DATA_QUERY = '../' + prefix + '/index.php?m=Home&c=ProductionData&a=adminDeviceRootsChart'

/** admin设备转移 */
export const ADMIN_TRANSFER_POST = prefix + '/admin.php?m=AdminA&c=Product&a=admindeviceexchange'

/** admin商品促销信息查询 */
export const ADMIN_SALES_SEARCH_POST = prefix + '/admin.php?m=Admin&c=Goods&a=GoodsPromotionList'

/** admin商品促销信息删除 */
export const ADMIN_SALES_DELETE_POST = prefix + '/admin.php?m=Admin&c=Goods&a=GoodsPromotionDelete'

/** admin商品促销信息添加 */
export const ADMIN_SALES_ADD_POST = prefix + '/admin.php?m=Admin&c=Goods&a=GoodsPromotionGenerate'

/** admin商品促销信息编辑 */
export const ADMIN_SALES_UPDATE_POST = prefix + '/admin.php?m=Admin&c=Goods&a=GoodsPromotionUpdate'

/** 合作商 app-logo上传 */
export const COOP_APP_LOGO_UPLOAD_POST = '../' + prefix + '/index.php?m=Home&c=App&a=putPic'

/** 合作商app 编辑 */
export const COOP_APP_UPDATE_POST = prefix + '/index.php?m=Home&c=App&a=appVerEdit'

/** admin设备类别编辑 */
export const ADMIN_EQUIPMENT_CATEGORY_EDIT = prefix + '/admin.php?m=Admin&c=ProductType&a=adminProdtEdit'
