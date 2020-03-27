import CryptoJS from 'crypto-js'; //引入crypto-js
const AesKey = {
    key: 'xxxxxx',
    iv: 'xxxxxx' //偏移量
};
/**
 * SHA256加密方式
 * @param {String} data 需要加密字符串
 */
const sha256 = (data) => {
    return CryptoJS.SHA256(data).toString();
};
/**
 * MD5加密方式
 * @param {String} data 需要加密字符串
 */
const md5 = (data) => {
    return CryptoJS.MD5(data).toString();
};
/**
 * AES对称秘钥加密
 * @param {String} data 需要加密字符串
 */
const aes = (data) => getAesString(data, AesKey.key, AesKey.iv);
/**
 * AES对称秘钥解密
 * @param {String} data 需要加密字符串
 */
const deAes = (data) => getDeAesString(data, AesKey.key, AesKey.iv);
/**
 * BASE64加密
 * @param {String} data 需要加密字符串
 */
const base64 = (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
/**
 * BASE64解密
 * @param {String} data 需要加密字符串
 */
const deBase64 = (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
/**
 * AES加密
 * @param {String} data  需要加密字符串
 * @param {String} key  秘钥
 * @param {String} iv 偏移量
 */
function getAesString(data, key, iv) {
    let encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString(); // 返回的是base64格式的密文
}
/**
 * AES解密
 * @param {String} data  需要加密字符串
 * @param {String} key  秘钥
 * @param {String} iv 偏移量
 */
function getDeAesString(data, key, iv) {
    let decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
/**
 * 签名
 * @param timestamp 签名时间戳
 * @param token 身份令牌
 * @param data 签名数据
 */
const sign = (timestamp, token, data) => {
    // 签名格式： timestamp + token + data(字典升序)
    let ret = [];
    for (let it in data) {
        let val = data[it];
        if (typeof val === 'object' && //
            (!(val instanceof Array) || (val.length > 0 && (typeof val[0] === 'object')))) {
            val = JSON.stringify(val);
        }
        ret.push(it + val);
    }
    // 字典升序
    ret.sort();
    let signsrc = String(timestamp) + String(token) + ret.join('');
    return md5(signsrc);
};
export {
    sha256,
    md5,
    aes,
    deAes,
    base64,
    deBase64,
    sign
}