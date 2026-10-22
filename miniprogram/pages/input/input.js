const { calcFIRE } = require('../../utils/calc')

Page({
  data: {
    age: '',
    deposit: '',
    salary: '',
    rate: 0.04
  },

  sanitizeAmount(v) {
    let s = String(v).replace(/[^\d.]/g, '')
    const i = s.indexOf('.')
    if (i !== -1) {
      s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, '')
    }
    return s
  },

  onAge(e) {
    this.setData({ age: String(e.detail.value).replace(/\D/g, '') })
  },

  onDeposit(e) {
    this.setData({ deposit: this.sanitizeAmount(e.detail.value) })
  },

  onSalary(e) {
    this.setData({ salary: this.sanitizeAmount(e.detail.value) })
  },

  onRate(e) {
    this.setData({ rate: parseFloat(e.currentTarget.dataset.r) })
  },

  onCalc() {
    const app = getApp()
    const age = parseInt(this.data.age, 10)
    if (isNaN(age) || age < 1 || age > 100) {
      wx.showToast({ title: '请填写有效年龄', icon: 'none' })
      return
    }
    const deposit = parseFloat(this.data.deposit)
    const salary = parseFloat(this.data.salary)

    if (isNaN(deposit) || isNaN(salary)) {
      wx.showToast({ title: '请填写存款和工资', icon: 'none' })
      return
    }

    const res = calcFIRE({
      M: app.globalData.costTotal,
      r: this.data.rate,
      D: deposit,
      W: salary
    })

    app.globalData.age = age
    app.globalData.deposit = deposit
    app.globalData.salary = salary
    app.globalData.targetAsset = res.asset
    app.globalData.canRetire = res.canRetire
    app.globalData.infeasible = res.infeasible

    let years = 0
    let months = 0
    let capped = false
    let retireAge = age
    if (!res.canRetire && !res.infeasible) {
      const actualYears = res.monthsTotal / 12
      const maxYears = Math.max(0, 55 - age)
      years = res.years
      months = res.months
      if (actualYears > maxYears) {
        capped = true
        years = maxYears
        months = 0
      }
      retireAge = age + years
    }

    app.globalData.years = years
    app.globalData.months = months
    app.globalData.capped = capped
    app.globalData.retireAge = retireAge

    wx.navigateTo({ url: '/pages/result/result' })
  }
})
