
/** 常量定义库 */

/** app版本号 */
export const Version = "V 1.2.5"

/** 分页每页数据条数 */
export const pageSize = 20

/** 国家名称与代码 */
export const countrys = [
  { code: "all", name: "全球" }, { code: "CN", en: "China", name: "中国大陆" }, { code: "HK", en: "Hong Kong", name: "中国香港" }, { code: "TW", en: "Taiwan", name: "中国台湾" }, { code: "MO", en: "Macao", name: "中国澳门" }, { code: "AE", en: "United Arab Emirates", name: "阿联酋" }, { code: "US", en: "United States of America (USA)", name: "美国" }, { code: "MY", en: "Malaysia", name: "马来西亚" }, { code: "ID", en: "Indonesia", name: "印度尼西亚" }, { code: "BR", en: "Brazil", name: "巴西" }, { code: "AR", en: "Argentina", name: "阿根廷" }, { code: "AD", en: "Andorra", name: "安道尔" }, { code: "AF", en: "Afghanistan", name: "阿富汗" }, { code: "AG", en: "Antigua & Barbuda", name: "安提瓜和巴布达" }, { code: "AI", en: "Anguilla", name: "安圭拉" }, { code: "AL", en: "Albania", name: "阿尔巴尼亚" }, { code: "AM", en: "Armenia", name: "亚美尼亚" }, { code: "AO", en: "Angola", name: "安哥拉" }, { code: "AQ", en: "Antarctica", name: "南极洲" }, { code: "AS", en: "American Samoa", name: "美属萨摩亚" }, { code: "AT", en: "Austria", name: "奥地利" }, { code: "AU", en: "Australia", name: "澳大利亚" }, { code: "AW", en: "Aruba", name: "阿鲁巴" }, { code: "AX", en: "Aland Island", name: "奥兰群岛" }, { code: "AZ", en: "Azerbaijan", name: "阿塞拜疆" }, { code: "BA", en: "Bosnia & Herzegovina", name: "波黑" }, { code: "BB", en: "Barbados", name: "巴巴多斯" }, { code: "BD", en: "Bangladesh", name: "孟加拉" }, { code: "BE", en: "Belgium", name: "比利时" }, { code: "BF", en: "Burkina", name: "布基纳法索" }, { code: "BG", en: "Bulgaria", name: "保加利亚" }, { code: "BH", en: "Bahrain", name: "巴林" }, { code: "BI", en: "Burundi", name: "布隆迪" }, { code: "BJ", en: "Benin", name: "贝宁" }, { code: "BL", en: "Saint Barthélemy", name: "圣巴泰勒米岛" }, { code: "BM", en: "Bermuda", name: "百慕大" }, { code: "BN", en: "Brunei", name: "文莱" }, { code: "BO", en: "Bolivia", name: "玻利维亚" }, { code: "BQ", en: "Caribbean Netherlands", name: "荷兰加勒比区" }, { code: "BS", en: "The Bahamas", name: "巴哈马" }, { code: "BT", en: "Bhutan", name: "不丹" }, { code: "BV", en: "Bouvet Island", name: "布韦岛" }, { code: "BW", en: "Botswana", name: "博茨瓦纳" }, { code: "BY", en: "Belarus", name: "白俄罗斯" }, { code: "BZ", en: "Belize", name: "伯利兹" }, { code: "CA", en: "Canada", name: "加拿大" }, { code: "CC", en: "Cocos (Keeling) Islands", name: "科科斯群岛" }, { code: "CD", en: "Democratic Republic of the Congo", name: "刚果（金）" }, { code: "CF", en: "Central African Republic", name: "中非" }, { code: "CG", en: "Republic of the Congo", name: "刚果（布）" }, { code: "CH", en: "Switzerland", name: "瑞士" }, { code: "CI", en: "Cote dIvoire", name: "科特迪瓦" }, { code: "CK", en: "Cook Islands", name: "库克群岛" }, { code: "CL", en: "Chile", name: "智利" }, { code: "CM", en: "Cameroon", name: "喀麦隆" }, { code: "CO", en: "Colombia", name: "哥伦比亚" }, { code: "CR", en: "Costa Rica", name: "哥斯达黎加" }, { code: "CU", en: "Cuba", name: "古巴" }, { code: "CV", en: "Cape Verde", name: "佛得角" }, { code: "CW", en: "Curacao", name: "库拉索" }, { code: "CX", en: "Christmas Island", name: "圣诞岛" }, { code: "CY", en: "Cyprus", name: "塞浦路斯" }, { code: "CZ", en: "Czech Republic", name: "捷克" }, { code: "DE", en: "Germany", name: "德国" }, { code: "DJ", en: "Djibouti", name: "吉布提" }, { code: "DK", en: "Denmark", name: "丹麦" }, { code: "DM", en: "Dominica", name: "多米尼克" }, { code: "DO", en: "Dominican Republic", name: "多米尼加" }, { code: "DZ", en: "Algeria", name: "阿尔及利亚" }, { code: "EC", en: "Ecuador", name: "厄瓜多尔" }, { code: "EE", en: "Estonia", name: "爱沙尼亚" }, { code: "EG", en: "Egypt", name: "埃及" }, { code: "EH", en: "Western Sahara", name: "西撒哈拉" }, { code: "ER", en: "Eritrea", name: "厄立特里亚" }, { code: "ES", en: "Spain", name: "西班牙" }, { code: "ET", en: "Ethiopia", name: "埃塞俄比亚" }, { code: "FI", en: "Finland", name: "芬兰" }, { code: "FJ", en: "Fiji", name: "斐济群岛" }, { code: "FK", en: "Falkland Islands", name: "马尔维纳斯群岛（福克兰）" }, { code: "FM", en: "Federated States of Micronesia", name: "密克罗尼西亚联邦" }, { code: "FO", en: "Faroe Islands", name: "法罗群岛" }, { code: "FR", en: "France", name: "法国 法国" }, { code: "GA", en: "Gabon", name: "加蓬" }, { code: "GB", en: "Great Britain (United Kingdom; England)", name: "英国" }, { code: "GD", en: "Grenada", name: "格林纳达" }, { code: "GE", en: "Georgia", name: "格鲁吉亚" }, { code: "GF", en: "French Guiana", name: "法属圭亚那" }, { code: "GG", en: "Guernsey", name: "根西岛" }, { code: "GH", en: "Ghana", name: "加纳" }, { code: "GI", en: "Gibraltar", name: "直布罗陀" }, { code: "GL", en: "Greenland", name: "格陵兰" }, { code: "GM", en: "Gambia", name: "冈比亚" }, { code: "GN", en: "Guinea", name: "几内亚" }, { code: "GP", en: "Guadeloupe", name: "瓜德罗普" }, { code: "GQ", en: "Equatorial Guinea", name: "赤道几内亚" }, { code: "GR", en: "Greece", name: "希腊" }, { code: "GS", en: "South Georgia and the South Sandwich Islands", name: "南乔治亚岛和南桑威奇群岛" }, { code: "GT", en: "Guatemala", name: "危地马拉" }, { code: "GU", en: "Guam", name: "关岛" }, { code: "GW", en: "Guinea-Bissau", name: "几内亚比绍" }, { code: "GY", en: "Guyana", name: "圭亚那" }, { code: "HM", en: "Heard Island and McDonald Islands", name: "赫德岛和麦克唐纳群岛" }, { code: "HN", en: "Honduras", name: "洪都拉斯" }, { code: "HR", en: "Croatia", name: "克罗地亚" }, { code: "HT", en: "Haiti", name: "海地" }, { code: "HU", en: "Hungary", name: "匈牙利" }, { code: "IE", en: "Ireland", name: "爱尔兰" }, { code: "IL", en: "Israel", name: "以色列" }, { code: "IM", en: "Isle of Man", name: "马恩岛" }, { code: "IN", en: "India", name: "印度" }, { code: "IO", en: "British Indian Ocean Territory", name: "英属印度洋领地" }, { code: "IQ", en: "Iraq", name: "伊拉克" }, { code: "IR", en: "Iran", name: "伊朗" }, { code: "IS", en: "Iceland", name: "冰岛" }, { code: "IT", en: "Italy", name: "意大利" }, { code: "JE", en: "Jersey", name: "泽西岛" }, { code: "JM", en: "Jamaica", name: "牙买加" }, { code: "JO", en: "Jordan", name: "约旦" }, { code: "JP", en: "Japan", name: "日本" }, { code: "KE", en: "Kenya", name: "肯尼亚" }, { code: "KG", en: "Kyrgyzstan", name: "吉尔吉斯斯坦" }, { code: "KH", en: "Cambodia", name: "柬埔寨" }, { code: "KI", en: "Kiribati", name: "基里巴斯" }, { code: "KM", en: "The Comoros", name: "科摩罗" }, { code: "KN", en: "St. Kitts & Nevis", name: "圣基茨和尼维斯" }, { code: "KP", en: "North Korea", name: "朝鲜" }, { code: "KR", en: "South Korea", name: "韩国" }, { code: "KW", en: "Kuwait", name: "科威特" }, { code: "KY", en: "Cayman Islands", name: "开曼群岛" }, { code: "KZ", en: "Kazakhstan", name: "哈萨克斯坦" }, { code: "LA", en: "Laos", name: "老挝" }, { code: "LB", en: "Lebanon", name: "黎巴嫩" }, { code: "LC", en: "St. Lucia", name: "圣卢西亚" }, { code: "LI", en: "Liechtenstein", name: "列支敦士登" }, { code: "LK", en: "Sri Lanka", name: "斯里兰卡" }, { code: "LR", en: "Liberia", name: "利比里亚" }, { code: "LS", en: "Lesotho", name: "莱索托" }, { code: "LT", en: "Lithuania", name: "立陶宛" }, { code: "LU", en: "Luxembourg", name: "卢森堡" }, { code: "LV", en: "Latvia", name: "拉脱维亚" }, { code: "LY", en: "Libya", name: "利比亚" }, { code: "MA", en: "Morocco", name: "摩洛哥" }, { code: "MC", en: "Monaco", name: "摩纳哥" }, { code: "MD", en: "Moldova", name: "摩尔多瓦" }, { code: "ME", en: "Montenegro", name: "黑山" }, { code: "MF", en: "Saint Martin (France)", name: "法属圣马丁" }, { code: "MG", en: "Madagascar", name: "马达加斯加" }, { code: "MH", en: "Marshall islands", name: "马绍尔群岛" }, { code: "MK", en: "Republic of Macedonia (FYROM)", name: "马其顿" }, { code: "ML", en: "Mali", name: "马里" }, { code: "MM", en: "Myanmar (Burma)", name: "缅甸" }, { code: "MN", en: "Mongolia", name: "蒙古国" }, { code: "MP", en: "Northern Mariana Islands", name: "北马里亚纳群岛" }, { code: "MQ", en: "Martinique", name: "马提尼克" }, { code: "MR", en: "Mauritania", name: "毛里塔尼亚" }, { code: "MS", en: "Montserrat", name: "蒙塞拉特岛" }, { code: "MT", en: "Malta", name: "马耳他" }, { code: "MU", en: "Mauritius", name: "毛里求斯" }, { code: "MV", en: "Maldives", name: "马尔代夫" }, { code: "MW", en: "Malawi", name: "马拉维" }, { code: "MX", en: "Mexico", name: "墨西哥" }, { code: "MZ", en: "Mozambique", name: "莫桑比克" }, { code: "NA", en: "Namibia", name: "纳米比亚" }, { code: "NC", en: "New Caledonia", name: "新喀里多尼亚" }, { code: "NE", en: "Niger", name: "尼日尔" }, { code: "NF", en: "Norfolk Island", name: "诺福克岛" }, { code: "NG", en: "Nigeria", name: "尼日利亚" }, { code: "NI", en: "Nicaragua", name: "尼加拉瓜" }, { code: "NL", en: "Netherlands", name: "荷兰" }, { code: "NO", en: "Norway", name: "挪威" }, { code: "NP", en: "Nepal", name: "尼泊尔" }, { code: "NR", en: "Nauru", name: "瑙鲁" }, { code: "NU", en: "Niue", name: "纽埃" }, { code: "NZ", en: "New Zealand", name: "新西兰" }, { code: "OM", en: "Oman", name: "阿曼" }, { code: "PA", en: "Panama", name: "巴拿马" }, { code: "PE", en: "Peru", name: "秘鲁" }, { code: "PF", en: "French polynesia", name: "法属波利尼西亚" }, { code: "PG", en: "Papua New Guinea", name: "巴布亚新几内亚" }, { code: "PH", en: "The Philippines", name: "菲律宾" }, { code: "PK", en: "Pakistan", name: "巴基斯坦" }, { code: "PL", en: "Poland", name: "波兰" }, { code: "PM", en: "Saint-Pierre and Miquelon", name: "圣皮埃尔和密克隆" }, { code: "PN", en: "Pitcairn Islands", name: "皮特凯恩群岛" }, { code: "PR", en: "Puerto Rico", name: "波多黎各" }, { code: "PS", en: "Palestinian territories", name: "巴勒斯坦" }, { code: "PT", en: "Portugal", name: "葡萄牙" }, { code: "PW", en: "Palau", name: "帕劳" }, { code: "PY", en: "Paraguay", name: "巴拉圭" }, { code: "QA", en: "Qatar", name: "卡塔尔" }, { code: "RE", en: "Réunion", name: "留尼汪" }, { code: "RO", en: "Romania", name: "罗马尼亚" }, { code: "RS", en: "Serbia", name: "塞尔维亚" }, { code: "RU", en: "Russian Federation", name: "俄罗斯" }, { code: "RW", en: "Rwanda", name: "卢旺达" }, { code: "SA", en: "Saudi Arabia", name: "沙特阿拉伯" }, { code: "SB", en: "Solomon Islands", name: "所罗门群岛" }, { code: "SC", en: "Seychelles", name: "塞舌尔" }, { code: "SD", en: "Sudan", name: "苏丹" }, { code: "SE", en: "Sweden", name: "瑞典" }, { code: "SG", en: "Singapore", name: "新加坡" }, { code: "SH", en: "St. Helena & Dependencies", name: "圣赫勒拿" }, { code: "SI", en: "Slovenia", name: "斯洛文尼亚" }, { code: "SJ", en: "Svalbard and Jan Mayen", name: "斯瓦尔巴群岛和扬马延岛" }, { code: "SK", en: "Slovakia", name: "斯洛伐克" }, { code: "SL", en: "Sierra Leone", name: "塞拉利昂" }, { code: "SM", en: "San Marino", name: "圣马力诺" }, { code: "SN", en: "Senegal", name: "塞内加尔" }, { code: "SO", en: "Somalia", name: "索马里" }, { code: "SR", en: "Suriname", name: "苏里南" }, { code: "SS", en: "South Sudan", name: "南苏丹" }, { code: "ST", en: "Sao Tome & Principe", name: "圣多美和普林西比" }, { code: "SV", en: "El Salvador", name: "萨尔瓦多" }, { code: "SX", en: "Sint Maarten", name: "荷属圣马丁" }, { code: "SY", en: "Syria", name: "叙利亚" }, { code: "SZ", en: "Swaziland", name: "斯威士兰" }, { code: "TC", en: "Turks & Caicos Islands", name: "特克斯和凯科斯群岛" }, { code: "TD", en: "Chad", name: "乍得" }, { code: "TF", en: "French Southern Territories", name: "法属南部领地" }, { code: "TG", en: "Togo", name: "多哥" }, { code: "TH", en: "Thailand", name: "泰国" }, { code: "TJ", en: "Tajikistan", name: "塔吉克斯坦" }, { code: "TK", en: "Tokelau", name: "托克劳" }, { code: "TL", en: "Timor-Leste (East Timor)", name: "东帝汶" }, { code: "TM", en: "Turkmenistan", name: "土库曼斯坦" }, { code: "TN", en: "Tunisia", name: "突尼斯" }, { code: "TO", en: "Tonga", name: "汤加" }, { code: "TR", en: "Turkey", name: "土耳其" }, { code: "TT", en: "Trinidad & Tobago", name: "特立尼达和多巴哥" }, { code: "TV", en: "Tuvalu", name: "图瓦卢" }, { code: "TZ", en: "Tanzania", name: "坦桑尼亚" }, { code: "UA", en: "Ukraine", name: "乌克兰" }, { code: "UG", en: "Uganda", name: "乌干达" }, { code: "UM", en: "United States Minor Outlying Islands", name: "美国本土外小岛屿" }, { code: "UY", en: "Uruguay", name: "乌拉圭" }, { code: "UZ", en: "Uzbekistan", name: "乌兹别克斯坦" }, { code: "VA", en: "Vatican City (The Holy See)", name: "梵蒂冈" }, { code: "VC", en: "St. Vincent & the Grenadines", name: "圣文森特和格林纳丁斯" }, { code: "VE", en: "Venezuela", name: "委内瑞拉" }, { code: "VG", en: "British Virgin Islands", name: "英属维尔京群岛" }, { code: "VI", en: "United States Virgin Islands", name: "美属维尔京群岛" }, { code: "VN", en: "Vietnam", name: "越南" }, { code: "VU", en: "Vanuatu", name: "瓦努阿图" }, { code: "WF", en: "Wallis and Futuna", name: "瓦利斯和富图纳" }, { code: "WS", en: "Samoa", name: "萨摩亚" }, { code: "YE", en: "Yemen", name: "也门" }, { code: "YT", en: "Mayotte", name: "马约特" }, { code: "ZA", en: "South Africa", name: "南非" }, { code: "ZM", en: "Zambia", name: "赞比亚" }, { code: "ZW", en: "Zimbabwe", name: "津巴布韦" }
]

