
/** 常量定义库 */

/** 图片不可用替代图片 */
// eslint-disable-next-line no-undef
export const noPicture = process.env.DEPLOY_ENV === "dev" ? "/static/img/no-pic.png" : "/management/static/img/no-pic.png"

/** app版本号 */
export const Version = "V 1.2.5"

/** 分页每页数据条数 */
export const pageSize = 20

/** 
 * 国家名称与代码
 * name 为多语言变量标识
 * remark 方便查询code码表示的意思
 */
export const countrys = [
  { 
    code  : "all",
    name  : "iot_plat_global",
    remark: "全球"
  },
  { code: "CN", en: "China", name: "iot_plat_china_mainland", remark: "中国大陆" },
  { code: "HK", en: "Hong Kong", name: "iot_plat_china_hk", remark: "中国香港" },
  { code: "TW", en: "Taiwan", name: "iot_plat_china_tw", remark: "中国台湾" },
  { code: "MO", en: "Macao", name: "iot_plat_china_macao", remark: "中国澳门" },
  { code: "AE", en: "United Arab Emirates", name: "iot_plat_united_arab_emirates", remark: "阿联酋" },
  { code: "US", en: "United States of America (USA)", name: "iot_plat_united_states", remark: "美国" }, 
  { code: "MY", en: "Malaysia", name: "iot_plat_malaysia", remark: "马来西亚" }, 
  { code: "ID", en: "Indonesia", name: "iot_plat_indonesia", remark: "印度尼西亚" }, 
  { code: "BR", en: "Brazil", name: "iot_plat_brazil", remark: "巴西" },
  { code: "AR", en: "Argentina", name: "iot_plat_argentina", remark: "阿根廷" },
  { code: "AD", en: "Andorra", name: "iot_plat_andorra", remark: "安道尔" },
  { code: "AF", en: "Afghanistan", name: "iot_plat_afghan", remark: "阿富汗" },
  { code: "AG", en: "Antigua & Barbuda", name: "iot_plat_antigua_and_barbuda", remark: "安提瓜和巴布达" },
  { code: "AI", en: "Anguilla", name: "iot_plat_anguilla", remark: "安圭拉" },
  { code: "AL", en: "Albania", name: "iot_plat_albania", remark: "阿尔巴尼亚" },
  { code: "AM", en: "Armenia", name: "iot_plat_armenia", remark: "亚美尼亚" },
  { code: "AO", en: "Angola", name: "iot_plat_angola", remark: "安哥拉" },
  { code: "AQ", en: "Antarctica", name: "iot_plat_antarctica", remark: "南极洲" },
  { code: "AS", en: "American Samoa", name: "iot_plat_american_samoa", remark: "美属萨摩亚" },
  { code: "AT", en: "Austria", name: "iot_plat_austria", remark: "奥地利" },
  { code: "AU", en: "Australia", name: "iot_plat_australia", remark: "澳大利亚" },
  { code: "AW", en: "Aruba", name: "iot_plat_aruba", remark: "阿鲁巴" },
  { code: "AX", en: "Aland Island", name: "iot_plat_aland_islands", remark: "奥兰群岛" },
  { code: "AZ", en: "Azerbaijan", name: "iot_plat_azerbaijan", remark: "阿塞拜疆" },
  { code: "BA", en: "Bosnia & Herzegovina", name: "iot_plat_bosnia", remark: "波黑" },
  { code: "BB", en: "Barbados", name: "iot_plat_barbados", remark: "巴巴多斯" },
  { code: "BD", en: "Bangladesh", name: "iot_plat_bengal", remark: "孟加拉" },
  { code: "BE", en: "Belgium", name: "iot_plat_belgium", remark: "比利时" },
  { code: "BF", en: "Burkina", name: "iot_plat_burkina_faso", remark: "布基纳法索" },
  { code: "BG", en: "Bulgaria", name: "iot_plat_bulgaria", remark: "保加利亚" },
  { code: "BH", en: "Bahrain", name: "iot_plat_bahrain", remark: "巴林" },
  { code: "BI", en: "Burundi", name: "iot_plat_burundi", remark: "布隆迪" },
  { code: "BJ", en: "Benin", name: "iot_plat_benin", remark: "贝宁" },
  { code: "BL", en: "Saint Barthélemy", name: "iot_plat_st_barthelemy", remark: "圣巴泰勒米岛" },
  { code: "BM", en: "Bermuda", name: "iot_plat_bermuda", remark: "百慕大" },
  { code: "BN", en: "Brunei", name: "iot_plat_brunei", remark: "文莱" },
  { code: "BO", en: "Bolivia", name: "iot_plat_bolivia", remark: "玻利维亚" },
  { code: "BQ", en: "Caribbean Netherlands", name: "iot_plat_dutch_caribbean", remark: "荷兰加勒比区" },
  { code: "BS", en: "The Bahamas", name: "iot_plat_bahamas", remark: "巴哈马" },
  { code: "BT", en: "Bhutan", name: "iot_plat_bhutan", remark: "不丹" },
  { code: "BV", en: "Bouvet Island", name: "iot_plat_bouvet_island", remark: "布韦岛" },
  { code: "BW", en: "Botswana", name: "iot_plat_botswana", remark: "博茨瓦纳" },
  { code: "BY", en: "Belarus", name: "iot_plat_belarus", remark: "白俄罗斯" },
  { code: "BZ", en: "Belize", name: "iot_plat_belize", remark: "伯利兹" },
  { code: "CA", en: "Canada", name: "iot_plat_canada", remark: "加拿大" },
  { code: "CC", en: "Cocos (Keeling) Islands", name: "iot_plat_cocos_islands", remark: "科科斯群岛" },
  { code: "CD", en: "Democratic Republic of the Congo", name: "iot_plat_congo_gold", remark: "刚果（金）" },
  { code: "CF", en: "Central African Republic", name: "iot_plat_central_africa", remark: "中非" },
  { code: "CG", en: "Republic of the Congo", name: "iot_plat_congo_cloth", remark: "刚果（布）" },
  { code: "CH", en: "Switzerland", name: "iot_plat_switzerland", remark: "瑞士" },
  { code: "CI", en: "Cote dIvoire", name: "iot_plat_cote_dIvoire", remark: "科特迪瓦" },
  { code: "CK", en: "Cook Islands", name: "iot_plat_cook_islands", remark: "库克群岛" },
  { code: "CL", en: "Chile", name: "iot_plat_chile", remark: "智利" },
  { code: "CM", en: "Cameroon", name: "iot_plat_cameroon", remark: "喀麦隆" },
  { code: "CO", en: "Colombia", name: "iot_plat_colombia", remark: "哥伦比亚" },
  { code: "CR", en: "Costa Rica", name: "iot_plat_costa_rica", remark: "哥斯达黎加" },
  { code: "CU", en: "Cuba", name: "iot_plat_cuba", remark: "古巴" },
  { code: "CV", en: "Cape Verde", name: "iot_plat_cape_verde", remark: "佛得角" },
  { code: "CW", en: "Curacao", name: "iot_plat_curacao", remark: "库拉索" },
  { code: "CX", en: "Christmas Island", name: "iot_plat_christmas_island", remark: "圣诞岛" },
  { code: "CY", en: "Cyprus", name: "iot_plat_cyprus", remark: "塞浦路斯" },
  { code: "CZ", en: "Czech Republic", name: "iot_plat_czech", remark: "捷克" },
  { code: "DE", en: "Germany", name: "iot_plat_germany", remark: "德国" },
  { code: "DJ", en: "Djibouti", name: "iot_plat_djibouti", remark: "吉布提" },
  { code: "DK", en: "Denmark", name: "iot_plat_aenmark", remark: "丹麦" },
  { code: "DM", en: "Dominica", name: "iot_plat_dominic", remark: "多米尼克" },
  { code: "DO", en: "Dominican Republic", name: "iot_plat_dominica", remark: "多米尼加" },
  { code: "DZ", en: "Algeria", name: "iot_plat_algeria", remark: "阿尔及利亚" },
  { code: "EC", en: "Ecuador", name: "iot_plat_ecuador", remark: "厄瓜多尔" },
  { code: "EE", en: "Estonia", name: "iot_plat_estonia", remark: "爱沙尼亚" },
  { code: "EG", en: "Egypt", name: "iot_plat_egypt", remark: "埃及" },
  { code: "EH", en: "Western Sahara", name: "iot_plat_western_sahara", remark: "西撒哈拉" },
  { code: "ER", en: "Eritrea", name: "iot_plat_eritrea", remark: "厄立特里亚" },
  { code: "ES", en: "Spain", name: "iot_plat_spain", remark: "西班牙" },
  { code: "ET", en: "Ethiopia", name: "iot_plat_ethiopia", remark: "埃塞俄比亚" },
  { code: "FI", en: "Finland", name: "iot_plat_finland", remark: "芬兰" },
  { code: "FJ", en: "Fiji", name: "iot_plat_fiji_islands", remark: "斐济群岛" },
  { code: "FK", en: "Falkland Islands", name: "iot_plat_malvinas_islands_fokland", remark: "马尔维纳斯群岛（福克兰）" },
  { code: "FM", en: "Federated States of Micronesia", name: "iot_plat_federated_states_of_micronesia", remark: "密克罗尼西亚联邦" },
  { code: "FO", en: "Faroe Islands", name: "iot_plat_faroe_islands", remark: "法罗群岛" },
  { code: "FR", en: "France", name: "iot_plat_france", remark: "法国" },
  { code: "GA", en: "Gabon", name: "iot_plat_gabon", remark: "加蓬" },
  { code: "GB", en: "Great Britain (United Kingdom; England)", name: "iot_plat_britain", remark: "英国" },
  { code: "GD", en: "Grenada", name: "iot_plat_grenada", remark: "格林纳达" },
  { code: "GE", en: "Georgia", name: "iot_plat_georgia", remark: "格鲁吉亚" },
  { code: "GF", en: "French Guiana", name: "iot_plat_french_guiana", remark: "法属圭亚那" },
  { code: "GG", en: "Guernsey", name: "iot_plat_guernsey", remark: "根西岛" },
  { code: "GH", en: "Ghana", name: "iot_plat_ghana", remark: "加纳" },
  { code: "GI", en: "Gibraltar", name: "iot_plat_gibraltar", remark: "直布罗陀" },
  { code: "GL", en: "Greenland", name: "iot_plat_greenland", remark: "格陵兰" },
  { code: "GM", en: "Gambia", name: "iot_plat_gambia", remark: "冈比亚" },
  { code: "GN", en: "Guinea", name: "iot_plat_guinea", remark: "几内亚" },
  { code: "GP", en: "Guadeloupe", name: "iot_plat_guadeloupe", remark: "瓜德罗普" },
  { code: "GQ", en: "Equatorial Guinea", name: "iot_plat_equatorial_guinea", remark: "赤道几内亚" },
  { code: "GR", en: "Greece", name: "iot_plat_greece", remark: "希腊" },
  { code: "GS", en: "South Georgia and the South Sandwich Islands", name: "iot_plat_south_georgia", remark: "南乔治亚岛和南桑威奇群岛" },
  { code: "GT", en: "Guatemala", name: "iot_plat_guatemala", remark: "危地马拉" },
  { code: "GU", en: "Guam", name: "iot_plat_guam", remark: "关岛" },
  { code: "GW", en: "Guinea-Bissau", name: "iot_plat_guinea_bissau", remark: "几内亚比绍" },
  { code: "GY", en: "Guyana", name: "iot_plat_guyana", remark: "圭亚那" },
  { code: "HM", en: "Heard Island and McDonald Islands", name: "iot_plat_heard_island", remark: "赫德岛和麦克唐纳群岛" },
  { code: "HN", en: "Honduras", name: "iot_plat_honduras", remark: "洪都拉斯" },
  { code: "HR", en: "Croatia", name: "iot_plat_croatia", remark: "克罗地亚" },
  { code: "HT", en: "Haiti", name: "iot_plat_haiti", remark: "海地" },
  { code: "HU", en: "Hungary", name: "iot_plat_hungary", remark: "匈牙利" },
  { code: "IE", en: "Ireland", name: "iot_plat_ireland", remark: "爱尔兰" },
  { code: "IL", en: "Israel", name: "iot_plat_israel", remark: "以色列" },
  { code: "IM", en: "Isle of Man", name: "iot_plat_isle_of_man", remark: "马恩岛" },
  { code: "IN", en: "India", name: "iot_plat_indian", remark: "印度" },
  { code: "IO", en: "British Indian Ocean Territory", name: "iot_plat_british_indian_ocean_territory", remark: "英属印度洋领地" },
  { code: "IQ", en: "Iraq", name: "iot_plat_iraq", remark: "伊拉克" },
  { code: "IR", en: "Iran", name: "iot_plat_iran", remark: "伊朗" },
  { code: "IS", en: "Iceland", name: "iot_plat_iceland", remark: "冰岛" },
  { code: "IT", en: "Italy", name: "iot_plat_italy", remark: "意大利" },
  { code: "JE", en: "Jersey", name: "iot_plat_jersey", remark: "泽西岛" },
  { code: "JM", en: "Jamaica", name: "iot_plat_jamaica", remark: "牙买加" },
  { code: "JO", en: "Jordan", name: "iot_plat_jordan", remark: "约旦" },
  { code: "JP", en: "Japan", name: "iot_plat_japan", remark: "日本" },
  { code: "KE", en: "Kenya", name: "iot_plat_kenya", remark: "肯尼亚" },
  { code: "KG", en: "Kyrgyzstan", name: "iot_plat_kyrgyzstan", remark: "吉尔吉斯斯坦" },
  { code: "KH", en: "Cambodia", name: "iot_plat_cambodia", remark: "柬埔寨" },
  { code: "KI", en: "Kiribati", name: "iot_plat_kiribati", remark: "基里巴斯" },
  { code: "KM", en: "The Comoros", name: "iot_plat_comoros", remark: "科摩罗" },
  { code: "KN", en: "St. Kitts & Nevis", name: "iot_plat_saint_kitts_and_nevis", remark: "圣基茨和尼维斯" },
  { code: "KP", en: "North Korea", name: "iot_plat_north_korea", remark: "朝鲜" },
  { code: "KR", en: "South Korea", name: "iot_plat_korea", remark: "韩国" },
  { code: "KW", en: "Kuwait", name: "iot_plat_kuwait", remark: "科威特" },
  { code: "KY", en: "Cayman Islands", name: "iot_plat_cayman_islands", remark: "开曼群岛" },
  { code: "KZ", en: "Kazakhstan", name: "iot_plat_kazakhstan", remark: "哈萨克斯坦" },
  { code: "LA", en: "Laos", name: "iot_plat_laos", remark: "老挝" },
  { code: "LB", en: "Lebanon", name: "iot_plat_lebanon", remark: "黎巴嫩" },
  { code: "LC", en: "St. Lucia", name: "iot_plat_saint_lucia", remark: "圣卢西亚" },
  { code: "LI", en: "Liechtenstein", name: "iot_plat_liechtenstein", remark: "列支敦士登" },
  { code: "LK", en: "Sri Lanka", name: "iot_plat_sri_lanka", remark: "斯里兰卡" },
  { code: "LR", en: "Liberia", name: "iot_plat_liberia", remark: "利比里亚" },
  { code: "LS", en: "Lesotho", name: "iot_plat_lesotho", remark: "莱索托" },
  { code: "LT", en: "Lithuania", name: "iot_plat_lithuania", remark: "立陶宛" },
  { code: "LU", en: "Luxembourg", name: "iot_plat_luxembourg", remark: "卢森堡" },
  { code: "LV", en: "Latvia", name: "iot_plat_latvia", remark: "拉脱维亚" },
  { code: "LY", en: "Libya", name: "iot_plat_libya", remark: "利比亚" },
  { code: "MA", en: "Morocco", name: "iot_plat_morocco", remark: "摩洛哥" },
  { code: "MC", en: "Monaco", name: "iot_plat_monaco", remark: "摩纳哥" },
  { code: "MD", en: "Moldova", name: "iot_plat_moldova", remark: "摩尔多瓦" },
  { code: "ME", en: "Montenegro", name: "iot_plat_montenegro", remark: "黑山" },
  { code: "MF", en: "Saint Martin (France)", name: "iot_plat_french_saint_martin", remark: "法属圣马丁" },
  { code: "MG", en: "Madagascar", name: "iot_plat_madagascar", remark: "马达加斯加" },
  { code: "MH", en: "Marshall islands", name: "iot_plat_marshall_islands", remark: "马绍尔群岛" },
  { code: "MK", en: "Republic of Macedonia (FYROM)", name: "iot_plat_macedonia", remark: "马其顿" },
  { code: "ML", en: "Mali", name: "iot_plat_mali", remark: "马里" },
  { code: "MM", en: "Myanmar (Burma)", name: "iot_plat_myanmar", remark: "缅甸" },
  { code: "MN", en: "Mongolia", name: "iot_plat_mongolia", remark: "蒙古国" },
  { code: "MP", en: "Northern Mariana Islands", name: "iot_plat_northern_mariana_islands", remark: "北马里亚纳群岛" },
  { code: "MQ", en: "Martinique", name: "iot_plat_martinique", remark: "马提尼克" },
  { code: "MR", en: "Mauritania", name: "iot_plat_mauritania", remark: "毛里塔尼亚" },
  { code: "MS", en: "Montserrat", name: "iot_plat_monserrate", remark: "蒙塞拉特岛" },
  { code: "MT", en: "Malta", name: "iot_plat_malta", remark: "马耳他" },
  { code: "MU", en: "Mauritius", name: "iot_plat_mauritius", remark: "毛里求斯" },
  { code: "MV", en: "Maldives", name: "iot_plat_maldives", remark: "马尔代夫" },
  { code: "MW", en: "Malawi", name: "iot_plat_malawi", remark: "马拉维" },
  { code: "MX", en: "Mexico", name: "iot_plat_mexico", remark: "墨西哥" },
  { code: "MZ", en: "Mozambique", name: "iot_plat_mozambique", remark: "莫桑比克" },
  { code: "NA", en: "Namibia", name: "iot_plat_namibia", remark: "纳米比亚" },
  { code: "NC", en: "New Caledonia", name: "iot_plat_new_caledonia", remark: "新喀里多尼亚" },
  { code: "NE", en: "Niger", name: "iot_plat_niger", remark: "尼日尔" },
  { code: "NF", en: "Norfolk Island", name: "iot_plat_norfolk_island", remark: "诺福克岛" },
  { code: "NG", en: "Nigeria", name: "iot_plat_nigeria", remark: "尼日利亚" },
  { code: "NI", en: "Nicaragua", name: "iot_plat_nicaragua", remark: "尼加拉瓜" },
  { code: "NL", en: "Netherlands", name: "iot_plat_netherlands", remark: "荷兰" },
  { code: "NO", en: "Norway", name: "iot_plat_norway", remark: "挪威" },
  { code: "NP", en: "Nepal", name: "iot_plat_nepal", remark: "尼泊尔" },
  { code: "NR", en: "Nauru", name: "iot_plat_nauru", remark: "瑙鲁" },
  { code: "NU", en: "Niue", name: "iot_plat_niue", remark: "纽埃" },
  { code: "NZ", en: "New Zealand", name: "iot_plat_new_zealand", remark: "新西兰" },
  { code: "OM", en: "Oman", name: "iot_plat_oman", remark: "阿曼" },
  { code: "PA", en: "Panama", name: "iot_plat_panama", remark: "巴拿马" },
  { code: "PE", en: "Peru", name: "iot_plat_peru", remark: "秘鲁" },
  { code: "PF", en: "French polynesia", name: "iot_plat_french_polynesia", remark: "法属波利尼西亚" },
  { code: "PG", en: "Papua New Guinea", name: "iot_plat_papua_new_guinea", remark: "巴布亚新几内亚" },
  { code: "PH", en: "The Philippines", name: "iot_plat_philippines", remark: "菲律宾" },
  { code: "PK", en: "Pakistan", name: "iot_plat_pakistan", remark: "巴基斯坦" },
  { code: "PL", en: "Poland", name: "iot_plat_poland", remark: "波兰" },
  { code: "PM", en: "Saint-Pierre and Miquelon", name: "iot_plat_saint_pierre_and_miquelon", remark: "圣皮埃尔和密克隆" },
  { code: "PN", en: "Pitcairn Islands", name: "iot_plat_pitcairn_islands", remark: "皮特凯恩群岛" },
  { code: "PR", en: "Puerto Rico", name: "iot_plat_puerto_rico", remark: "波多黎各" },
  { code: "PS", en: "Palestinian territories", name: "iot_plat_palestine", remark: "巴勒斯坦" },
  { code: "PT", en: "Portugal", name: "iot_plat_portugal", remark: "葡萄牙" },
  { code: "PW", en: "Palau", name: "iot_plat_palau", remark: "帕劳" },
  { code: "PY", en: "Paraguay", name: "iot_plat_paraguay", remark: "巴拉圭" },
  { code: "QA", en: "Qatar", name: "iot_plat_qatar", remark: "卡塔尔" },
  { code: "RE", en: "Réunion", name: "iot_plat_reunion", remark: "留尼汪" },
  { code: "RO", en: "Romania", name: "iot_plat_romania", remark: "罗马尼亚" },
  { code: "RS", en: "Serbia", name: "iot_plat_serbia", remark: "塞尔维亚" },
  { code: "RU", en: "Russian Federation", name: "iot_plat_russia", remark: "俄罗斯" },
  { code: "RW", en: "Rwanda", name: "iot_plat_rwanda", remark: "卢旺达" },
  { code: "SA", en: "Saudi Arabia", name: "iot_plat_saudi_arabia", remark: "沙特阿拉伯" },
  { code: "SB", en: "Solomon Islands", name: "iot_plat_solomon_islands", remark: "所罗门群岛" },
  { code: "SC", en: "Seychelles", name: "iot_plat_seychelles", remark: "塞舌尔" },
  { code: "SD", en: "Sudan", name: "iot_plat_sudan", remark: "苏丹" },
  { code: "SE", en: "Sweden", name: "iot_plat_sweden", remark: "瑞典" },
  { code: "SG", en: "Singapore", name: "iot_plat_singapore", remark: "新加坡" },
  { code: "SH", en: "St. Helena & Dependencies", name: "iot_plat_st_helena", remark: "圣赫勒拿" },
  { code: "SI", en: "Slovenia", name: "iot_plat_slovenia", remark: "斯洛文尼亚" },
  { code: "SJ", en: "Svalbard and Jan Mayen", name: "iot_plat_svalbard_and_jan_mayen", remark: "斯瓦尔巴群岛和扬马延岛" },
  { code: "SK", en: "Slovakia", name: "iot_plat_slovakia", remark: "斯洛伐克" },
  { code: "SL", en: "Sierra Leone", name: "iot_plat_sierra_leone", remark: "塞拉利昂" },
  { code: "SM", en: "San Marino", name: "iot_plat_san_marino", remark: "圣马力诺" },
  { code: "SN", en: "Senegal", name: "iot_plat_senegal", remark: "塞内加尔" },
  { code: "SO", en: "Somalia", name: "iot_plat_somalia", remark: "索马里" },
  { code: "SR", en: "Suriname", name: "iot_plat_suriname", remark: "苏里南" },
  { code: "SS", en: "South Sudan", name: "iot_plat_south_sudan", remark: "南苏丹" },
  { code: "ST", en: "Sao Tome & Principe", name: "iot_plat_sao_tome_and_principe", remark: "圣多美和普林西比" },
  { code: "SV", en: "El Salvador", name: "iot_plat_salvador", remark: "萨尔瓦多" },
  { code: "SX", en: "Sint Maarten", name: "iot_plat_sint_maarten", remark: "荷属圣马丁" },
  { code: "SY", en: "Syria", name: "iot_plat_syria", remark: "叙利亚" },
  { code: "SZ", en: "Swaziland", name: "iot_plat_swaziland", remark: "斯威士兰" },
  { code: "TC", en: "Turks & Caicos Islands", name: "iot_plat_turks_and_caicos_islands", remark: "特克斯和凯科斯群岛" },
  { code: "TD", en: "Chad", name: "iot_plat_chad", remark: "乍得" },
  { code: "TF", en: "French Southern Territories", name: "iot_plat_french_southern_territories", remark: "法属南部领地" },
  { code: "TG", en: "Togo", name: "iot_plat_togo", remark: "多哥" },
  { code: "TH", en: "Thailand", name: "iot_plat_thailand", remark: "泰国" },
  { code: "TJ", en: "Tajikistan", name: "iot_plat_tajikistan", remark: "塔吉克斯坦" },
  { code: "TK", en: "Tokelau", name: "iot_plat_tokelau", remark: "托克劳" },
  { code: "TL", en: "Timor-Leste (East Timor)", name: "iot_plat_east_timor", remark: "东帝汶" },
  { code: "TM", en: "Turkmenistan", name: "iot_plat_turkmenistan", remark: "土库曼斯坦" },
  { code: "TN", en: "Tunisia", name: "iot_plat_tunisia", remark: "突尼斯" },
  { code: "TO", en: "Tonga", name: "iot_plat_tonga", remark: "汤加" },
  { code: "TR", en: "Turkey", name: "iot_plat_turkey", remark: "土耳其" },
  { code: "TT", en: "Trinidad & Tobago", name: "iot_plat_trinidad_and_tobago", remark: "特立尼达和多巴哥" },
  { code: "TV", en: "Tuvalu", name: "iot_plat_tuvalu", remark: "图瓦卢" },
  { code: "TZ", en: "Tanzania", name: "iot_plat_tanzania", remark: "坦桑尼亚" },
  { code: "UA", en: "Ukraine", name: "iot_plat_ukraine", remark: "乌克兰" },
  { code: "UG", en: "Uganda", name: "iot_plat_uganda", remark: "乌干达" },
  { code: "UM", en: "United States Minor Outlying Islands", name: "iot_plat_small_island_outside_the_united_states", remark: "美国本土外小岛屿" },
  { code: "UY", en: "Uruguay", name: "iot_plat_uruguay", remark: "乌拉圭" },
  { code: "UZ", en: "Uzbekistan", name: "iot_plat_uzbekistan", remark: "乌兹别克斯坦" },
  { code: "VA", en: "Vatican City (The Holy See)", name: "iot_plat_vatican", remark: "梵蒂冈" },
  { code: "VC", en: "St. Vincent & the Grenadines", name: "iot_plat_saint_vincent_and_the_grenadines", remark: "圣文森特和格林纳丁斯" },
  { code: "VE", en: "Venezuela", name: "iot_plat_venezuela", remark: "委内瑞拉" },
  { code: "VG", en: "British Virgin Islands", name: "iot_plat_the_british_virgin_islands", remark: "英属维尔京群岛" },
  { code: "VI", en: "United States Virgin Islands", name: "iot_plat_united_states_virgin_islands", remark: "美属维尔京群岛" },
  { code: "VN", en: "Vietnam", name: "iot_plat_vietnam", remark: "越南" },
  { code: "VU", en: "Vanuatu", name: "iot_plat_vanuatu", remark: "瓦努阿图" },
  { code: "WF", en: "Wallis and Futuna", name: "iot_plat_wallis_and_futuna", remark: "瓦利斯和富图纳" },
  { code: "WS", en: "Samoa", name: "iot_plat_samoa", remark: "萨摩亚" },
  { code: "YE", en: "Yemen", name: "iot_plat_yemen", remark: "也门" },
  { code: "YT", en: "Mayotte", name: "iot_plat_mayotte", remark: "马约特" },
  { code: "ZA", en: "South Africa", name: "iot_plat_south_africa", remark: "南非" },
  { code: "ZM", en: "Zambia", name: "iot_plat_zambia", remark: "赞比亚" },
  { code: "ZW", en: "Zimbabwe", name: "iot_plat_zimbabwe", remark: "津巴布韦" }
]

