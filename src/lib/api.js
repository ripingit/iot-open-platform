/** 管理员获取权限数据 */
export const ADMIN_AUTH_GET = 'manage/admin.php?m=Admin&c=Login&a=getRes'

/** 管理员获取Token */
export const ADMIN_TOKEN_POST = 'manage/admin.php?m=Admin&c=Login&a=index'

/** 管理员登录 */
export const ADMIN_SIGNIN_POST = 'manage/admin.php?m=Admin&c=Login&a=login'

/** 管理员修改密码 */
export const ADMIN_CHANGE_PASS_POST = 'manage/admin.php?m=Admin&c=Login&a=changePass'

/** 管理员退出登录 */
export const ADMIN_SIGN_OUT_POST = 'manage/admin.php?m=Admin&c=Login&a=logOut'

/** 获取验证码 */
export const CODE_POST = 'manage/index.php?m=Home&c=Login&a=vcode'

/** 注册 */
export const SIGNUP_POST = 'manage/index.php?m=Home&c=Login&a=reg'

/** 获取token */
export const TOKEN_POST = 'manage/index.php?m=Home&c=Login&a=index'

/** 登录 */
export const SIGNIN_POST = 'manage/index.php?m=Home&c=Login&a=login'

/** 找回密码 */
export const LOST_PASS_POST = 'manage/index.php?m=Home&c=Login&a=lostPass'

/** 修改密码 */
export const CHANGE_PASS_POST = 'manage/index.php?m=Home&c=Login&a=changePass'

/** 退出登录 */
export const SIGN_OUT_POST = 'manage/index.php?m=Home&c=Login&a=logOut'

/** 合作商认证证件上传 */
export const CERT_UPLOAD_POST = '../manage/index.php?m=Home&c=Company&a=putObject'

/** 合作商认证 */
export const PARTNER_AUTH_POST = 'manage/index.php?m=Home&c=Company&a=companyAdd'

/** 合作商认证状态查询 */
export const UPDATE_AUTH_STATE_POST = 'manage/index.php?m=Home&c=Home&a=getCompanyStatus'

/** 合作商app查询 */
export const APP_SELECT_POST = 'manage/index.php?m=Home&c=App&a=appVerList'

/** 合作商app更新/新增 */
export const APP_ADD_POST = 'manage/index.php?m=Home&c=App&a=appVerAdd'

/** 合作商app删除 */
export const APP_DEL_POST = 'manage/index.php?m=Home&c=App&a=appVerDel'

/** 平台的app查询 */
export const APP_MANAGE_SELECT_POST = 'manage/admin.php?m=Admin&c=App&a=appVerList'

/** 平台的app删除 */
export const APP_MANAGE_DEL_POST = 'manage/admin.php?m=Admin&c=App&a=appVerDel'

/** 设备类别，类别查询 */
export const EQUIPMENT_CATEGORY_QUERY = 'manage/admin.php?m=Admin&c=ProductType&a=prodtList'

/** 设备类别，新增类别 */
export const EQUIPMENT_CATEGORY_ADD = 'manage/admin.php?m=Admin&c=ProductType&a=prodtAdd'

/** 设备类别，删除类别 */
export const EQUIPMENT_CATEGORY_DELETE = 'manage/admin.php?m=Admin&c=ProductType&a=prodtDel'

/** Admin型号审核，型号列表查询 */
export const GET_ADMIN_AUDIT_MODEL_POST = 'manage/admin.php?m=AdminA&c=CheckProduct&a=productList'

/** Admin型号审核，删除型号 */
export const DELETE_ADMIN_AUDIT_MODEL_POST = 'manage/admin.php?m=AdminA&c=CheckProduct&a=productDel'

/** Admin型号审核，审核型号 */
export const REVIEW_ADMIN_AUDIT_MODEL_POST = 'manage/admin.php?m=AdminA&c=CheckProduct&a=productReview'

/** Admin合作，获取合作商信息 */
export const GET_COOP_COMPANY_POST = 'manage/admin.php?m=Admin&c=Company&a=companyList'

/** Admin合作，删除合作商 */
export const DELETE_COOP_COMPANY_POST = 'manage/admin.php?m=Admin&c=Company&a=companyDel'

/** Admin固件管理，固件列表查询 */
export const GET_ADMIN_FIRMWARES_POST = 'manage/admin.php?m=Admin&c=Rom&a=deviceRomList'

/** Admin固件管理，获取固件历史信息 */
export const GET_ADMIN_FIRMWARE_HISTORY_POST = 'manage/admin.php?m=Admin&c=Rom&a=deviceRom'

/** 合作商固件管理，固件列表查询 */
export const GET_COOP_FIRMWARES_POST = 'manage/index.php?m=Home&c=Rom&a=deviceRomList'

/** 合作商固件管理，上传固件 */
export const COOP_FIRMWARES_UPLOAD_POST = '../manage/index.php?m=Home&c=Rom&a=putObject'

/** 合作商固件管理，新增固件 */
export const COOP_FIRMWARES_ADD_POST = 'manage/index.php?m=Home&c=Rom&a=deviceRomAdd'

/** 合作商固件管理，获取固件历史信息 */
export const GET_COOP_FIRMWARE_HISTORY_POST = 'manage/index.php?m=Home&c=Rom&a=deviceRom'