/** 国家货币名称与代码 */
export const currencyCode = [
  {
    currency: "人民币",
    code    : "CNY"
  },
  {
    currency: "美元",
    code    : "USD"
  },
  {
    currency: "港币",
    code    : "HKD"
  }
]

/*
 * [
 *   {
 *     currency: '人民币',
 *     code: 'CNY'
 *   }, {
 *     currency: '巴西雷亚尔',
 *     code: 'BRL'
 *   }, {
 *     currency: '印尼盾',
 *     code: 'IDR'
 *   }, {
 *     currency: '马来西亚林吉特',
 *     code: 'MYR'
 *   }, {
 *     currency: '泰铢',
 *     code: 'THB'
 *   }, {
 *     currency: '美元',
 *     code: 'USD'
 *   }, {
 *     currency: '土耳其里拉',
 *     code: 'TRY'
 *   }, {
 *     currency: '俄罗斯卢布',
 *     code: 'RUB'
 *   }, {
 *     currency: '印度卢比',
 *     code: 'INR '
 *   }, {
 *     currency: '台币',
 *     code: 'TWD'
 *   }, {
 *     currency: '韩元',
 *     code: 'KRW'
 *   }, {
 *     currency: '英镑',
 *     code: 'GBP'
 *   }, {
 *     currency: '越南盾',
 *     code: 'VND'
 *   }, {
 *     currency: '澳元',
 *     code: 'AUD'
 *   }, {
 *     currency: '港币',
 *     code: 'HKD'
 *   }, {
 *     currency: '迪拉姆',
 *     code: 'AED'
 *   }, {
 *     currency: '南非兰特',
 *     code: 'ZAR'
 *   }, {
 *     currency: '墨西哥比索',
 *     code: 'MXN'
 *   }, {
 *     currency: '阿根廷比索',
 *     code: 'ARS'
 *   }
 * ]
 */

