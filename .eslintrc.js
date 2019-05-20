// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    "eslint:recommended"
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // 强制 “for” 循环中更新子句的计数器朝着正确的方向移动
    'for-direction': 'error',
    // 强制 getter 函数中出现 return 语句
    'getter-return': 'error',
    // 禁止在循环中出现 await
    'no-await-in-loop': 'error',
    // 禁用 console
    'no-console': 'warn',
    // 禁止在正则表达式中使用控制字符
    'no-control-regex': 'off',
    // 禁用 debugger
    'no-debugger': 'warn',
    // 禁止在 任何 表达式周围出现不必要的圆括号
    'no-extra-parens': ['error', 'all'],
    // 禁止在常规字符串中出现模板字面量占位符语法
    'no-template-curly-in-string': 'error',
    // 强制使用有效的 JSDoc 注释
    // 'valid-jsdoc': 'error',
    // 强制数组方法的回调函数中有 return 语句
    // 'array-callback-return': 'error',
    // 强制类方法使用 this，如果一个类方法不使用 this，可以安全的做为静态函数出现。
    'class-methods-use-this': 'warn',
    // 限制嵌套代码的复杂度，不超过 3 层
    // 'complexity': ['error', 3],
    // 强制所有控制语句使用一致的括号风格
    'curly': 'error',
    // 要求 switch 语句中有 default 分支
    'default-case': 'warn',
    // 强制在点号之前换行
    'dot-location': ['error', 'property'],
    // 要求使用点号获取属性，对于属性为关键字可以使用方括号读取属性
    'dot-notation': ['error', { 'allowKeywords': false }],
    // 要求使用 === 和 !==，根据情况而定
    'eqeqeq': ['error', 'smart'],
    // 要求 for-in 循环中有一个 if 语句，判断属性是否为自身属性而不是原型上的属性
    // 'guard-for-in': 'error',
    // 禁用 alert、confirm 和 prompt
    'no-alert': 'warn',
    // 禁用 arguments.caller 或 arguments.callee
    'no-caller': 'error',
    // 禁止除法操作符显式的出现在正则表达式开始的位置
    // 'no-div-regex': 'error',
    // 禁止 if 语句中 return 语句之后有 else 块
    'no-else-return': 'error',
    // 禁止出现空函数
    'no-empty-function': 'error',
    // 禁用 eval()，可以间接调用
    'no-eval': ['error', { 'allowIndirect': true }],
    // 禁止扩展原生对象
    'no-extend-native': 'error',
    // 禁止不必要的函数绑定(bind)调用
    'no-extra-bind': 'error',
    // 禁止浮点小数
    'no-floating-decimal': 'error',
    // 禁止使用较短的符号实现类型转换
    'no-implicit-coercion': ['error', { 'boolean': true, 'boolean': true, 'string': true, 'allow': ['!!', '+'] }],
    // 禁止使用类似 eval() 的方法
    'no-implied-eval': 'error',
    // 禁用不必要的嵌套块
    'no-lone-blocks': 'error',
    // 禁用魔术数字，这类数字可以定义成常量再使用
    'no-magic-numbers': ['error', { "ignore": [1, 0, -1], "ignoreArrayIndexes": true, "enforceConst": true }],
    // 禁止出现多个空格
    'no-multi-spaces': ["error", { 
      exceptions: { "VariableDeclarator": true, "BinaryExpression": true, "ImportDeclaration": true, "Property": true } }
    ],
    // 禁止使用多行字符串
    'no-multi-str': 'error',
    // 禁止使用不必要的 new 以避免产生副作用
    'no-new': 'error',
    // 禁用__proto__
    'no-proto': 'error',
    // 禁止在返回语句中赋值
    'no-return-assign': 'error',
    // 禁用不必要的 return await
    'no-return-await': 'error',
    // 禁止使用 javascript: url
    'no-script-url': 'error',
    // 禁止自身比较
    'no-self-compare': 'error',
    // 不允许使用逗号操作符
    // 'no-sequences': ['error', {
    //     "no-restricted-syntax": ["error", "SequenceExpression"]
    // }],
    // 禁用一成不变的循环条件
    'no-unmodified-loop-condition': 'error',
    // 禁止未使用过的表达式
    'no-unused-expressions': ['error', { "allowShortCircuit": true, "allowTernary": true }],
    // 禁用不必要的 .call() 和 .apply()
    'no-useless-call': 'error',
    // 禁止没有必要的字符拼接
    'no-useless-concat': 'error',
    // 禁止多余的 return 语句
    'no-useless-return': 'error',
    // 禁用 with 语句
    'no-with': 'error',
    // 要求使用 Error 对象作为 Promise 拒绝的原因
    'prefer-promise-reject-errors': ["error", {"allowEmptyReject": true}],
    // 禁止使用不带 await 表达式的 async 函数
    'require-await': 'error',
    // 要求将变量声明放在它们作用域的顶部
    'vars-on-top': 'error',
    // 需要把立即执行的函数包裹起来
    'wrap-iife': ['error', 'any'],

    // 不允许在 catch 语句中遮盖变量
    'no-catch-shadow': 'error',
    // 禁止将标识符定义为受限的名字
    'no-shadow-restricted-names': 'error',
    // 禁止将变量初始化为 undefined
    'no-undef-init': 'error',
    // 禁止将 undefined 作为标识符
    'no-undefined': 'error',
    // 禁止在变量定义之前使用它们
    'no-use-before-define': 'error',
    // 强制数组方括号中使用一致的空格
    'array-bracket-spacing': ["error", "always"],
    // 强制数组元素间出现换行
    'array-element-newline': ["error", { "multiline": true }],
    // 强制在代码块中开括号前和闭括号后有空格
    'block-spacing': ["error", "always"],
    // 大括号风格要求
    'brace-style': ["error", "1tbs", { "allowSingleLine": true }],
    // 要求使用骆驼拼写法
    'camelcase': ["error", { "properties": "never" }],
    // 禁止使用拖尾逗号
    "comma-dangle": ["error", "never"],
    // 强制在逗号后使用空格
    'comma-spacing': ["error", { "before": false, "after": true }],
    // 强制使用一致的逗号风格
    'comma-style': ["error", "last"],
    // 禁止在计算属性中使用空格
    'computed-property-spacing': ["error", "never"],
    // 要求一致的 this 别名
    'consistent-this': ["error", "self"],
    // 要求文件末尾保留一行空行
    'eol-last': ["error", "always"],
    // 禁止在函数标识符和其调用之间有空格
    'func-call-spacing': ["error", "never"],
    // 强制 function 声明或表达式的一致性
    'func-style': ["error", "declaration", { "allowArrowFunctions": true }],
    // 强制在函数括号内使用一致的换行
    'function-paren-newline': ["error", "never"],
    // 强制标识符的最大和最小长度
    'id-length': ["error", { "min": 1, "max": 25 }],
    // 强制隐式返回的箭头函数体的位置
    'implicit-arrow-linebreak': ["error", "beside"],
    // 强制使用一致的缩进
    'indent': ["error", 2],
    // 强制在 JSX 属性中使用一致双引号
    'jsx-quotes': ["error", "prefer-double"],
    // 强制在对象字面量的键和值之间使用一致的空格
    'key-spacing': ["error", { 
        "beforeColon": false ,
        "afterColon": true,
        "align": "colon"
      }
    ],
    // 强制在关键字前后使用一致的空格
    'keyword-spacing': ["error", { "after": true, "before": true }],
    // 强制行注释的位置
    'line-comment-position': ["error", { "position": "above" }],
    // 要求在注释周围有空行
    // 'lines-around-comment': ["error", { "beforeBlockComment": true }],
    // 要求在类成员之间出现空行
    'lines-between-class-members': ["error", "always"],
    // 强制块语句的最大可嵌套深度
    // 'max-depth': ["error", 4],
    // 强制行的最大长度
    // 'max-len': ["error", { 
    //   "code": 80, // 强制行的最大长度
    //   "tabWidth": 4, // 指定 tab 字符的宽度
    //   "comments": 65, // 强制注释的最大长度
    //   "ignoreComments": true, // 忽略所有拖尾注释和行内注释
    //   "ignoreTrailingComments": true, // 忽略拖尾注释
    //   "ignorePattern": true, // 忽略正则表达式匹配的行；可以只匹配单行，而且在 YAML 或 JSON 中需要双重转义
    //   "ignoreUrls": true, // 忽略含有链接的行
    //   "ignoreStrings": true, // 忽略含有双引号或单引号字符串的行
    //   "ignoreTemplateLiterals": true, // 忽略包含模板字面量的行
    //   "ignoreRegExpLiterals": true //忽略包含正则表达式的行
    //  }],
    // 强制文件的最大行数
    // 'max-lines': ["error", {"max": 2, "skipBlankLines": true, "skipComments": true }]

    // 强制回调函数最大嵌套深度
    'max-nested-callbacks': ["error", { "max": 3 }],
    // 限制函数定义中最大参数个数
    'max-params': ["error", { "max": 3 }],

    // 限制函数块中的语句的最大数量
    // 'max-statements': ["error", { "max": 10, "ignoreTopLevelFunctions": true }]
    // 强制每一行中所允许的最大语句数量
    // 'max-statements-per-line': ["error", { "max": 2 }]
    // 强制对多行注释使用特定风格
    'multiline-comment-style': ["error", "starred-block"],
    // 要求或禁止在三元操作数中间换行
    // 'multiline-ternary': ["error", "always-multiline"],
    'new-cap': ["error", { 
      "newIsCap": true , // 要求调用 new 操作符时有首字母大小的函数
      "capIsNew": true, // 要求调用首字母大写的函数时有 new 操作符
    }],
    // 要求调用无参构造函数时带括号
    'new-parens' : "error",
    // 要求方法链中每个调用都有一个换行符
    'newline-per-chained-call': ["error", { "ignoreChainWithDepth": 2 }],
    // 禁止使用内联注释
    'no-inline-comments': 'error',
    // 禁止 if 语句作为唯一语句出现在 else 语句块中
    'no-lonely-if': 'error',
    // 禁止连续赋值
    'no-multi-assign': 'error',
    // 不允许多个空行
    'no-multiple-empty-lines':["error", { "max": 2, "maxBOF": 1 }],
    // 禁止标识符中有悬空下划线
    'no-underscore-dangle': ["error", { "enforceInMethodNames": true }],
    // 禁止可以表达为更简单结构的三元操作符
    'no-unneeded-ternary': ["error"],
    // 禁止属性前有空白
    'no-whitespace-before-property': ["error"],
    // 强制单个语句的位置
    'nonblock-statement-body-position': ["error", "beside"],
    // 强制在花括号内使用一致的换行符
    'object-curly-newline': ["error", { "multiline": true }],
    // 强制在花括号中使用一致的空格
    'object-curly-spacing': ["error", "always"],
    // 强制将对象的属性放在不同的行上
    'object-property-newline': ["error", { "allowAllPropertiesOnSameLine": true }],
    // 强制函数中的变量在一起声明或分开声明
    'one-var': ["error", "never"],
    // 要求或禁止在变量声明周围换行
    'one-var-declaration-per-line': ["error", "always"],
    // 要求或禁止尽可能地简化赋值操作
    'operator-assignment': ["error", "always"],
    // 强制操作符使用一致的换行符风格
    'operator-linebreak': ["error", "before"],
    // 要求对象字面量属性名称使用引号
    'quote-props': ["error", "as-needed", { "keywords": true }],
    // 强制使用一致的反勾号、双引号或单引号
    'quotes': ["error", "double", {"allowTemplateLiterals": true}],
    // 要求使用 JSDoc 注释
    // 'require-jsdoc': ["error", {
    //   "require": {
    //     "FunctionDeclaration": true,
    //     "MethodDefinition": true,
    //     "ClassDeclaration": true,
    //     "ArrowFunctionExpression": true,
    //     "FunctionExpression": true
    //   }
    // }]
    // 强制分号前后有空格
    'semi-spacing': ["error", {"before": false, "after": true}],
    // 禁止或强制圆括号内的空格
    "space-in-parens": ["error", "never"],
    // 要求中缀操作符周围有空格
    'space-infix-ops': ["error"],
    // 要求或禁止在一元操作符之前或之后存在空格
    'space-unary-ops': ['error', {"words": true, "nonwords": false}],
    'spaced-comment': ["error", "always", {
      "line": {
        "markers": ["eslint"],
        "exceptions": ["-", "+", "="]
      },
      "block": {
        "markers": ["!"],
        "exceptions": ["*"],
        "balanced": true
      }
    }],
    // 强制在 switch 的冒号左右有空格
    'switch-colon-spacing': ["error", {"after": true, "before": false}],
    // 要求箭头函数体使用大括号
    'arrow-body-style': ["error", "as-needed"],
    // 要求箭头函数的参数使用圆括号
    'arrow-parens': ["error", "as-needed"],
    // 要求箭头函数的箭头之前或之后有空格
    'arrow-spacing': ["error", { "before": true, "after": true }],
    // 禁止在可能与比较操作符相混淆的地方使用箭头函数
    'no-confusing-arrow': ["error", {"allowParens": true}],
    // 禁止重复导入
    'no-duplicate-imports': ["error", { "includeExports": true }],
    // 禁止在对象中使用不必要的计算属性
    'no-useless-computed-key': 'error',
    // 禁用不必要的构造函数
    'no-useless-constructor': 'error',
    // 禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字
    'no-useless-rename':  ["error", {
      "ignoreDestructuring": true,
      "ignoreImport": false,
      "ignoreExport": false
    }],
    // 要求使用 let 或 const 而不是 var
    'no-var': 'error',
    // 要求回调函数使用箭头函数
    'prefer-arrow-callback': [ "error", { "allowNamedFunctions": true } ],
    // 要求使用 const 声明那些声明后不再被修改的变量
    'prefer-const': ["error", {
      "destructuring": "any",
      "ignoreReadBeforeAssign": false
    }],
    // 优先使用数组和对象解构
    'prefer-destructuring':  ["error", {"object": true, "array": false}],
    // 建议使用剩余参数代替 arguments
    'prefer-rest-params': 'error',
    // 建议使用扩展运算符而非.apply()
    'prefer-spread': 'error',
    // 建议使用模板而非字符串连接
    'prefer-template': 'error',
    // 强制剩余和扩展运算符及其表达式之间无空格
    'rest-spread-spacing': ['error', 'never'],
    // import 排序
    // 'sort-imports': 'error',
    // 要求 symbol 描述
    'symbol-description': 'error',
    // 强制模板字符串中空格的使用
    'template-curly-spacing': ['error', 'never']
  }
}
