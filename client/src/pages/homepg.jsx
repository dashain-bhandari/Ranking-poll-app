import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import image from '../assets/images.jpeg'
import { useForm } from 'react-hook-form'
import { AxiosInstance } from '../axios'
import { useContext } from 'react'
import { authContext } from '../context/authContext'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { socket } from '../context/socketContext'
import axios from 'axios'
import toast from 'react-hot-toast'
const HomePg = () => {

    const navigate = useNavigate()
    const { watch, register, handleSubmit } = useForm()
    const allInputField = watch();
    const { poll, setPoll, user, active, setActive, setUser } = useContext(authContext)
    const [copied, setCopied] = useState()
    console.log(poll)
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
    return (<><div className=' w-full h-screen flex flex-col'>
        <button className='self-end py-4 px-8' onClick={leavePoll} ><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20">
            <g fill="#8771f4" fill-rule="evenodd" clip-rule="evenodd">
                <path d="M15.027 7.232a1 1 0 0 1 1.408.128l2.083 2.5a1 1 0 0 1-1.536 1.28l-2.083-2.5a1 1 0 0 1 .128-1.408" />
                <path d="M15.027 13.768a1 1 0 0 1-.129-1.408l2.084-2.5a1 1 0 1 1 1.536 1.28l-2.083 2.5a1 1 0 0 1-1.408.128" />
                <path d="M17.5 10.5a1 1 0 0 1-1 1H10a1 1 0 1 1 0-2h6.5a1 1 0 0 1 1 1M3 3.5a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m0 14a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1" />
                <path d="M13 2.5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m0 10a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m-9-10a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0v-14a1 1 0 0 1 1-1" />
            </g>
        </svg></button>
        <div className=' h-full w-full py-4 px-8 flex flex-col gap-8'>
            <div className=' bg-gray-100 w-full flex flex-col  p-4 rounded' >
            <div className='text-violet-600'>{user?.name}</div>
                <div className='flex flex-row gap-2 justify-between items-center'>

<div >

                        <span className='text-gray-700'>Poll Id: </span>{"  " + user?.pollId}

                    </div>
                <CopyToClipboard onCopy={onCopy} text={poll?.pollId}>
                    <div className='bg-violet-500 hover:bg-violet-600 rounded p-2 text-white cursor-pointer'>
                        {"Click to Copy"}
                    </div>
                </CopyToClipboard>
                   
                </div>
                 

            </div>
            {poll && (<div className='flex flex-col justify-center h-full    items-center bg-gray-100  '>
                <div className=' w-full   h-full py-4 py-2 '>
                    <nav className='flex flex-row gap-8 px-8 '>

                        <Link to={'nominations'} className={`hover:text-violet-800 ${(location.pathname == "/home/nominations" || location.pathname == '/home') && "text-violet-800 underline"}`}>
                            Nominations
                        </Link>

                        <Link to={'users'} className={`hover:text-violet-800 ${location.pathname == "/home/users" && "text-violet-800 underline"}`}>
                            Users
                        </Link>
                        <Link to={'voting'} className={`hover:text-violet-800 ${location.pathname == "/home/voting" && "text-violet-800 underline"}`}>
                            Votings
                        </Link>
                    </nav>

                    <div className='h-full overflow-y-auto'>

                        <Outlet />
                    </div>

                </div>
            </div>)}

        </div>

    </div>


    </>)
}

export default HomePg