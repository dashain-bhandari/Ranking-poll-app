
import { Link } from 'react-router-dom';
import image from '../assets/images.jpeg';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import  { AxiosInstance } from '../axios';
import { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/authContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const Main = () => {
    const [copied, setCopied] = useState()
    const navigate = useNavigate()
    const { watch, register, handleSubmit } = useForm()
    const allInputField = watch();
    const { poll } = useContext(authContext)


    const onSubmit = async () => {
        console.log("hiii")
        try {

            const { data } = await AxiosInstance.post('polls/', allInputField);
            console.log(data)
            if (data) {
                localStorage.setItem("token", data.token);
                navigate('/home');
            }

            // navigate('/home')
        } catch (error) {
            console.log(error.message);
        }
    }

    const onCopy = (txt) => {
        setCopied(txt)
    }
    useEffect(() => {
        console.log(copied)
    }, [copied])
    return (<>
        <div className=' h-full w-full p-8 '>
            <div className='bg-gray-200 w-full flex flex-row justify-between p-4 rounded' >

                <div >
                    <span className='text-gray-700'>Poll Id: </span>{"  " + poll.pollId}

                </div>
                <CopyToClipboard onCopy={onCopy} text={poll.pollId}>
                    <div className='bg-violet-500 hover:bg-violet-600 rounded p-2 text-white cursor-pointer'>
                        Click to Copy
                    </div>
                </CopyToClipboard>

            </div>
        </div>
    </>)
}

export default Main