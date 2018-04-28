var Mock = require('mockjs')

// 可选 需要用到时再引入，还有其他功能函数参见官方文档
var Random = Mock.Random

// 模板的具体语法参见官方文档 https://github.com/nuysoft/Mock/wiki/Syntax-Specification
var template = {
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'id|+1': 1
  }],
  'email': Random.email()
}

// 使用mock函数拦截url请求并返回模板格式数据
Mock.mock(`/aaa/getdevice`, template)