/** 
 * 国家货币名称与代码
 * currency 为多语言变量标识
 * remark 方便查询而已
 */
export const currencyCode = [
  {
    remark  : "人民币",
    currency: "iot_plat_renminbi",
    code    : "CNY"
  },
  {
    remark  : "美元",
    currency: "iot_plat_dollar",
    code    : "USD"
  },
  {
    remark  : "港币",
    currency: "iot_plat_hong_kong_dollar",
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
    id    : 0,
    remark: "安卓通用（国内）",
    name  : "iot_plat_android_universal_domestic",
    url   : ""
  },
  {
    id    : 1,
    remark: "安卓通用（国外）",
    name  : "iot_plat_android_universal_foreign",
    url   : ""
  },
  {
    id    : 2,
    remark: "Google Play",
    name  : "iot_plat_google_play",
    url   : ""
  },
  /*
   * {
   * id    : 2,
   * remark: "豌豆荚",
   * name  : "iot_plat_pea_pod",
   * url   : ""
   * },
   * {
   * id    : 3,
   * remark: "应用宝",
   * name  : "iot_plat_app_treasure",
   * url   : ""
   *}, 
   */
  {
    id    : 4,
    remark: "iPhone App Store",
    name  : "iot_plat_iphone_app_store",
    url   : ""
  }
  /*
   * {
   * id    : 5,
   * remark: "华为",
   * name  : "iot_plat_huawei",
   * url   : ""
   * },
   * {
   * id    : 6,
   * remark: "小米",
   * name  : "iot_plat_xiaomi",
   * url   : ""
   * },
   * {
   * id    : 7,
   * remark: "vivo",
   * name  : "iot_plat_vivo",
   * url   : ""
   * },
   * {
   * id    : 8,
   * remark: "OPPO",
   * name  : "iot_plat_oppo",
   * url   : ""
   * },
   * {
   * id    : 9,
   * remark: "三星",
   * name  : "iot_plat_samsung",
   * url   : ""
   * },
   * {
   * id    : 10,
   * remark: "百度",
   * name  : "iot_plat_baidu",
   * url   : ""
   * },
   * {
   * id    : 11,
   * remark: "魅族",
   * name  : "iot_plat_meizu",
   * url   : ""
   * },
   * {
   * id    : 12,
   * remark: "360",
   * name  : "iot_plat_360",
   * url   : ""
   * },
   * {
   * id    : 13,
   * remark: "锤子",
   * name  : "iot_plat_hammer",
   * url   : ""
   *} 
   */
]

