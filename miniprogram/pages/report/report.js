const { buildReport } = require('../../utils/report')

Page({
  data: {
    report: null
  },

  onLoad() {
    const app = getApp()
    const report = buildReport({
      city: app.globalData.city,
      cost: app.globalData.costTotal,
      asset: app.globalData.targetAsset,
      years: app.globalData.years,
      months: app.globalData.months,
      age: app.globalData.age,
      retireAge: app.globalData.retireAge,
      capped: app.globalData.capped,
      canRetire: app.globalData.canRetire,
      infeasible: app.globalData.infeasible
    })
    app.globalData.report = report
    this.setData({ report })
  },

  onCopy() {
    const r = this.data.report
    if (!r) return
    wx.setClipboardData({
      data: r.title + '\n' + r.body + (r.quote ? '\n\n' + r.quote : '') + '\n\n' + r.footer
    })
  },

  onRestart() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
