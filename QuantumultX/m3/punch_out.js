const http = require('http');
const crypto = require('crypto');

const iv = Buffer.from('01234567', 'utf-8');
const secretKey = Buffer.from('m1yanfa@seeyon.com119$#M1#$', 'utf-8');

function generateKey(secret) {
    const keyBuffer = Buffer.alloc(24);
    secret.copy(keyBuffer, 0, 0, Math.min(secret.length, 24));
    return keyBuffer;
}

function encode(str) {
    if (!str) return '';
    try {
        const cipher = crypto.createCipheriv('des-ede3-cbc', generateKey(secretKey), iv);
        let encrypted = cipher.update(str, 'utf-8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    } catch (error) {
        throw new Error(error.message);
    }
}


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const deviceId = 'D2528457-4773-4342-928F-C6FBCB0C4029';

const hostname = 'http://oa.hunktimes.com:9999';
const cookie = 'JSESSIONID=78382FE1534299BEBEFB706AE1357286';

const commonHeaders = {
    'accessm3-scheme': 'http',
    'Connection': 'keep-alive',
    'Accept-Encoding': 'gzip, deflate',
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'seeyon-m3/4.6.2',
    'Cookie': cookie,
    'Host': 'oa.hunktimes.com:9999',
    'cmp-plugins': 'cmp/faceid',
    'Accept-Language': 'zh_CN',
    'Accept': 'application/json; charset=utf-8',
};

function sign(headers) {
    return new Promise((resolve, reject) => {


        const options = {
            hostname: hostname,
            path: 'mobile_portal/seeyon/rest/attendance/save/m3?option.n_a_s=1',
            method: 'POST',
            headers: headers,
        };

        const submitParams = getSubmitParams();
        const data = JSON.stringify(submitParams);

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                console.info(responseData);
                resolve();
            });
        });

        req.on('error', (error) => {
            console.error('Error:', error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

function getSubmitParams() {
    const params = {

        // 地点
        sign: '杭州网易2（网商路399号）',
        // 类型
        source: 2,
        // 设备ID 应该是固定值 不存在则生成个uuid
        deviceId: deviceId,
        // 1:上班 2:下班
        type: 2,
        // 经度维度
        longitude: '120.1977845594618',
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
        .update(params.sign + params.longitude + params.latitude + params.nearAddress + timestamp + nonce + '')
        .digest('hex');
    params.timestamp = timestamp + '';
    params.nonce = nonce;
    params.digitSign = keySign;
    return params;
}

(async () => {
    // const randomDelay = Math.floor(Math.random() * (3 * 60 - 1 * 60 + 1) + 1 * 60);
    const randomDelay = 1;
    console.log('Waiting for ${randomDelay} seconds before executing...');
    await delay(randomDelay * 1000);
    try {
        if (cookie) {
            await sign(commonHeaders);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
