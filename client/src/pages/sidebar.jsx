import { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext";
import { socket } from '../context/socketContext'

const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const [copied, setCopied] = useState()
    const onCopy = (txt) => {
        setCopied(txt)
        toast.success("copied")
    }
    const { poll, setPoll, user, active, setActive, setUser } = useContext(authContext)
    
    const leavePoll = () => {
        localStorage.removeItem('token');
        setUser(null)
        socket.emit('leave', "leave poll");
        socket.disconnect()
        navigate('/join')
    }


    return (<>
        <div className="flex  h-screen flex-col  w-2/3 md:w-1/4 bg-white px-4 gap-2">
            <div className="mb-4 mt-10">

                <div className=' text-center rounded p-2 text-violet-800  flex flex-row items-center justify-center gap-4'>
                    <div> {poll?.pollId}</div>
                    <CopyToClipboard onCopy={onCopy} text={poll?.pollId}>
                        <div className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
                                <path fill="#8980F5" d="M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415M11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2z" />
                            </svg>
                        </div>
                    </CopyToClipboard>
                </div>

            </div>
            <Link className={`mb-2  ${pathname.includes('users') ? "bg-[#8980F5] text-white rounded px-4 py-2 hover:text-white" : "hover:text-[#1E2749]"}  `} to="users">Users</Link>
            <Link className={`mb-2 ${pathname.includes('nominations') || pathname == "/home" || pathname == "/home/" ? "bg-[#8980F5]  rounded p-2 text-white hover:text-white  " : "hover:text-[#1E2749]"}  `} to='nominations'> Nominations</Link>
            <Link className={`mb-2  ${pathname.includes('voting') ? "bg-[#8980F5] text-white rounded p-2 hover:text-white" : "hover:text-[#1E2749]"}`} to='voting'>Votings</Link>
            <button className="text-violet-800  hover:text-violet-600 py-2 flex justify-center" onClick={()=>leavePoll()} >Leave poll </button>
        </div>

    </>)

}

export default Sidebar;