/** Admin固件审核，固件列表查询 */
export const GET_ADMIN_AUDIT_FIRMWARES_POST = 'manage/admin.php?m=Admin&c=CheckRom&a=deviceRomList'

/** Admin固件审核，审核固件 */
export const REVIEW_ADMIN_AUDIT_FIRMWARE_POST = 'manage/admin.php?m=Admin&c=CheckRom&a=deviceRomReview'

/** Admin固件审核，删除固件 */
export const DELETE_ADMIN_AUDIT_FIRMWARE_POST = 'manage/admin.php?m=Admin&c=CheckRom&a=deviceRomdel'

/** Admin公司审核，获取公司信息 */
export const GET_AUDIT_COMPANY_POST = 'manage/admin.php?m=Admin&c=CheckCompany&a=companyList'

/** Admin公司审核，删除公司 */
export const DELETE_AUDIT_COMPANY_POST = 'manage/admin.php?m=Admin&c=CheckCompany&a=companyDel'

/** Admin公司审核，审核公司 */
export const REVIEW_AUDIT_COMPANY_POST = 'manage/admin.php?m=Admin&c=CheckCompany&a=companyReview'

/** 平台管理，设备型号,型号查询 */
export const EQUIPMENT_MODEL_QUERY = 'manage/admin.php?m=AdminA&c=Product&a=productList'

/** 平台管理，设备型号,删除型号 */
export const EQUIPMENT_MODEL_DELETE = 'manage/admin.php?m=AdminA&c=Product&a=productDel'

/** 合作商,设备型号查询 */
export const USER_EQUIPMENT_MODEL_QUERY = 'manage/index.php?m=Home&c=Product&a=productList'

/** 合作商,上传图片 */
export const USER_EQUIPMENT_MODEL_UPLOADIMG = '../manage/index.php?m=Home&c=Product&a=putObject'

/** 合作商,新增设备型号 */
export const USER_EQUIPMENT_MODEL_ADD = 'manage/index.php?m=Home&c=Product&a=productAdd'

/** 合作商,删除设备型号 */
export const USER_EQUIPMENT_MODEL_DEL = 'manage/index.php?m=Home&c=Product&a=productDel'

/** 合作商,设备型号配置 */
export const USER_EQUIPMENT_MODEL_CONFIG = 'manage/index.php?m=Home&c=Product&a=productEdit'

/** 审核管理，类别查询 */
export const REVIEW_AUDIT_CATEGORY_SELECT = 'manage/admin.php?m=Admin&c=CheckProductType&a=prodtList'

/** 审核管理，类别删除 */
export const REVIEW_AUDIT_CATEGORY_DEL = 'manage/admin.php?m=Admin&c=CheckProductType&a=prodtDel'

/** 审核管理，类别审核 */
export const REVIEW_AUDIT_CATEGORY_REVIEW = '/manage/admin.php?m=Admin&c=CheckProductType&a=prodtReview'

/** 管理员,用户信息,用户查询 */
export const ADMIN_USER_QUERY = 'manage/admin.php?m=Admin&c=Admin&a=userList'

/** 管理员,用户信息,添加用户 */
export const ADMIN_USER_ADD = 'manage/admin.php?m=Admin&c=Admin&a=userAdd'

/** 管理员,用户信息,删除用户 */
export const ADMIN_USER_DEL = 'manage/admin.php?m=Admin&c=Admin&a=userDel'

/** 管理员,用户信息,用户添加用户权限（编辑） */
export const ADMIN_USER_POWER_ADD = 'manage/admin.php?m=Admin&c=Admin&a=groupUserSet'

/** 管理员,用户信息,重置用户密码 */
export const ADMIN_USER_RESET_PWD = 'manage/admin.php?m=Admin&c=Admin&a=changePassOther'

/** 管理员,权限管理,用户组查询 */
export const ADMIN_POWER_QUERY = 'manage/admin.php?m=Admin&c=AdminGroup&a=groupList'

/** 管理员,权限管理,添加用户组 */
export const ADMIN_POWER_ADD = 'manage/admin.php?m=Admin&c=AdminGroup&a=groupAdd'

/** 管理员,权限管理,编辑用户组 */
export const ADMIN_POWER_EDIT = 'manage/admin.php?m=Admin&c=AdminGroup&a=groupEdit'

/** 管理员,权限管理,删除用户组 */
export const ADMIN_POWER_DEL = 'manage/admin.php?m=Admin&c=AdminGroup&a=groupDel'

/** 管理员,用户组权限,用户组权限查询 */
export const ADMIN_POWERS_QUERY = 'manage/admin.php?m=Admin&c=AdminGroup&a=resList'

/** 管理员,用户组权限,修改用户组权限 */
export const ADMIN_POWERS_EDIT = 'manage/admin.php?m=Admin&c=AdminGroup&a=groupPermission'

/** 管理员,用户组成员,用户组成员查询 */
export const ADMIN_USERS_QUERY = 'manage/admin.php?m=Admin&c=AdminGroup&a=groupUserList'

/** 管理员,用户组成员,用户组用户解除授权 */
export const ADMIN_USERS_REMOVE = 'manage/admin.php?m=Admin&c=AdminGroup&a=groupUserSet'
