import axios from "axios"

const Api = axios.create({
    baseURL: "https://api.paycollect.ru/v1",
})

// Api.interceptors.request.use(req => {
//     console.log(req)
//     return req
// })
//
// Api.interceptors.response.use(res => {
//     console.log(res)
//     return res
// })

export default Api
