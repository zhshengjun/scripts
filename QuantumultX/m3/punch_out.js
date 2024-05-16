/**
 * @fileoverview Template to compose HTTP reqeuest.
 *
 */
const crypto = require("crypto");


const url = 'http://oa.hunktimes.com:9999/mobile_portal/seeyon/rest/attendance/save/m3?option.n_a_s=1';

const method = 'POST';
const deviceId = 'D2528457-4773-4342-928F-C6FBCB0C4029';
const hostname = 'oa.hunktimes.com:9999';
const ticket = 'JSESSIONID=78382FE1534299BEBEFB706AE1357286';


const myRequest = {
    url: url,
    method: method,
    get headers() {
        return dynamicHeadersFunction();
    },
    get body() {
        return dynamicBodyFunction();
    }
}

function dynamicHeadersFunction() {
    // 在这里进行逻辑操作，获取需要的头信息
    return {
        'accessm3-scheme': 'http',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        'option.n_a_s': '1',
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'seeyon-m3/4.6.2',
        'Host': hostname,
        'cmp-plugins': 'cmp/faceid',
        'Accept-Language': 'zh_CN',
        'Accept': 'application/json; charset=utf-8',
        'Cookie': ticket,
        'cmp-plugins': 'cmp/faceid',
        'ltoken': 'DxYTSHQeXs6'
    };
}

function dynamicBodyFunction() {
    const params = {
        // 地点
        sign: '杭州网易2（网商路399号）',
        // 类型
        source: 2,
        // 设备ID 应该是固定值 不存在则生成个uuid
        deviceId: deviceId,
        // 1:上班 2:下班
        type: 2,
        // 经度
        longitude: '120.1977845594618',
        // 维度
        latitude: '30.18239420572917',
        continent: '',
        // mac地址
        macAddress: '',
        country: '中国',
        province: '浙江省',
        city: '杭州市',
        town: '滨江区',
        street: '长河街道',
        nearAddress: '浙江省杭州市滨江区长河街道滨康路330号保利天汇',
        classType: '0',
        fixTime: '18:00',
        workDown: false,
    };

    const timestamp = new Date().valueOf();
    const nonce = crypto
        .createHash('md5')
        .update(timestamp + Math.round(Math.random() * 1000) + '')
        .digest('hex');
    const keySign = crypto
        .createHash('md5')
        .update(
            params.sign +
            params.longitude +
            params.latitude +
            params.nearAddress +
            timestamp +
            nonce +
            ''
        )
        .digest('hex');
    params.timestamp = timestamp + '';
    params.nonce = nonce;
    params.digitSign = keySign;
    return params;
}

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + '\n\n' + response.body);
    $done();

}, reason => {
    console.log(reason.error);
    $done();

});
