# upload组件使用方法



1、引入组件
```js
import UploadComponent from '@/components/_ui/upload.vue'
```

2、注册组件
```js
export default {
  components: { UploadComponent },
}
```

3、参数配置
```js
export default {
  data () {
    return {
      uploaderOptions: {
        path: '', // 上传路径，必填
        previewPath: '', // 编辑时图片路径，可选
        name: '', // 上传时服务端接收名称，可选，默认photo
        accept: ['.jpg', '.jpeg', '.png'], // 可上传文件类型，可选，不填写则说明不限制上传类型
        size: 2, // 上传文件大小限制，可选
        condition: '格式为 jpg\jpeg\png 且小于2M', // 上传文件条件提示，可选，纯按钮模式不生效
        model: '', // 组件模式，选择哪种形式的上传组件，目前仅两种，可预览模式（仅上传图片时可预览）和纯按钮模式，可取值 preview、btn，默认为纯按钮模式
      }
    }
  }
}
```

4、组件使用
```html
<UploadComponent
  ref="uploaderGoodPic"
  :path="uploaderOptions.path"
  :previewPath="data.picture"
  :accept="uploaderOptions.accept"
  :size="uploaderOptions.size"
  :model="uploaderOptions.model"
  :condition="uploaderOptions.condition"
  @response="getUploadResult"></UploadComponent>
```
```js
export default {
  data () {
    return {
      data: {
        picture: ''
      }
    }
  },
  method: {
    getFormData () {
      // 编辑时获取到待编辑的数据
      this.$http.post('url').then(res => {
        this.data.picture = res.picture
      })
    },
    // 获取上传结果
    getUploadResult () { }
  }
}

// 另外在需要将上传组件恢复到初始状态时可调用上传组件的 reset 方法，如：this.$refs['uploaderGoodPic'].reset()
```

