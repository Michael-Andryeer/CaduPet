import api from '../utils/api';
import useFlashMessage from './useFlashMessage';
import { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function useAuth() {
    const [ authenticated,setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.Authorization = `Bearer${JSON.parse(token)}`
            setAuthenticated(true)
        }
    },[])

    async function register(user) {
        let msgText = 'Cadastro realizado com sucesso';
        let msgType = 'success';

        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data;
            });
            console.log(data);

            // Autentica o usuário e redireciona para a home após o cadastro
            await authUser(data)
            navigate('/') // Redireciona para a página inicial (home)
        } catch (error) {
            msgText = error.response.data.message || 'Erro ao cadastrar'
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    async function login(user) {
        let msgText = 'Login realizado com sucesso'
        let msgType = 'successo'

        try {
            const data = await api.post('/users/login', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch (error) {
            msgText = error.response.data.message
            msgType = 'Erro'

            setFlashMessage(msgText, msgType);
            setTimeout(() => setFlashMessage('', ''), 5000); // Limpa a mensagem após 5 segundos
            return; // Interrompe o fluxo para evitar redirecionamento em caso de erro
        }
        setFlashMessage(msgText, msgType)
        navigate('/') 
    }

    async function authUser(data) {
        setAuthenticated(true)

        localStorage.setItem('token',JSON.stringify(data.token))
    }

    function logout(){
        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'Sucesso'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.default.headers.Authorization = undefined
        navigate('/') 

        setFlashMessage(msgText, msgType)
    }
    return { authenticated, register,logout,login }
}
