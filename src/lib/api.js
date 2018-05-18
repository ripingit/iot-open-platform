/** 管理员获取Token */
export const ADMIN_TOKEN_POST = 'manage/admin.php?m=Admin&c=Login&a=index'

/** 管理员登录 */
export const ADMIN_SIGNIN_POST = 'manage/admin.php?m=Admin&c=Login&a=login'

/** 管理员修改密码 */
export const ADMIN_CHANGE_PASS_POST = 'manage/admin.php?m=Admin&c=Login&a=lostPass'

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
export const CERT_UPLOAD_POST = 'manage/index.php?m=Home&c=Company&a=putObject'

/** 合作商认证 */
export const PARTNER_AUTH_POST = 'manage/index.php?m=Home&c=Company&a=companyAdd'
