import api from './api'

// endpoint: rota da API
// method: GET, POST, PUT, DELETE
// data: corpo da requisição (se houver)
// token: token JWT (opcional)
async function requestData(endpoint, method = 'get', data = {}, token = null) {
  try {
    const config = {}

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      }
    }

    // se o corpo for FormData, forçar multipart
    if (data instanceof FormData) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      }
    }

    const response = await api({
      url: endpoint,
      method: method.toLowerCase(),
      data: ['post', 'put', 'patch'].includes(method.toLowerCase()) ? data : undefined,
      params: method.toLowerCase() === 'get' ? data : undefined,
      ...config,
    })

    return {
      success: true,
      status: response.status,
      data: response.data,
      message: response.data.message
    }
  } catch (err) {
    return {
      success: false,
      status: err.response?.status || 500,
      message: err.response?.data?.message || err.message,
    }
  }
}

export default requestData