/**
 * 应用商店
 * id 请勿随意更改，appStore数组顺序改变后会影响扫描二维码下载
 */
export const appStore = [
  {
    id  : 0,
    name: "安卓通用（国内）",
    url : ""
  },
  {
    id  : 1,
    name: "安卓通用（国外）",
    url : ""
  },
  {
    id  : 2,
    name: "豌豆荚",
    url : ""
  },
  {
    id  : 3,
    name: "应用宝",
    url : ""
  },
  {
    id  : 4,
    name: "iPhone App Store",
    url : ""
  },
  {
    id  : 5,
    name: "华为",
    url : ""
  },
  {
    id  : 6,
    name: "小米",
    url : ""
  },
  {
    id  : 7,
    name: "vivo",
    url : ""
  },
  {
    id  : 8,
    name: "OPPO",
    url : ""
  },
  {
    id  : 9,
    name: "三星",
    url : ""
  },
  {
    id  : 10,
    name: "百度",
    url : ""
  },
  {
    id  : 11,
    name: "魅族",
    url : ""
  },
  {
    id  : 12,
    name: "360",
    url : ""
  },
  {
    id  : 13,
    name: "锤子",
    url : ""
  }
]

/**
 * app管理语言
 *
 */
export const appManageLanguage = [
  {
    id  : 0,
    name: "中文",
    lang: "zh",
    desc: ""
  },
  {
    id  : 1,
    name: "英文",
    lang: "en",
    desc: ""
  },
  {
    id  : 2,
    name: "意大利语",
    lang: "it",
    desc: ""
  },
  {
    id  : 3,
    name: "葡萄牙语",
    lang: "pt",
    desc: ""
  }
]

