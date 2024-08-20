import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'axios'
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const err = error as AxiosError
    if (!err.config!.url?.startsWith('/api/login') && err.response && err.response.status === HttpStatusCode.Unauthorized) {
      alert('權限驗證失敗，將進行重新整理')
      window.location.reload()
      return Promise.reject(new Error('權限驗證失敗，將進行重新整理!'))
    }
    return Promise.reject(err)
  },
)

export default apiClient
