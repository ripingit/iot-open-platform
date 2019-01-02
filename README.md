# IOT-OPEN-PLATFORM

迈科物联开放平台


# 配置及启动服务

一、安装 `node` 服务，下载 `nodejs` 安装包下载

二、修改 `config` 文件夹下面的 `index.js` 内容：

```js
proxyTable: {
  '/': {
    target: 'http://192.168.9.155',  // 本行修改成需要的ip、端口
    changeOrigin: true,
    secure: true,
    pathRewrite: {"^/api" : ""}
  }
}
```

三、打开项目根目录（含有 `package.json` 的文件夹），在命令行执行 `npm install` 命令，`npm install` 命令结束后执行 `npm start` 启动服务