/** 短信设置模板语言 */
export const langTemplate = [
  {
    id  : 1,
    name: "中文模板"
  },
  {
    id  : 2,
    name: "英文模板"
  }
]

/** 短信设置模板类型 */
export const typeTemplate = [
  {
    id  : 1,
    name: "注册"
  },
  {
    id  : 2,
    name: "找回密码"
  },
  {
    id  : 3,
    name: "更换账号"
  }
]

/** 协议设置语言 */
export const protocolLangTemplate = [
  {
    id  : "zh",
    name: "中文"
  },
  {
    id  : "en",
    name: "英语"
  },
  {
    id  : "pt",
    name: "葡萄牙语"
  },
  {
    id  : "it",
    name: "意大利语"
  }
]

/** 多语言 */
export const multiLanguage = [
  {
    id  : "CN",
    name: "中文"
  },
  {
    id  : "EN",
    name: "英语"
  },
  {
    id  : "PT",
    name: "葡萄牙语"
  },
  {
    id  : "IT",
    name: "意大利语"
  },
  {
    id  : "RU",
    name: "俄罗斯语"
  }
]

/** 协议设置类型 */
export const protocolTemplate = [
  {
    id  : 1,
    name: "用户协议"
  },
  {
    id  : 2,
    name: "隐私协议"
  },
  {
    id  : 3,
    name: "云存储协议"
  },
  {
    id  : 4,
    name: "使用说明"
  }
]

/** APP类型 */
export const appType = [
  {
    id  : 1,
    name: "手机APP"
  },
  {
    id  : 2,
    name: "平台应用"
  },
  {
    id  : 3,
    name: "桌面应用"
  }
]

