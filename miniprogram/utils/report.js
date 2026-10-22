/**
 * 本地报告文案生成（纯本地，不依赖大模型）
 * 设计取向：给数字，也给希望——按结果分级选择话术，避免制造焦虑。
 */

const FOOTER = '娱乐测算 · 仅供参考，不构成投资理财建议'

const QUOTES = [
  '你已经在路上了，每一步都算数。',
  '攒钱的意义，是给未来的自己一个说「不」的底气。',
  '真正的躺平不是不努力，而是努力到有一天可以不再努力。',
  '生活的方向盘，其实一直握在你自己手里。',
  '慢一点没关系，别停下就好。',
  '先攒够底气，再去谈诗和远方。'
]

function approximateDuration(years, months) {
  const total = years * 12 + months
  if (total < 12) return '不到一年'
  if (total < 24) return '一年左右'
  if (total < 36) return '两三年'
  if (total < 60) return '三五年'
  if (total < 120) return '不到十年'
  if (total < 180) return '十来年'
  if (total < 240) return '十五年往上'
  if (total < 360) return '二三十年'
  return '几十年'
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildReport(_ref) {
  const city = _ref.city || '这座城市'
  const cost = _ref.cost || 0
  const asset = _ref.asset || 0
  const years = _ref.years || 0
  const months = _ref.months || 0
  const age = _ref.age || 0
  const retireAge = _ref.retireAge || 0
  const capped = _ref.capped
  const canRetire = _ref.canRetire
  const infeasible = _ref.infeasible
  const quote = pick(QUOTES)

  if (canRetire) {
    const prefix = age > 0 ? age + ' 岁的你，' : ''
    return {
      title: '恭喜，你已经是自由人了',
      body: '你太棒了！' + prefix + '躺平本金大约需要 ' + asset + ' 元，而你的家底已经够覆盖生活开支。接下来请认真生活，把时间还给自己。',
      quote,
      footer: FOOTER
    }
  }

  if (infeasible) {
    return {
      title: '先稳住，再谈躺平',
      body: '没关系，你已经很努力了。在' + city + '，月生活费约 ' + cost + ' 元，你的收入暂时盖不住它。这不全是你的问题，更多是城市和生活成本不太匹配。可以先考虑换个节奏慢一点的城市，或给自己争取一次加薪的机会。',
      quote,
      footer: FOOTER
    }
  }

  const approx = approximateDuration(years, months)
  const showAge = age > 0 && age < 30

  if (capped) {
    return {
      title: '按 55 岁退休封顶',
      body: '能走到这一步，你已经很优秀了。在' + city + '，躺平门槛约 ' + asset + ' 元。照目前进度，真实需要的年头其实更长，但按 55 岁退休封顶来算，大约还要 ' + approx + '。这个数字只是参考——躺平有很多种活法，别用一个年龄定义自己。',
      quote,
      footer: FOOTER
    }
  }

  if (showAge) {
    return {
      title: retireAge + ' 岁左右，可以躺平',
      body: '你太棒了！在' + city + '，躺平门槛约 ' + asset + ' 元。从 ' + age + ' 岁出发，按现在的速度，大约 ' + retireAge + ' 岁就能按下暂停键，你已经超过大部分同龄人了。',
      quote,
      footer: FOOTER
    }
  }

  return {
    title: '再当 ' + approx + ' 牛马',
    body: '你很优秀！在' + city + '，躺平门槛约 ' + asset + ' 元，照目前进度大约还要 ' + approx + '。你已经在路上了，坚持住。',
    quote,
    footer: FOOTER
  }
}

module.exports = { buildReport }
