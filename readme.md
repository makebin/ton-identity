## 🈸一个轻量级浏览器内事件统计工具
对鼠标相关事件进行记录，对数据降噪，压缩差值后通过Image提交数据到服务器
使用方式
```html
  var t = new TonIdentity.reported({
    reportedUrl: "https://www.qq.com?" //这里填写自己搭建服务器上报地址
  });  

  #上报时未编码时的数据
  {"f":["x","y","t"],"v":[[48,413,51319],[645,289,51319],[617,121,51319],[501,5,51319],[451,270,51321],[60,254,51321]]}
  {"f":["x","y","t","e"],"v":[[471,278,51320,{"i":"","n":"HTML","t":"click"}]]}
  f:为压缩上报数据格式,v为压缩后的数据

```
配置参数:
```json
{
  reportedUrl:string; //上报地址
  regularTime?:Number=10; //定时上报周期
  formatted?:(val:Object) => Object//自定义压缩上报数据压缩格式函数
}
```


```html
//返回浏览器常用的身份信息JSON
TonIdentity.identity().info
//获取base64编码后的数据内容
TonIdentity.identity().base64();
```
```json
{
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "screen": {
        "width": 1920,
        "height": 1080
    },
    "timeZone": "Asia/Shanghai",
    "language": "zh-CN",
    "getWebGLFingerprint": "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti (0x00001C82) Direct3D11 vs_5_0 ps_5_0, D3D11) Google Inc. (NVIDIA)",
    "getCanvasFingerprint": -998718102,
    "connection": {
        "effectiveType": "4g",
        "downlink": 6.6,
        "rtt": 50
    },
    "hardwareConcurrency": 8,
    "deviceMemory": 8,
    "cookiesEnabled": true,
    "supportsWebGL": true,
    "supportsServiceWorkers": true,
    "supportsPushNotifications": true,
    "time": 1721023617713
}
```

🉑🉐