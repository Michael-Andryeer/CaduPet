import api from '../utils/api';
import useFlashMessage from './useFlashMessage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false);
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
            setAuthenticated(true);
        }
    }, []);

    async function register(user) {
        let msgText = 'Cadastro realizado com sucesso';
        let msgType = 'success';

        try {
            const response = await api.post('/users/register', user);
            const data = response.data;
            
            await authUser(data);
            navigate('/');
        } catch (error) {
            // Handle both network errors and API errors
            if (!error.response) {
                msgText = 'Erro de conexão com o servidor';
            } else {
                msgText = error.response.data.message || 'Erro ao cadastrar';
            }
            msgType = 'error';
            setFlashMessage(msgText, msgType);
            throw error; // Re-throw to handle in the component
        }
        setFlashMessage(msgText, msgType);
    }

    async function login(user) {
        let msgText = 'Login realizado com sucesso';
        let msgType = 'success';

        try {
            const response = await api.post('/users/login', user);
            const data = response.data;
            
            await authUser(data);
            setFlashMessage(msgText, msgType);
            navigate('/');
        } catch (error) {
            // Handle both network errors and API errors
            if (!error.response) {
                msgText = 'Erro de conexão com o servidor';
            } else {
                msgText = error.response.data.message || 'Erro ao fazer login';
            }
            msgType = 'error';
            setFlashMessage(msgText, msgType);
            throw error; // Re-throw to handle in the component
        }
    }

    async function authUser(data) {
        setAuthenticated(true);
        localStorage.setItem('token', JSON.stringify(data.token));
        api.defaults.headers.Authorization = `Bearer ${data.token}`;
    }

    function logout() {
        const msgText = 'Logout realizado com sucesso!';
        const msgType = 'success';

        setAuthenticated(false);
        localStorage.removeItem('token');
        api.defaults.headers.Authorization = undefined;
        navigate('/');

        setFlashMessage(msgText, msgType);
    }
    return { authenticated, register, logout, login };
}

