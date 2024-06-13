
import { Link } from 'react-router-dom';
import image from '../assets/images.jpeg';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import Popup from 'reactjs-popup';
import { useContext, useEffect, useState } from 'react';
import { socket } from '../context/socketContext';
import { authContext } from '../context/authContext';
import { Tooltip } from 'react-tooltip'
const Nomination = () => {

  const navigate = useNavigate()
  const { watch, register, handleSubmit } = useForm()
  const { poll, setPoll, user,active ,setActive } = useContext(authContext);
  console.log(poll)
  const allInputField = watch();
  const [nomination, setNomination] = useState({
    nomination: "",
    user: user?.userId,
    name: user?.name
  })
  
  console.log(socket)

  const onSubmit = async () => {

    console.log(nomination)
    socket.emit('addNomination', {...nomination,user: user?.userId,
      name: user.name});
setNomination({
  nomination: "",
  user: user?.userId,
  name: user?.name
})
      closePopup()
  }

  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);

  };

  socket.on('pollUpdate', (data) => {
    console.log("emitted");
    console.log(data)
    setPoll(data);
  })
  useEffect(() => {
    console.log(user)
    console.log(poll)
  }, [poll])

  const onDelete = (id) => {
    socket.emit('removeNomination', id)
  }
  return (<>
    {<div className='flex flex-col h-full mt-12 '>
      <div className='flex flex-row justify-between items-center pt-8 '>
      <div className='text-xl text-[#273469] px-8'>{poll?.topic}</div>
      {
        poll && poll?.nominations?.length > 0 && !poll.votingStarted && !poll.votingEnded && (<button className='p-4 mx-8  bg-[#512888] hover:bg-[#4B0082] text-white w-fit self-end  rounded' onClick={openPopup}>Add nomination</button>)
      }
      </div>
      
      <Tooltip id='my-tooltip' ></Tooltip>
      <div className='flex flex-col gap-4 w-full px-8 pt-8'>{
        poll && poll?.nominations?.length > 0 && poll.nominations.map((item, idx) => {
          return (<>
            <div className='flex flex-row justify-between w-full bg-white border border-gray-200 items-center px-2'>
              <div data-tooltip-id="my-tooltip" data-tooltip-content={item?.name} className=' p-4 rounded cursor-pointer w-full' key={idx}>{item?.nomination}</div>

              {
                poll && (item.user == user.userId || poll.admin == user.userId) && !poll.votingStarted && !poll.votingEnded && 
                (<>
                  <div className={`cursor-pointer`} onClick={() => onDelete(item.nominationId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 512 512">
                      <path fill="none" d="M296 64h-80a7.91 7.91 0 0 0-8 8v24h96V72a7.91 7.91 0 0 0-8-8"></path>
                      <path fill="none" d="M292 64h-72a4 4 0 0 0-4 4v28h80V68a4 4 0 0 0-4-4"></path>
                      <path fill={`#fb3737`} d="M447.55 96H336V48a16 16 0 0 0-16-16H192a16 16 0 0 0-16 16v48H64.45L64 136h33l20.09 314A32 32 0 0 0 149 480h214a32 32 0 0 0 31.93-29.95L415 136h33ZM176 416l-9-256h33l9 256Zm96 0h-32V160h32Zm24-320h-80V68a4 4 0 0 1 4-4h72a4 4 0 0 1 4 4Zm40 320h-33l9-256h33Z"></path>
                    </svg>
                  </div>
                </>)
              }

                  
              
            </div>
          </>)
        })
      }
      </div>
      <Popup
        open={popupOpen}
        onClose={closePopup}
        modal
        closeOnDocumentClick={true}
        contentStyle={{
          padding: 30,
          borderRadius: 20,
          maxWidth: "fit-content",
        }}
        position="center center"
      >
        {
          (<div className='flex flex-col gap-4 w-full justify-center items-center'>
            
            <div className='flex flex-row justify-between w-full'>
            <div className='text-[#273469]'>Add nomination</div>
            <div className=' self-end cursor-pointer' onClick={closePopup}>
              <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><path fill="#949494" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"></path></svg>
            </div>
            </div>
            
            <div className='flex flex-row gap-2'>
             
              <input className='px-4 py-2 ' type='text ' placeholder='nomination here!' value={nomination.nomination} onChange={(e) => setNomination({ ...nomination, nomination: e.target.value })}></input>
              <button className='px-4 py-2 rounded bg-[#512888] hover:bg-[#4B0082] text-white' onClick={onSubmit}>Add</button>
            </div>

          </div>)
        }

      </Popup>

      {poll && poll.nominations?.length == 0 && <div className='cursor-pointer self-center flex justify-center' onClick={openPopup}><svg xmlns="http://www.w3.org/2000/svg" width={256} height={256} viewBox="0 0 32 32"><path fill="#999999" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"></path></svg></div>}


    </div>}
  </>)
}

export default Nomination