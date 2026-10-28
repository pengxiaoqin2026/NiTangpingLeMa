/**
 * 核心计算纯函数
 * calcFIRE({ M, r, D, W })
 *  M: 月生活费（元）
 *  r: 年化收益率（默认 0.04）
 *  D: 当前存款（元）
 *  W: 税后月工资（元）
 */

function round2(n) {
  return Math.round(n * 100) / 100
}

function calcFIRE(_ref) {
  const M = Number(_ref.M) || 0
  const r = Number(_ref.r) || 0.04
  const D = Number(_ref.D) || 0
  const W = Number(_ref.W) || 0

  // 躺平本金 = 月生活费 * 12 / 年化收益率
  const asset = round2((M * 12) / r)

  // 已可躺平
  if (D >= asset) {
    return { asset, canRetire: true, infeasible: false, years: 0, months: 0, monthsTotal: 0 }
  }

  // 月可储蓄
  const S = Math.max(0, W - M)

  // 入不敷出，无法通过当前收入攒够
  if (S <= 0) {
    return { asset, canRetire: false, infeasible: true, years: 0, months: 0, monthsTotal: 0 }
  }

  // 二分求解：D*(1+i)^T + S*((1+i)^T - 1)/i = asset
  const i = r / 12
  let lo = 0
  let hi = 1200
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2
    const fv = D * Math.pow(1 + i, mid) + (S * (Math.pow(1 + i, mid) - 1)) / i
    if (fv < asset) {
      lo = mid
    } else {
      hi = mid
    }
  }

  // 向上取整：未满一个月不算攒够
  const monthsTotal = Math.ceil(lo)
  const years = Math.floor(monthsTotal / 12)
  const months = monthsTotal % 12

  return { asset, canRetire: false, infeasible: false, years, months, monthsTotal }
}

module.exports = { calcFIRE }