/**
 * app管理语言
 *
 */
/*
 * export const appManageLanguage = [
 * {
 * id  : 0,
 * name: "中文",
 * lang: "zh",
 * desc: ""
 * },
 * {
 * id  : 1,
 * name: "英文",
 * lang: "en",
 * desc: ""
 * },
 * {
 * id  : 2,
 * name: "意大利语",
 * lang: "it",
 * desc: ""
 * },
 * {
 * id  : 3,
 * name: "葡萄牙语",
 * lang: "pt",
 * desc: ""
 * }
 *] 
 */

/** 短信设置模板语言 */
/*
 * export const langTemplate = [
 * {
 * id    : "CN",
 * name  : "iot_plat_chinese",
 * remark: "中文"
 * },
 * {
 * id    : "EN",
 * name  : "iot_plat_english",
 * remark: "英文"
 * },
 * {
 * id    : "IT",
 * name  : "iot_plat_italian",
 * remark: "意大利"
 * },
 * {
 * id    : "PT",
 * name  : "iot_plat_portuguese",
 * remark: "葡萄牙"
 * },
 * {
 * id    : "RU",
 * name  : "iot_plat_russian_language",
 * remark: "俄罗斯"
 * }
 *] 
 */

/** 短信设置模板类型 */
export const typeTemplate = [
  {
    id    : 1,
    name  : "iot_plat_registered",
    remark: "注册"
  },
  {
    id    : 2,
    name  : "iot_plat_retrieve_pwd",
    remark: "找回密码"
  },
  {
    id    : 3,
    name  : "iot_plat_change_account",
    remark: "更换账号"
  }
]

