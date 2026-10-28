const { estimateCost } = require('../../utils/cityCost')

Page({
  data: {
    city: '',
    items: [],
    total: 0
  },

  onLoad() {
    const app = getApp()
    const city = app.globalData.city || ''
    const res = estimateCost(city, app.globalData.province)
    this.setData({
      city: (app.globalData.province || '') + ' · ' + city,
      items: res.items,
      total: res.total
    })
  },

  onAmountChange(e) {
    const index = Number(e.currentTarget.dataset.index)
    const value = parseFloat(e.detail.value) || 0
    const items = this.data.items.slice()
    items[index].amount = value
    const total = items.reduce(function (s, it) { return s + it.amount }, 0)
    this.setData({ items, total })
  },

  onNext() {
    const app = getApp()
    app.globalData.costItems = this.data.items
    app.globalData.costTotal = this.data.total
    wx.navigateTo({ url: '/pages/input/input' })
  }
})
