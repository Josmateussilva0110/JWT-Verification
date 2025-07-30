import api from '../utils/api'
import useFlashMessage from './useFlashMessage'

import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
//import useFlashMessage from './useFlashMessage'

export default function useAuth() {
    let msgText = ''
    let msgType = ''
    const [authenticated, setAuthenticated] = useState(false)
    const {setFlashMessage} = useFlashMessage()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
    }, [])

    async function register(user) {
        try {
            const response = await api.post('/user/register', user)
            const data = response.data
            msgText = data.message
            msgType = 'success'
            await authUser(data)
        } catch (error) {
            msgText = error.response?.data?.message || 'Erro desconhecido'
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))
        navigate('/')
    }

    async function login(user) {
        try {
            const response = await api.post('/user/login', user)
            const data = response.data
            msgText = data.message
            msgType = 'success'
            await authUser(data)
        } catch (error) {
            msgText = error.response?.data?.message || 'Erro desconhecido'
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    function logout() {
        const msgText = 'Logout realizado com sucesso.'
        const msgType = 'success'
        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/')
        setFlashMessage(msgText, msgType)
    }

    return {authenticated, register, logout, login}
}