/** 协议设置语言 */
/*
 * export const protocolLangTemplate = [
 * {
 * id    : "zh",
 * name  : "iot_plat_chinese",
 * remark: "中文"
 * },
 * {
 * id    : "en",
 * name  : "iot_plat_english",
 * remark: "英语"
 * },
 * {
 * id    : "pt",
 * name  : "iot_plat_portuguese",
 * remark: "葡萄牙语"
 * },
 * {
 * id    : "it",
 * name  : "iot_plat_italian",
 * remark: "意大利语"
 * },
 * {
 * id    : "ru",
 * name  : "iot_plat_russian_language",
 * remark: "俄罗斯语"
 * }
 *] 
 */

/** 多语言 */
/*
 * export const multiLanguage = [
 * {
 * id    : "CN",
 * name  : "iot_plat_chinese",
 * remark: "中文"
 * },
 * {
 * id    : "EN",
 * name  : "iot_plat_english",
 * remark: "英语"
 * },
 * {
 * id    : "PT",
 * name  : "iot_plat_portuguese",
 * remark: "葡萄牙语"
 * },
 * {
 * id    : "IT",
 * name  : "iot_plat_italian",
 * remark: "意大利语"
 * },
 * {
 * id    : "RU",
 * name  : "iot_plat_russian_language",
 * remark: "俄罗斯语"
 * }
 *] 
 */

/** 协议设置类型 */
export const protocolTemplate = [
  {
    id    : 1,
    name  : "iot_plat_user_agreement",
    remark: "用户协议"
  },
  {
    id    : 2,
    name  : "iot_plat_privacy_agreement",
    remark: "隐私协议"
  },
  {
    id    : 3,
    name  : "iot_plat_lloud_storage_protocol",
    remark: "云存储协议"
  },
  {
    id    : 4,
    name  : "iot_plat_instruction_use",
    remark: "使用说明"
  }
]

/** APP类型 */
export const appType = [
  {
    id    : 1,
    name  : "iot_plat_mobile_phone_app",
    remark: "手机APP"
  },
  {
    id    : 2,
    name  : "iot_plat_paltform_app",
    remark: "平台应用"
  },
  {
    id    : 3,
    name  : "iot_plat_desktop_app",
    remark: "桌面应用"
  }
]

