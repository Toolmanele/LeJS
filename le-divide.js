// 平分的问题,
// 不就是一个 除 吗, 仔细想想还真没那么的简单

// 由于计算机的渲染特性,
// 我们不能产生小数, 如果是小数
// 浏览器之前的算法不太一样
// 这还不够, 还有可能产生模糊

// 这自然是不被接受的

var leDivide = {
  // 对于一个线段进行平分
  range: function (range, n) {
    let unit = (range[1] - range[0]) / n
    let poss = [range[0]]
    let index = 0
    let curPos = range[0]
    if (unit % 1) {
      // 非整数
      // 如果这个 unit 是小数, 那就有问题了

      // 寻找这个 unit 最近的值
      let fixUnit = Math.round(unit)

      // 以后的每一次计算, 我们都要求得和理论结果最近的整数值

      let _curPos = range[0]
      while (index < n) {
        curPos += fixUnit
        _curPos += unit
        if (index != n - 1) {
          while (Math.abs(curPos - _curPos) >= 1) {
            if (curPos > _curPos) {
              curPos--
            } else {
              curPos++
            }
          }
          poss.push(curPos)
        } else {
          poss.push(range[1])
        }

        index++
      }
    } else {
      while (index < n) {
        curPos += unit
        poss.push(curPos)
        index++
      }
    }
    return poss
  },

  // 平分range,但是多一点的是 gap
  // 我们要求这个 gap 是整数
  // 如果是 百分比,分数,或者是 小数,则进行转化
  rangeGap: function (range, gap, n) {
    let unit = (range[1] - range[0] - (n - 1) * gap) / n

    let poss = [{ pos: range[0] }]
    let index = 0
    let curPos = range[0]

    if (unit % 1) {
      let _curPos = range[0]
      let fUnit = Math.floor(unit)

      while (index < n) {
        if (index != n - 1) {
          curPos += fUnit + gap
          _curPos += unit + gap
          let _f = fUnit
          while (Math.abs(curPos - _curPos) >= 1) {
            if (curPos > _curPos) {
              curPos--
              _f--
            } else {
              curPos++
              _f++
            }
          }
          poss[poss.length - 1].width = _f
          poss.push({ pos: curPos })
        } else {
          poss[poss.length - 1].width = range[1] - curPos
        }
        index++
      }
    } else {
      while (index < n) {
        curPos += unit + gap
        poss[poss.length - 1].width = unit
        if (index != n - 1) {
          poss.push({ pos: curPos })
        }
        index++
      }
    }
    return poss
  },

  // 上面由于要求是等分, 所以要优先保证 width 相同
  // 这里只要求了位置点, 所以要优先要求位置点
  // 要求不一样,算法不一样
  // 有时候他不是平分,而是 1/3,3/5 这些位置点

  rangePoss: function (range, poss) {
    // 由于这里是不均匀等分, 差不多就行了
    return poss
      .map((v) => v * (range[1] - range[0]) + range[0])
      .map((v) => Math.floor(v))
  },

  // 如果渲染 canvas 或者 svg 的时候
  // 比如 1px 3px 的直线,那么就会出现模糊
  // 水平或者垂直
  // 那怎么办呢 ?
  // 就把 起点 +0.5即可
  // 比如说水平线, 就把 y 值 +0.5
  // fixedOddLineWidthFloat
  _fixedOdd: function (v) {
    if (v % 1) {
      // 找到和 0.5 最近的值
      let c1 = Math.floor(v) + 0.5
      let c2 = Math.floor(v) - 0.5
      return c1 - v < v - c2 ? c1 : c2
    } else {
      return v + 0.5
    }
  },
  // 如果是整数则直接 +0.5 就行了
  // int
  fixedOdd: function (v) {
    return v + 0.5
  },
}
