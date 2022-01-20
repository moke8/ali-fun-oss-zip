const getRawBody = require('raw-body');
const oss = require('ali-oss')
const AdmZip = require('adm-zip')

module.exports.handler = async function(req, resp, context) {
    const data = await getRawBodyJSON(req)

    const client = new oss({
        region: 'oss-'+ (data.region || context.region),
        bucket: data.bucket,
        accessKeyId: 'accessKeyId',
        accessKeySecret: '****accessKeySecret****',
        internal: true
    });
    
    const request = spArr(data['source-files'].map(item=>client.get(item)), 20) // 允许20条请求并发下载
    const zip = new AdmZip();
    const result = []
    for(const item in request){
        result.push(...await Promise.all(request[item]))
    }

    for(const i in data['source-files']){
        let fileName = data['source-files'][i].split('/')
        fileName = fileName[fileName.length - 1]
        zip.addFile(fileName, result[i].content)
    }
    resp.setHeader('content-type', 'zip');
    resp.send(zip.toBuffer())
}

// 取得POST的JSON数据
function getRawBodyJSON(req){
    return new Promise((resolve)=>{
        getRawBody(req, function(err, body) {
            body = body.toString();
            const data = JSON.parse(body.replace(/\s/g, ''))
            resolve(data)
        }); 
    })
}

/**
 * 将数组分为多个
 * @param {array} arr 
 * @param {number} num 
 * @returns 
 */
function spArr(arr, num) {
	let newArr = []
	for (let i = 0; i < arr.length;) {
		newArr.push(arr.slice(i, i += num));
	}
	return newArr
}
