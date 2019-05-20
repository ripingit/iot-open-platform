## 使用方法

1、导入

```js
import DescComponent from "@/components/multi-language-textarea/multi-language-textarea.vue"
```

2、使用

```js
export default {
  components: { DescComponent },
}
```
```html
<DescComponent v-model="form.change_log" placeholder="请输入" :required="true"></DescComponent>
```


注意：<font style="color:red"> `change_log` 格式如下：</font>

```js
{
  CN: "",
  EN: ""
}
```

其中键名必须与组件中的 `select` 的 `value` 值一致。
