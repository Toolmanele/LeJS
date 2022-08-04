/**
 *
 * @param {*} start 起点
 * @param {*} s  总长
 * @param {*} d  总时间
 * @param {*} animCurvefn 自定义动画曲线
 * @returns
 *
 * 案例 var myAnim = leEasing(10, 20, 10, 'cubicBeizer(13123)')
 */

function leEasing(start, s, d, animCurvefn) {
  var fn = leEasing.parseFn(animCurvefn)
  return function (t) {
    if (t > d) {
      return {
        flag: 'stop',
        value: start + s,
      }
    } else {
      return { flag: 'play', value: fn(t, start, s, d) }
    }
  }
}

leEasing.parsecb = function (cb) {
  var reg = /cubic(\s+)?-(\s+)?bezier\((.+)\)/i
  var matched = cb.match(reg)[3]
  if (matched) {
    var arr = matched
      .replace(/\s/, '')
      .split(',')
      .map(function (s) {
        return Number(s)
      })

    var pass = true
    for (var i = 0; i < arr.length; i++) {
      if (isNaN(arr[i])) {
        pass = false
      }
    }

    if (pass) {
      return arr
    }
  }
}
leEasing.toBezier = function (cb) {
  var params = leEasing.parsecb(cb)

  return [
    [0, 0],
    [params[0], params[1]],
    [params[2], params[3]],
    [1, 1],
  ]
}
// cubic-bezier(.17,.67,.83,.67)
leEasing.parseFn = function (curve) {
  // 解析动画曲线
  if (typeof curve === 'string') {
    curve = curve.toLowerCase()
    // console.log(curve)
    if (curve.indexOf('cubic') !== -1 && curve.indexOf('bezier') !== -1) {
      var params = leEasing.parsecb(curve)
      if (params) {
        var p1 = params[0]
        var p2 = params[1]
        var p3 = params[2]
        var p4 = params[3]
        return leEasing.curve.cubicBezier(p1, p2, p3, p4)
      }
    } else {
      var fn = leEasing.names[curve]
      if (fn) {
        return fn
      }
    }
  } else if (typeof curve === 'fn') {
    return curve
  }
}
leEasing.curve = {
  Linear: function (t, b, c, d) {
    return (c * t) / d + b
  },
  Quad: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t + b
    },
    easeOut: function (t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    },
  },
  Cubic: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t * t + b
    },
    easeOut: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b
      return (c / 2) * ((t -= 2) * t * t + 2) + b
    },
  },
  Quart: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t * t * t + b
    },
    easeOut: function (t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b
      return (-c / 2) * ((t -= 2) * t * t * t - 2) + b
    },
  },
  Quint: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b
    },
    easeOut: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b
      return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b
    },
  },
  Sine: {
    easeIn: function (t, b, c, d) {
      return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
    },
    easeOut: function (t, b, c, d) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b
    },
    easeInOut: function (t, b, c, d) {
      return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
    },
  },
  Expo: {
    easeIn: function (t, b, c, d) {
      return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOut: function (t, b, c, d) {
      return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if (t == 0) return b
      if (t == d) return b + c
      if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
    },
  },
  Circ: {
    easeIn: function (t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOut: function (t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
      return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
  },
  Elastic: {
    easeIn: function (t, b, c, d, a, p) {
      if (t == 0) return b
      if ((t /= d) == 1) return b + c
      if (!p) p = d * 0.3
      if (!a || a < Math.abs(c)) {
        a = c
        var s = p / 4
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
      return (
        -(
          a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p)
        ) + b
      )
    },
    easeOut: function (t, b, c, d, a, p) {
      if (t == 0) return b
      if ((t /= d) == 1) return b + c
      if (!p) p = d * 0.3
      if (!a || a < Math.abs(c)) {
        a = c
        var s = p / 4
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
        c +
        b
      )
    },
    easeInOut: function (t, b, c, d, a, p) {
      if (t == 0) return b
      if ((t /= d / 2) == 2) return b + c
      if (!p) p = d * (0.3 * 1.5)
      if (!a || a < Math.abs(c)) {
        a = c
        var s = p / 4
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
      if (t < 1)
        return (
          -0.5 *
            (a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
          b
        )
      return (
        a *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
          0.5 +
        c +
        b
      )
    },
  },
  Back: {
    easeIn: function (t, b, c, d, s) {
      if (s == undefined) s = 1.70158
      return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOut: function (t, b, c, d, s) {
      if (s == undefined) s = 1.70158
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOut: function (t, b, c, d, s) {
      if (s == undefined) s = 1.70158
      if ((t /= d / 2) < 1)
        return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
      return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    },
  },
  Bounce: {
    easeIn: function (t, b, c, d) {
      return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b
    },
    easeOut: function (t, b, c, d) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
      }
    },
    easeInOut: function (t, b, c, d) {
      if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b
      else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    },
  },
  cubicBezier: function (x1, y1, x2, y2) {
    return function (t, start, s, d) {
      return BezierEasing(x1, y1, x2, y2)(t / d) * s + start
    }
  },
}

leEasing.names = {
  linear: leEasing.curve.Linear,
  'quad-in': leEasing.curve.Quad.easeIn,
  'quad-out': leEasing.curve.Quad.easeOut,
  'quad-in-out': leEasing.curve.Quad.easeInOut,
  'cubic-in': leEasing.curve.Cubic.easeIn,
  'cubic-out': leEasing.curve.Cubic.easeOut,
  'cubic-in-out': leEasing.curve.Cubic.easeInOut,
  'quart-in': leEasing.curve.Quart.easeIn,
  'quart-out': leEasing.curve.Quart.easeOut,
  'quart-in-out': leEasing.curve.Quart.easeInOut,
  'quint-in': leEasing.curve.Quint.easeIn,
  'quint-out': leEasing.curve.Quint.easeOut,
  'quint-in-out': leEasing.curve.Quint.easeInOut,
  'sine-in': leEasing.curve.Sine.easeIn,
  'sine-out': leEasing.curve.Sine.easeOut,
  'sine-in-out': leEasing.curve.Sine.easeInOut,
  'expo-in': leEasing.curve.Expo.easeIn,
  'expo-out': leEasing.curve.Expo.easeOut,
  'expo-in-out': leEasing.curve.Expo.easeInOut,
  'circ-in': leEasing.curve.Circ.easeIn,
  'circ-out': leEasing.curve.Circ.easeOut,
  'circ-in-out': leEasing.curve.Circ.easeInOut,
  'elastic-in': leEasing.curve.Elastic.easeIn,
  'elastic-out': leEasing.curve.Elastic.easeOut,
  'elastic-in-out': leEasing.curve.Elastic.easeInOut,
  'back-in': leEasing.curve.Back.easeIn,
  'back-out': leEasing.curve.Back.easeOut,
  'back-in-out': leEasing.curve.Back.easeInOut,
  'bounce-in': leEasing.curve.Bounce.easeIn,
  'bounce-out': leEasing.curve.Bounce.easeOut,
  'bounce-in-out': leEasing.curve.Bounce.easeInOut,
}

// 动画方程 类似 tween.js
// 可视化辅助 https://cubic-bezier.com/

function BezierEasing(x1, y1, x2, y2) {
  var NEWTON_ITERATIONS = 4
  var NEWTON_MIN_SLOPE = 0.001
  var SUBDIVISION_PRECISION = 0.0000001
  var SUBDIVISION_MAX_ITERATIONS = 10

  var kSplineTableSize = 11
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0)

  var float32ArraySupported = typeof Float32Array === 'function'

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1
  }
  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1
  }
  function C(aA1) {
    return 3.0 * aA1
  }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1)
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX,
      currentT,
      i = 0
    do {
      currentT = aA + (aB - aA) / 2.0
      currentX = calcBezier(currentT, mX1, mX2) - aX
      if (currentX > 0.0) {
        aB = currentT
      } else {
        aA = currentT
      }
    } while (
      Math.abs(currentX) > SUBDIVISION_PRECISION &&
      ++i < SUBDIVISION_MAX_ITERATIONS
    )
    return currentT
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2)
      if (currentSlope === 0.0) {
        return aGuessT
      }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX
      aGuessT -= currentX / currentSlope
    }
    return aGuessT
  }

  function LinearEasing(x) {
    return x
  }

  function BezierEasing(mX1, mY1, mX2, mY2) {
    // 不应该限制 [0-1]
    // 应该限制, 这样,时间就不会回流了, 这个是一个大bug
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      console.warn('bezier x values must be in [0, 1] range')
    }

    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing
    }

    // Precompute samples table
    var sampleValues = float32ArraySupported
      ? new Float32Array(kSplineTableSize)
      : new Array(kSplineTableSize)
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2)
    }

    function getTForX(aX) {
      var intervalStart = 0.0
      var currentSample = 1
      var lastSample = kSplineTableSize - 1

      for (
        ;
        currentSample !== lastSample && sampleValues[currentSample] <= aX;
        ++currentSample
      ) {
        intervalStart += kSampleStepSize
      }
      --currentSample

      // Interpolate to provide an initial guess for t
      var dist =
        (aX - sampleValues[currentSample]) /
        (sampleValues[currentSample + 1] - sampleValues[currentSample])
      var guessForT = intervalStart + dist * kSampleStepSize

      var initialSlope = getSlope(guessForT, mX1, mX2)
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2)
      } else if (initialSlope === 0.0) {
        return guessForT
      } else {
        return binarySubdivide(
          aX,
          intervalStart,
          intervalStart + kSampleStepSize,
          mX1,
          mX2
        )
      }
    }

    return function BezierEasing(x) {
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0 || x === 1) {
        return x
      }
      return calcBezier(getTForX(x), mY1, mY2)
    }
  }

  return BezierEasing(x1, y1, x2, y2)
}
