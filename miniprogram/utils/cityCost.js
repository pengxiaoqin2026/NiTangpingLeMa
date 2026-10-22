/**
 * 城市月生活费本地估算（纯本地算法，不依赖大模型与网络）
 *
 * 数据来源与口径说明：
 * - 以北京单人月生活费（含房租、合租水平）约 7000 元为锚点；
 * - 主要城市参考 Numbeo 生活成本指数（北京=100）与美世城市生活成本排名折算；
 * - 其余城市按「省份经济水平系数 + 城市名稳定波动」估算；
 * - 所有数值均为估算参考，页面支持手动微调，不构成权威统计。
 */

const CITY_COST = {
  // 一线
  '北京': 7000,
  '上海': 7360,
  '深圳': 6530,
  '广州': 5730,
  // 新一线 / 强二线
  '杭州': 5700,
  '苏州': 5460,
  '南京': 4990,
  '天津': 4900,
  '厦门': 4900,
  '宁波': 4760,
  '珠海': 4760,
  '武汉': 4680,
  '泉州': 4620,
  '长沙': 4570,
  '无锡': 4550,
  '成都': 4480,
  '重庆': 4340,
  '东莞': 4340,
  '福州': 4340,
  '温州': 4340,
  '西安': 4200,
  '佛山': 4200,
  '济南': 4200,
  '郑州': 4060,
  '大连': 4060,
  '中山': 4060,
  '昆明': 3920,
  '徐州': 3920,
  '常州': 3920,
  '嘉兴': 3920,
  '绍兴': 3920,
  '海口': 3920,
  '沈阳': 3850,
  '合肥': 3850,
  '惠州': 3850,
  '南通': 3780,
  '台州': 3780,
  '金华': 3780,
  '烟台': 3780,
  '扬州': 3780,
  '镇江': 3780,
  '廊坊': 3780,
  // 其他省会 / 主要地级市
  '拉萨': 4000,
  '石家庄': 3640,
  '南昌': 3640,
  '唐山': 3640,
  '潍坊': 3640,
  '哈尔滨': 3500,
  '长春': 3500,
  '太原': 3500,
  '南宁': 3500,
  '洛阳': 3500,
  '保定': 3500,
  '盐城': 3500,
  '泰州': 3500,
  '淄博': 3500,
  '芜湖': 3500,
  '贵阳': 3360,
  '乌鲁木齐': 3360,
  '临沂': 3360,
  '株洲': 3360,
  '岳阳': 3360,
  '宜昌': 3360,
  '襄阳': 3360,
  '柳州': 3360,
  '桂林': 3360,
  '兰州': 3220,
  '呼和浩特': 3220,
  '赣州': 3220,
  '绵阳': 3220,
  '银川': 3080,
  '西宁': 3080
}

const PROVINCE_RATIO = {
  '广东': 0.55,
  '江苏': 0.55,
  '浙江': 0.55,
  '福建': 0.52,
  '山东': 0.5,
  '海南': 0.48,
  '安徽': 0.46,
  '湖北': 0.46,
  '湖南': 0.46,
  '西藏': 0.46,
  '辽宁': 0.45,
  '河北': 0.44,
  '吉林': 0.44,
  '江西': 0.44,
  '河南': 0.44,
  '陕西': 0.44,
  '四川': 0.44,
  '山西': 0.42,
  '内蒙古': 0.42,
  '黑龙江': 0.42,
  '广西': 0.42,
  '云南': 0.42,
  '新疆': 0.42,
  '贵州': 0.4,
  '甘肃': 0.4,
  '青海': 0.4,
  '宁夏': 0.4
}

const RATIO = [
  ['房租', 0.35],
  ['餐饮', 0.28],
  ['交通', 0.08],
  ['水电通讯', 0.08],
  ['日用品', 0.07],
  ['娱乐社交', 0.08],
  ['医疗应急', 0.06]
]

function normalize(name) {
  return String(name || '').replace(/[市省]$/, '')
}

function jitter(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return ((h % 81) - 40) / 1000
}

function fallback(name, province) {
  const p = normalize(province)
  const ratio = PROVINCE_RATIO[p] || 0.46
  const base = 7000 * ratio
  return Math.round((base * (1 + jitter(name))) / 10) * 10
}

function buildItems(total) {
  const items = RATIO.map(function (part) {
    return { name: part[0], amount: Math.round(total * part[1]) }
  })
  const sum = items.reduce(function (s, it) { return s + it.amount }, 0)
  items[0].amount += total - sum
  return items
}

function estimateCost(city, province) {
  const name = normalize(city)
  let total
  if (Object.prototype.hasOwnProperty.call(CITY_COST, name)) {
    total = CITY_COST[name]
  } else {
    total = fallback(name, province)
  }
  return {
    city: name,
    items: buildItems(total),
    total,
    source: 'local'
  }
}

module.exports = { estimateCost }
