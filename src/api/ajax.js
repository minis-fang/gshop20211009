// 封装ajax函数用来发送后台请求
// 返回数据为Promise对象，返回的是response.data
import Axios from "axios";
export default function ajax(url, data = {}, type = "GET") {
    return new Promise(function (reslove, reject) {
        // 执行异步调用
        let promise;
        if (type === "GET") {
            let dataStr = ""
            Object.keys(data).forEach(key => {
                dataStr += key + "=" + data[key] + "&"
            })
            if (dataStr != "") {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf("&"));
                url += "?" + dataStr
            }
            promise = Axios.get(url)
        } else {
            promise = Axios.post(url, data)
        }
        promise.then(function (response) {
            // 成功的回调
            reslove(response.data)
        }).catch(function (error) {
            // 失败的回调
            reject(error)
        })
    })
}