## 需求
打包下载 OSS 上存储的多个文件，例如将OSS上的一个目录打包下载。这样可以节省网络传输的数据，达到减少费用和下载时间的效果。

# 方案
通过云函数内网打包下载OSS文件压缩为ZIP并直接返回数据流，不压盘存储不占用OSS数据存储空间。

压缩性能实测100M的文件可以压缩到50多M。

## 使用方法
1. 安装依赖 ``` npm install ```
2. 将index.js中client信息改为自己的阿里云key和secret

## 部署方法
### 第一种：使用Funcraft
如果你未安装可以安装下面顺序安装。
1. 安装Funcraft ``` npm install @alicloud/fun -g ```
2. 配置 ``` fun config ```
3. 本地调试 ``` fun local start ```
4. 发布到阿里云 ``` fun deploy ```

### 第二种：直接上传
也可以直接打包压缩上传到阿里云云函数的函数空间中

## 调用方法
POST传参
``` JSON
{
    "region": "cn-shanghai",  // 文件所在区域，默认为当前函数所在区域
    "bucket": "bullet001", // 文件所在的bucket
    "source-files": [
        "bill/pay/1.00_S865054.pdf"
    ] // OSS路径文件列表
}
```
