// 且不为空, 不为空很重要,
function isStr(str) {
  return typeof str === 'string'
}
function isTrueStr(str) {
  return isTrue(str) && isStr(str)
}
function isFunc(func) {
  return typeof func === 'function'
}
function isNum(num) {
  return typeof num === 'number'
}
function isTrueNum(num) {
  return isTrue(num) && isNum(num)
}

function isBool(bool) {
  return typeof bool === 'boolean'
}

function isObj(obj) {
  return getClassName(obj) === 'Object'
}

function isArr(arr) {
  return Array.isArray(arr)
}
function isTrueArr(arr) {
  return arr.length && isArr(arr)
}
//  排除 false、null、0、”“、undefined  NaN
function isTrue(sth) {
  if (sth) return true
}
// 获取他的 类名 /
function getClassName(v) {
  return Object.prototype.toString.call(v).slice(8, -1)
}
// 这个说明是子类, 但不一定是第一子类
// 只要在继承链上就行
function isInstance(ins, Class) {
  return ins instanceof Class
}
// new 出来的才是 , 也就是第一个 constructor
function isTrueInstance(ins, Class) {
  return getClassName(ins) === Class.name
}

function isElement(el) {
  return el instanceof Element
}
