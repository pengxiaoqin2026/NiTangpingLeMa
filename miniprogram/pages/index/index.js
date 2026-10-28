Page({
  data: {
    region: [],
    cityText: ''
  },

  onRegionChange(e) {
    const region = e.detail.value || []
    if (region.length < 2) return

    const app = getApp()
    app.globalData.province = region[0]
    app.globalData.city = region[1]

    this.setData({
      region,
      cityText: region[0] + ' · ' + region[1]
    })
  },

  onStart() {
    if (!this.data.cityText) {
      wx.showToast({ title: '请先选择城市', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/cost/cost' })
  }
})
