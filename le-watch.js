function leWatch() {
  // 监视属性的变化 , allofthem
  // 储存 old 值, 对比 new 值
  // 代表 observe 和 proxy ,兼容性 max
  // 这里需要一个注册表
  // 那也不太现实呀.. 一直查询吗...
}

function leWatchData(data, method, p = '') {
  let stop = true
  if (isObj(data) || isArr(data)) {
    let _data = new Proxy(data, {
      get(target, prop) {
        return prop in target ? target[prop] : 'error'
      },
      set(target, prop, val) {
        target[prop] = val //可根据实际需要修改条件
        // 为每个属性都配置一个更新函数
        if (isArr(target) && prop === 'length') {
          return true
        } else if (isArr(target[prop] || isObj(target[prop])) && stop) {
          return true
        } else if (typeof method === 'function') {
          method(target, prop, val, p)
        }
        return true
      },
    })
    for (let prop in data) {
      let v = data[prop]
      if (isObj(v) || isArr(v)) {
        if (typeof method === 'function') {
          _data[prop] = leWatchData(v, method, p + '.' + prop)
        }
      }
    }
    stop = false
    return _data
  }
}

function leWatchData_(data, method) {
  if (isObj(data) || isArr(data)) {
    let _data = new Proxy(data, {
      get(target, prop) {
        return prop in target ? target[prop] : 'error'
      },
      set(target, prop, val) {
        target[prop] = val //可根据实际需要修改条件
        // 为每个属性都配置一个更新函数
        if (typeof target[prop + '_f'] === 'function') {
          target[prop + '_f'](target, prop, val)
        } else if (typeof method === 'function') {
          method(target, prop, val)
        }
        return true
      },
    })
    for (let prop in data) {
      let v = data[prop]
      if (isObj(v) || isArr(v)) {
        if (typeof data[prop + '_f'] === 'function') {
          _data[prop] = leWatchData(v, data[prop + '_f'])
        } else if (typeof method === 'function') {
          _data[prop] = leWatchData(v, method)
        }
      }
    }

    return _data
  }
}

// 数据驱动,适用范围有限呀, 虽然挺爽
// 比如数据共同更新的时候, 就会出现一点小问题
// 多重计算// 挺不爽的

// 但是如果每个数据都单独写更新, 也挺不爽对吧!!!
// 难受住

// 直接代理 this
function dataCenter(obj, props) {}
