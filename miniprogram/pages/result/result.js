Page({
  data: {
    asset: 0,
    deposit: 0,
    duration: '',
    progress: 0,
    canRetire: false,
    infeasible: false,
    age: 0,
    retireAge: 0,
    capped: false,
    showAge: false,
    praise: ''
  },

  onLoad() {
    const app = getApp()
    const asset = app.globalData.targetAsset || 0
    const deposit = app.globalData.deposit || 0
    const age = app.globalData.age || 0
    const retireAge = app.globalData.retireAge || 0
    const capped = !!app.globalData.capped
    const showAge = age > 0 && age < 30
    const canRetire = !!app.globalData.canRetire
    const infeasible = !!app.globalData.infeasible
    const years = app.globalData.years || 0
    const months = app.globalData.months || 0
    let duration = ''
    if (years > 0 && months > 0) {
      duration = years + ' 年 ' + months + ' 个月'
    } else if (years > 0) {
      duration = years + ' 年'
    } else {
      duration = months + ' 个月'
    }
    let progress = 0
    if (asset > 0) {
      progress = Math.min(100, Math.round((deposit / asset) * 100))
    }
    let praise = ''
    if (canRetire) {
      praise = '恭喜！你太棒了！'
    } else if (infeasible) {
      praise = '没关系，你已经很努力了。'
    } else if (capped) {
      praise = '能走到这一步，你已经很优秀了！'
    } else if (retireAge > 0 && retireAge <= 45) {
      praise = '你太棒了！你已经超过大部分同龄人了！'
    } else {
      praise = '你很优秀！你已经在路上了！'
    }
    this.setData({
      asset,
      deposit,
      duration,
      progress,
      canRetire,
      infeasible,
      age,
      retireAge,
      capped,
      showAge,
      praise
    })
  },

  onReport() {
    wx.navigateTo({ url: '/pages/report/report' })
  },

  onRestart() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
