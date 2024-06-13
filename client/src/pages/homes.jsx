import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../context/authContext";
import { AxiosInstance } from "../axios";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { socket } from '../context/socketContext'
import axios from 'axios'

const Homes=()=>{
    const { poll, setPoll, user, active, setActive, setUser } = useContext(authContext)
    const [copied, setCopied] = useState()
    console.log(poll)

    useEffect(() => {
        const getPollInfo = async () => {
            try {
                const { data } = await AxiosInstance.get('/polls');
                console.log(data)
                setPoll(data)
            } catch (error) {
                console.log(error.message);
            }
        }
        getPollInfo();
    }, []);

    const leavePoll = () => {
        localStorage.removeItem('token')
        socket.emit('leave', "leave poll");
        socket.disconnect()
        navigate('/join')
    }

    socket.on('leaved', (poll) => {
        setPoll(poll)
    })
    socket.on('started', (poll) => {
        if (poll) {
            console.log(poll)
            setPoll(poll);
        }
        navigate('/home/voting');
    })

    const onCopy = (txt) => {
        setCopied(txt)
        toast.success("copied")
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                console.log("hii")
                const token = localStorage.getItem('token')
                const { data } = await AxiosInstance.get('polls/token')
                console.log(data);

                setUser(data)
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser()
    }, [])
    useEffect(() => {
        const getPollInfo = async () => {
            try {
                const { data } = await AxiosInstance.get('/polls');
                console.log(data)
                setPoll(data)
            } catch (error) {
                console.log(error.message);
            }
        }
        getPollInfo();
    }, []);

 

    socket.on('active', (arr) => {
        console.log(arr)
        setActive(arr);
    })


    useEffect(() => {
        console.log("active:", active)
    }, [active])

    const location = useLocation();
    console.log(location.pathname);

return (<>
<div className="flex flex-row w-full h-screen bg-[#FAFAFF] ">
    <Sidebar/>
    <div className="bg-gray-100 w-full h-full 
     px-4 overflow-y-auto">
    <Outlet/>
    </div>

</div>
</>)
}

export default Homes;