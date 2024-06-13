import { useContext } from 'react';
import io from 'socket.io-client'


const token=localStorage.getItem('token')
export const socket=io('http://localhost:3000',{
    auth: {
        token: token
    }
});
