
import { Link } from 'react-router-dom';
import image from '../assets/images.jpeg';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import  { AxiosInstance } from '../axios';
import { socket } from '../context/socketContext';
import { useContext, useEffect } from 'react';
import { authContext } from '../context/authContext';

const Create = () => {

    const navigate = useNavigate()
    const { watch, register, handleSubmit } = useForm()
    const allInputField = watch();
    const { poll, setPoll, user,active ,setActive } = useContext(authContext);

    socket.on('active', (arr) => {
        console.log(arr)
        setActive(arr);
    })

    const onSubmit = async () => {
      
        console.log("hiii")
        try {

            const { data } = await AxiosInstance.post('polls/', allInputField);
            console.log(data)
            if (data) {
                localStorage.setItem("token", data.token);
                if (socket.connected) {
                    socket.disconnect();
                }
                socket.auth.token=data.token
                socket.connect();
                navigate('/home');
            }

            // navigate('/home')
        } catch (error) {
            console.log(error.message);
        }
    }
    return (<>
        <div className='flex flex-col justify-center h-screen items-center'>
            <h1 className='text-2xl '>Indecisive? <span className='text-2xl text-violet-500'>Say no more!!!</span></h1>

            <div className="flex flex-row w-full md:w-2/3  shadow-xl p-4 justify-center items-center  h-[60%] ">

                <div className="h-full w-full" style={{ backgroundImage: `url(${image})`, backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>

                </div>
                <div className='flex flex-col justify-center items-center w-full p-4 gap-4'>

                    <form className='flex flex-col w-full gap-2' onSubmit={handleSubmit(onSubmit)}>
                        <input className='p-2' placeholder='Name of poll' {...register("topic")}></input>
                        <input className='p-2' placeholder='Votes per Voter'  {...register("votesPerVoter")}></input>
                        <input className='p-2' placeholder='Your name'  {...register("adminName")}></input>
                        <button type='submit' className='bg-violet-500 hover:bg-violet-700 px-2 py-2 rounded text-white'>Create poll</button>
                    </form>
                    <div className='text-gray-700'>Or join an existing poll ?<Link to='/join' className='text-violet-700'>Join poll</Link></div>
                </div>
            </div>
        </div>
    </>)
}

export default Create