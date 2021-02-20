import axios from 'axios'
import QS from 'qs'
axios.defaults.baseURL = '/api'
//设置超时时间
axios.defaults.timeout = 2000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


export default function http(method, url, params) {
    if (method == "get") {
        return axios.get(url, { params: params })
    } else if (method == "post") {
        return axios.post(url, params)
    }
}

