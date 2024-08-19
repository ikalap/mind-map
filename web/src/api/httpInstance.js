import axios from 'axios'
import { Message } from 'element-ui'

const http = axios.create({
    timeout: 10000,
    withCredentials: true,
    baseURL: '/mind-map-api/'
})

// 请求拦截器
http.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 响应拦截器
http.interceptors.response.use(
    function (response) {
        const { code, message } = response.data
        if (code === 401) {
            // 登录过期，跳转到登录页
            if (/^\/login/.test(location.pathname)) {
                return Promise.reject(response)
            } else {
                location.href = '/login'
            }
        } else if (code !== 0) {
            Message.error(message || '系统错误')
            return Promise.reject(response)
        }
        return response.data
    },
    function (error) {
        return Promise.reject(error)
    }
)

export default http