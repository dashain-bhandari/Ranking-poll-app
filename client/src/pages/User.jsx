
import { Link } from 'react-router-dom';
import image from '../assets/images.jpeg';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import { socket } from '../context/socketContext';
import { act, useContext, useEffect } from 'react';
import { authContext } from '../context/authContext';
const User = () => {

    const navigate = useNavigate()
    const { active,poll ,setActive} = useContext(authContext);
  
  console.log(poll?.users)
    return (<>
        <div className='flex flex-col  h-full px-8 gap-2 mt-12'>
            <div className='mt-4 text-2xl text-[#273469]'> All Users</div>
            {
                poll && poll.users.length>0 && poll.users.map((item,idx)=>(<><div className='bg-white border border-1 border-gray-200 px-4 mt-4 py-2 rounded flex flex-row justify-between'>
                  <div>
                  {item.name} </div> 
           
                  
                   <div className='text-[#502F4C]'>{active.find((i)=>i.userId==item.userId) && "active"}  </div>  
                   </div> </>))
            }
        </div>
    </>)
}

export default User