import React, { useContext, useEffect, useState } from "react"
import { socket } from "../context/socketContext";
import { authContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);

const Voting = () => {
    const navigate = useNavigate();
    const { poll, user, setPoll, active } = useContext(authContext);
    const [votes, setVotes] = useState([]);
    console.log(poll)
    const [vote, setVote] = useState()
    const [weights, setWeights] = useState([])

    const getResults = () => {
        let nominations = {};
        for (let i = 0; i < poll.nominations.length; i++) {
            for (let j = 0; j < poll.votesPerVoter; j++) {
                console.log(j);
                nominations = {
                    ...nominations,
                    [poll.nominations[i].nominationId]: { ...nominations[poll.nominations[i].nominationId], [j]: 0 }
                }
            }
        }
        console.log(nominations);

        console.log(poll.votes)
        for (let i = 0; i < poll.votes.length; i++) {
            for (let j = 0; j < poll.votesPerVoter; j++) {
                console.log(nominations[poll.votes[i].votes[j]])
                nominations[poll.votes[i].votes[j]][j] = nominations[poll.votes[i].votes[j]][j] + 1;
                console.log(nominations)
            }
        }


        for (let i = 0; i < poll.votesPerVoter; i++) {
            Object.keys(nominations).forEach(key => {
                console.log(key)
                console.log(nominations[key][i])
                //first each key for 0, each key for 1 . so on....
            });

        }
        //alternate way
        // let arr = Array.from(Array(poll.votesPerVoter), () => new Array(poll.votes.length))
        // for (let i = 0; i < poll.votesPerVoter; i++) {
        //     for (let j = 0; j < poll.votes.length; j++) {
        //         arr[i][j] = poll.votes[j].votes[i]
        //     }
        // }
        // console.log(arr);


        // for (let i = 0; i < arr.length; i++) {
        //     for (let j = 0; j < arr[i].length; j++) {
        //         console.log(j)
        //         console.log(nominations[arr[i][j]]);
        //         console.log(nominations[arr[i][j]][i]);
        //         nominations[arr[i][j]][i] = nominations[arr[i][j]][i] + 1;
        //         console.log(nominations)
        //     }
        // }
        console.log(nominations);


        let wts = [];

        for (let j = 0; j < poll.nominations.length; j++) {
            console.log(poll.nominations.length)
            const total = poll.votesPerVoter * poll.votes.length;
            let wtSum = 0
            for (let i = poll.votesPerVoter; i > 0; i--) {
                console.log(nominations[poll.nominations[j].nominationId])
                console.log(poll.votesPerVoter-i)
                wtSum += nominations[poll.nominations[j].nominationId][ poll.votesPerVoter-i] * i
                console.log(wtSum)
            }
            console.log(Math.round(wtSum / total * 100)/100)
            console.log("jiii")
            wts = [
                ...wts,
                {
                    'nominationId': poll.nominations[j].nominationId,
                    'nomination': poll.nominations[j].nomination,
                    'avg': Math.round(wtSum / total * 100)/100
                }

            ]
        }
        console.log(wts)
        wts.sort((a, b) => a.avg > b.avg ? -1 : b.avg > a.avg ? 1 : 0);
        console.log(wts)
        setVote(nominations);
        setWeights(wts);
    }



    useEffect(() => {
        if (poll?.votingEnded) {
            getResults()
        }
    }, [poll])


    useEffect(() => {
        if (poll && poll.votingStarted && !poll.votingEnded && poll.users.length == poll.votes.length) {
            socket.emit('end', { votingEnded: true })
        }
    }, [poll])


    const addVotes = (vote) => {
        if (votes.length < poll.votesPerVoter) {
            setVotes([...votes, vote]);
            console.log(votes)
        }
    }


    const removeVotes = (id) => {
        const newVotes = votes.filter((i) => {
            return i != id;
        })

        setVotes(newVotes);
    }


    const onSubmitVoting = () => {
        console.log({ votes, user })
        socket.emit('newVote', { votes, user })
    }
    console.log(poll)


    const onStartVoting = () => {

        if (poll.nominations.length < poll.votesPerVoter) {
            toast.error("Nominations are less than votes per voter!!!")
        }
        else if(poll.users.length<2){
            toast.error("There are no otehr users!!!")
        }
        else{
            socket.emit('start', poll.pollId);
        }
    }

    socket.on('started', (poll) => {
        if (poll) {
            console.log(poll)
            setPoll(poll);
        }
        navigate('/home/voting');
    })

    socket.on("addedVote", (data) => {
        console.log(data);
        //  setPoll(data);

    })

    socket.on("newVote", (data) => {
        console.log(data);
        setPoll(data);

    })

    const endPoll = () => {
        socket.emit('end', { votingEnded: true })
    }

    socket.on("ended", (data) => {
        console.log(data);
        setPoll(data);
        getResults();
    });
    console.log([...weights.map((i) => i.nomination)])

    const [chart, setChart] = useState({})
    useEffect(() => {
        if(poll && weights && weights.length>0){
            setChart(
                {
                    labels: [...weights?.map((i) => i.nomination)],
                    datasets: [
                        {
                            label: poll?.topic,
                            backgroundColor: '#70587C',
                            borderColor: '##7C3AED',
                            borderWidth: 0,
                            data: [...weights?.map((i) => i.avg)],
                        },
                    ],
                }
            )
        }
        else{
            setChart(
                {
                    labels: [...weights?.map((i) => i.nomination)],
                    datasets: [
                        {
                            label: poll?.topic,
                            backgroundColor: '#70587C',
                            borderColor: '##7C3AED',
                            borderWidth: 0,
                            data: [...weights?.map((i) => i.avg)],
                        },
                    ],
                }
            )
        }
    }, [weights])


    return (<>
       {poll && (<>
        <div className="w-full h-full flex-col justify-center items-center  mb-2  mt-12">
            {
                !poll.votingStarted && user.userId == poll.admin && !poll.votingEnded && <div className="  flex justify-center items-center  w-full h-full " >
                    <button className="bg-[#512888]   hover:bg-[#4B0082] rounded w-fit p-4 text-white" onClick={onStartVoting}>
                        Start poll
                    </button>
                </div>
            }
            {
                !poll.votingStarted && !poll.votingEnded && user.userId != poll.admin && <div className=" flex justify-center items-center  w-full h-full  " >
                    <p>You can vote here once voting is started.!!</p>
                </div>
            }
            {
                poll?.votingStarted && !poll.votingEnded && (!poll.votes || !poll.votes.find((i) => i.user == user.userId)) && (<>
                    <div className='flex flex-col gap-4 w-full p-8 self-start'>
                        <div>{votes.length} of {poll.votesPerVoter} votes</div>
                        {
                            poll && poll?.nominations?.length > 0 && poll.nominations.map((item, idx) => {
                                return (<>
                                    <div className='flex flex-row justify-between w-full bg-gray-200 items-center'>

                                        <div className='p-4 rounded cursor-pointer w-full ' key={idx}>{item?.nomination}</div>
                                        {
                                            votes.includes(item.nominationId) ? (<div className="px-4 cursor-pointer bg-violet-500 rounded-full text-white hover:bg-violet-600" onClick={() => removeVotes(item.nominationId)}>{votes.findIndex((i) => i == item.nominationId) + 1}</div>) : (<> <div className="cursor-pointer px-4" onClick={() => addVotes(item.nominationId)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 48 48">
                                                    <path fill="none" stroke="#603ae9" stroke-linecap="round" stroke-linejoin="round" d="M11.89 31.343H8.409L4.5 37.774h38.142l-3.909-6.431h-1.538" />
                                                    <path fill="none" stroke="#603ae9" stroke-linecap="round" stroke-linejoin="round" d="m28.091 20.141l-11.833-3.512l-5.474 18.441h25.305l3.425-11.538l-7.866-2.335" />
                                                    <path fill="none" stroke="#603ae9" stroke-linecap="round" stroke-linejoin="round" d="M32.522 15.213c-.749 1.498-3.69 3.983-3.946 4.366s-2.41 2.265-.968 3.471s3.709-1.699 4.44-2.192s4.31-1.461 5.078-2.1s1.826-1.316 2.1-1.992l-1.498-4.75s-6.448-.11-7.307 0s-4.463 4.934-3.927 6.375c.64 1.718 2.856.407 2.856.407" />
                                                    <path fill="none" stroke="#603ae9" stroke-linecap="round" stroke-linejoin="round" d="m37.728 12.017l3.38-1.791l2.392 6.403l-4.274.137" />
                                                </svg>
                                            </div></>)
                                        }
                                    </div>

                                </>)
                            })
                        }
                        {
                            poll && poll?.nominations?.length > 0 && (<button className={`bg-[#9E7BB5] hover:bg-[#9966CC] px-4 py-2 rounded w-fit text-white flex ${votes.length < poll.votesPerVoter &&
                                "bg-gray-400"}`} disabled={votes.length < poll.votesPerVoter} onClick={onSubmitVoting}>
                                Submit
                            </button>)
                        }
                    </div>
                </>)
            }
            {
                poll.votingStarted && !poll.votingEnded && (poll.votes && poll.votes.find((i) => i.user == user.userId)) && (<>
                    <div className='flex flex-col gap-4 w-full p-8 self-start'>
                        <div>Your votes:</div>
                        {
                            poll && poll?.votes?.length > 0 && poll.votes.find((i) => i.user == user.userId) && poll.votes.find((i) => i.user == user.userId).votes.map((item, idx) => {
                                return (<>
                                    <div className='flex flex-row justify-between w-full bg-gray-200 items-center'>

                                        <div className='p-4 rounded cursor-pointer w-full ' key={idx}>{poll?.nominations.find((i) => i.nominationId == item).nomination}  </div>
                                        <div className="px-4  bg-violet-500 rounded-full text-white " >{idx + 1}</div>
                                    </div>

                                </>)
                            })
                        }

                    </div>
                </>)
            }

            {
                poll && poll.votingStarted && !poll.votingEnded && poll.admin == user.userId && (<>

                    <div className="flex w-full flex-col justify-center items-center">
                        <div className="flex flex-row items-center gap-2">
                            {poll.votes.length}
                            of {poll.users?.length} users have voted.   <div className="cursor-pointer" > <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                                <path fill="#5837fb" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
                            </svg> </div>
                        </div>
                        <div className=" bg-[#512888] hover:bg-[#4B0082] cursor-pointer rounded px-4 py-2 text-white w-fit " onClick={endPoll}>End poll</div>

                    </div>
                </>)
            }

            {
               poll && poll.votingEnded && vote && (<div className="flex flex-col  w-full  p-4 gap-4 ">
                   

                    {/* {

                        [0, 1, 2].
                            map((item, index) => {
                                return (<><div>
                                    {index + 1}
                                </div>
                                    {poll.nominations.map((item2, index2) => {
                                        return (<>
                                            <div className="flex flex-row gap-2 bg-gray-200  px-4 py-2 justify-between items-center">

                                                <div className="bg-gray-200  ">
                                                    {item2.nomination}
                                                </div>
                                                <div className="bg-violet-500 text-white px-4 py-2 rounded">
                                                    {
                                                        vote[item2.nominationId][index]}
                                                </div>
                                            </div></>)
                                    })}

                                </>)
                            })
                    } */}

                  <div  className="w-full min-w-[400px] flex justify-center">  {poll && weights && <Bar className="w-full "
                        data={chart}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Results"
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                  beginAtZero: true,
                                  border: { dash: [6, 6], display: true },
                                  grid: {
                                    display: true // Display grid lines for the y-axis
                                  },
                                  ticks: {
                                    padding: 15
                                  }
                                },
                                x: {
                                  beginAtZero: true,
                                  border: { display: true },
                                  grid: {
                                    display: false // No display of grid lines for the x-axis
                                  },
                                  ticks: {
                                    padding: 7
                                  }
                                }
                              },
                              indexAxis:"y"
                        }}
                    />}
</div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-md  ">
                        <thead className="w-full text-xs text-gray-900 uppercase bg-[#C8B8DB]  "
                        ><tr className="">
                                <th scope="col" className="px-6 py-3" >Nominations</th>
                                {[...Array(poll.votesPerVoter)].map((i, idx) => (<th scope="col" className="px-6 py-3">{idx + 1}</th>))}
                                <th scope="col" className="px-6 py-3" >Score</th>
                            </tr></thead>

                        <tbody>
                            {
                                poll.nominations.
                                    map((item, index) => {
                                        return (<>

                                            <tr className="bg-white border border-1 border-gray-300 border-t text-gray-900 ">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                    {item.nomination}
                                                </th>
                                                {/* <td className="px-4 py-2">{item.nomination}</td> */}
                                                {[...Array(poll.votesPerVoter)].map((item2, index2) => {
                                                    return (<>
                                                        <td> {
                                                            vote[item.nominationId][index2]}</td>
                                                    </>)
                                                })}
                                                <td>
                                                    {
                                                        weights.find((i) => i.nominationId == item.nominationId)?.avg
                                                    }
                                                </td>

                                            </tr>

                                        </>)
                                    })
                            }
                        </tbody>
                    </table>
                </div>)
            }

        </div>
       </>)}


    </>)
}

export default Voting