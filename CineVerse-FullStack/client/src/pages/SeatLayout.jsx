import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  assets,
  dummyDateTimeData,
  dummyShowsData
} from '../assets/assets'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"]
  ]

  const { id, date } = useParams()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)

  // Dummy booked seats
  const [occupiedSeats, setOccupiedSeats] = useState([
    "A1",
    "A2",
    "A3",
    "D1",
    "D2"
  ])

  const navigate = useNavigate()


  // =========================
  // GET SHOW - DUMMY DATA
  // =========================

  const getShow = () => {

    const movie = dummyShowsData.find(
      show => show._id === id
    )

    if (movie) {
      setShow({
        movie: movie,
        dateTime: dummyDateTimeData
      })
    }
  }


  // =========================
  // SEAT CLICK
  // =========================

  const handleSeatClick = (seatId) => {

    // Time select nahi kiya
    if (!selectedTime) {
      return toast.error("Please select time first")
    }

    // Already booked
    if (occupiedSeats.includes(seatId)) {
      return toast.error("This seat is already booked")
    }

    // Maximum 5 seats
    if (
      !selectedSeats.includes(seatId) &&
      selectedSeats.length >= 5
    ) {
      return toast.error("You can only select 5 seats")
    }

    // Select / Unselect
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    )
  }


  // =========================
  // RENDER SEATS
  // =========================

  const renderSeats = (row, count = 9) => (

    <div
      key={row}
      className="flex gap-2 mt-2"
    >

      <div className="flex flex-wrap items-center justify-center gap-2">

        {Array.from(
          { length: count },
          (_, i) => {

            const seatId = `${row}${i + 1}`

            const isSelected =
              selectedSeats.includes(seatId)

            const isOccupied =
              occupiedSeats.includes(seatId)

            return (

              <button
                key={seatId}
                onClick={() =>
                  handleSeatClick(seatId)
                }
                disabled={isOccupied}
                className={`
                  h-8
                  w-8
                  rounded
                  border
                  border-primary/60
                  text-xs
                  cursor-pointer
                  transition
                  
                  ${
                    isSelected
                      ? "bg-primary text-white"
                      : ""
                  }

                  ${
                    isOccupied
                      ? "bg-gray-600/50 opacity-50 cursor-not-allowed"
                      : "hover:bg-primary/30"
                  }
                `}
              >

                {seatId}

              </button>

            )
          }
        )}

      </div>

    </div>
  )


  // =========================
  // DUMMY BOOKING
  // =========================

  // const bookTickets = () => {

  //   if (!selectedTime) {
  //     return toast.error(
  //       "Please select a time"
  //     )
  //   }

  //   if (selectedSeats.length === 0) {
  //     return toast.error(
  //       "Please select at least one seat"
  //     )
  //   }

  //   console.log(
  //     "Selected Time:",
  //     selectedTime
  //   )

  //   console.log(
  //     "Selected Seats:",
  //     selectedSeats
  //   )

  //   toast.success(
  //     "Seats selected successfully!"
  //   )
  // }
 const bookTickets = () => {
  if (!selectedTime) {
    return toast.error("Please select a time");
  }

  if (selectedSeats.length === 0) {
    return toast.error("Please select at least one seat");
  }

  // Selected booking ko temporarily save karo
  const booking = {
    show: {
      movie: show.movie,
      showDateTime: selectedTime.time,
    },
    amount: selectedSeats.length * 200,
    bookedSeats: selectedSeats,
    isPaid: true,
  };

  // Existing dummy bookings + new booking
  const existingBookings =
    JSON.parse(localStorage.getItem("cineverseBookings")) || [];

  localStorage.setItem(
    "cineverseBookings",
    JSON.stringify([
      booking,
      ...existingBookings
    ])
  );

  toast.success("Booking confirmed!");

  navigate("/my-bookings");
};


  // =========================
  // GET SHOW ON PAGE LOAD
  // =========================

  useEffect(() => {
    getShow()
  }, [id])


  // =========================
  // PAGE
  // =========================

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }


  return (

    <div className="relative min-h-screen pt-30 pb-20">

      {/* Background */}

      <BlurCircle
        top="100px"
        left="0px"
      />

      <BlurCircle
        bottom="100px"
        right="0px"
      />


      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* =========================
            MOVIE INFORMATION
        ========================= */}

        <div className="flex flex-col md:flex-row gap-6 mb-10">

          <img
            src={
              show.movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.movie.poster_path}`
                : assets.fallbackMovie
            }
            alt={show.movie.title}
            className="w-40 md:w-48 rounded-lg object-cover"
          />

          <div className="flex flex-col justify-center">

            <h1 className="text-3xl font-semibold">
              {show.movie.title}
            </h1>

            <p className="text-gray-400 mt-2">
              {show.movie.overview}
            </p>

            <p className="text-gray-400 mt-3">
              Select your preferred show time
            </p>

          </div>

        </div>


        {/* =========================
            DATE / TIME
        ========================= */}

        <div className="mb-10">

          <h2 className="text-xl font-semibold mb-5">
            Select Show Time
          </h2>


          <div className="flex flex-wrap gap-3">

            {show.dateTime?.[date]?.map(
              (item) => {

                const isSelected =
                  selectedTime?.showId === item.showId

                return (

                  <button
                    key={item.showId}
                    onClick={() =>
                      setSelectedTime(item)
                    }
                    className={`
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-full
                      border
                      transition

                      ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "border-gray-600 hover:border-primary"
                      }
                    `}
                  >

                    <ClockIcon
                      className="w-4 h-4"
                    />

                    {isoTimeFormat(item.time)}

                  </button>

                )
              }
            )}

          </div>

        </div>


        {/* =========================
            SEAT LAYOUT
        ========================= */}

        <div className="mb-10">

          <h2 className="text-xl font-semibold mb-6">
            Select Your Seats
          </h2>


          {/* Screen */}

          <div className="flex flex-col items-center mb-12">

            <div className="w-full max-w-2xl">

              <div className="h-1 bg-primary rounded-full mb-2" />

              <p className="text-center text-gray-400 text-sm">
                SCREEN
              </p>

            </div>

          </div>


          {/* Seats */}

          <div className="flex flex-col items-center gap-2">

            {groupRows.map(
              ([left, right]) => (

                <div
                  key={left}
                  className="flex items-center gap-8"
                >

                  {/* Left side */}

                  <div className="flex gap-2">

                    {Array.from(
                      { length: 9 },
                      (_, i) => {

                        const seatId =
                          `${left}${i + 1}`

                        const isSelected =
                          selectedSeats.includes(
                            seatId
                          )

                        const isOccupied =
                          occupiedSeats.includes(
                            seatId
                          )

                        return (

                          <button
                            key={seatId}
                            disabled={isOccupied}
                            onClick={() =>
                              handleSeatClick(
                                seatId
                              )
                            }
                            className={`
                              h-8
                              w-8
                              rounded
                              border
                              border-primary/60
                              text-xs
                              transition

                              ${
                                isSelected
                                  ? "bg-primary text-white"
                                  : ""
                              }

                              ${
                                isOccupied
                                  ? "bg-gray-600/50 opacity-50 cursor-not-allowed"
                                  : "hover:bg-primary/30 cursor-pointer"
                              }
                            `}
                          >
                            {seatId}
                          </button>

                        )
                      }
                    )}

                  </div>


                  {/* Gap */}

                  <div className="w-6" />


                  {/* Right side */}

                  <div className="flex gap-2">

                    {Array.from(
                      { length: 9 },
                      (_, i) => {

                        const seatId =
                          `${right}${i + 1}`

                        const isSelected =
                          selectedSeats.includes(
                            seatId
                          )

                        const isOccupied =
                          occupiedSeats.includes(
                            seatId
                          )

                        return (

                          <button
                            key={seatId}
                            disabled={isOccupied}
                            onClick={() =>
                              handleSeatClick(
                                seatId
                              )
                            }
                            className={`
                              h-8
                              w-8
                              rounded
                              border
                              border-primary/60
                              text-xs
                              transition

                              ${
                                isSelected
                                  ? "bg-primary text-white"
                                  : ""
                              }

                              ${
                                isOccupied
                                  ? "bg-gray-600/50 opacity-50 cursor-not-allowed"
                                  : "hover:bg-primary/30 cursor-pointer"
                              }
                            `}
                          >
                            {seatId}
                          </button>

                        )
                      }
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>


        {/* =========================
            SEAT LEGEND
        ========================= */}

        <div className="flex justify-center gap-8 mb-10 text-sm">

          <div className="flex items-center gap-2">

            <div className="w-5 h-5 rounded border border-primary/60" />

            <span>
              Available
            </span>

          </div>


          <div className="flex items-center gap-2">

            <div className="w-5 h-5 rounded bg-primary" />

            <span>
              Selected
            </span>

          </div>


          <div className="flex items-center gap-2">

            <div className="w-5 h-5 rounded bg-gray-600/50" />

            <span>
              Booked
            </span>

          </div>

        </div>


        {/* =========================
            SELECTED SEATS
        ========================= */}

        {selectedSeats.length > 0 && (

          <div className="flex flex-col items-center">

            <p className="text-gray-400 mb-3">

              Selected Seats:

              <span className="text-white ml-2">
                {selectedSeats.join(", ")}
              </span>

            </p>


            <button
              onClick={bookTickets}
              className="
                flex
                items-center
                gap-2
                px-6
                py-3
                bg-primary
                rounded-full
                hover:opacity-90
                transition
              "
            >

              Continue

              <ArrowRightIcon
                className="w-5 h-5"
              />

            </button>

          </div>

        )}

      </div>

    </div>

  )
}

export default SeatLayout


// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
// import Loading from '../components/Loading'
// import { ArrowRightIcon, ClockIcon } from 'lucide-react'
// import isoTimeFormat from '../lib/isoTimeFormat'
// import BlurCircle from '../components/BlurCircle'
// import toast from 'react-hot-toast'
// import { useAppContext } from '../context/AppContext'

// const SeatLayout = () => {

//   const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

//   const {id, date } = useParams()
//   const [selectedSeats, setSelectedSeats] = useState([])
//   const [selectedTime, setSelectedTime] = useState(null)
//   const [show, setShow] = useState(null)
//   const [occupiedSeats, setOccupiedSeats] = useState([])

//   const navigate = useNavigate()

//   const {axios, getToken, user} = useAppContext();

  
//  const getShow = async () =>{
//   const show = dummyShowsData.find(show => show._id === id)
//   if(show){
//     setShow({
//       movie: show,
//       dateTime: dummyDateTimeData
//     })
//   }
// }
//   const handleSeatClick = (seatId) =>{
//       if (!selectedTime) {
//         return toast("Please select time first")
//       }
//       if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
//         return toast("You can only select 5 seats")
//       }
//       if(occupiedSeats.includes(seatId)){
//         return toast('This seat is already booked')
//       }
//       setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
//   }

//   const renderSeats = (row, count = 9)=>(
//     <div key={row} className="flex gap-2 mt-2">
//             <div className="flex flex-wrap items-center justify-center gap-2">
//                 {Array.from({ length: count }, (_, i) => {
//                     const seatId = `${row}${i + 1}`;
//                     return (
//                         <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
//                          ${selectedSeats.includes(seatId) && "bg-primary text-white"} 
//                          ${occupiedSeats.includes(seatId) && "opacity-50"}`}>
//                             {seatId}
//                         </button>
//                     );
//                 })}
//             </div>
//         </div>
//   )

//   const getOccupiedSeats = () => {
//   const bookings = dummyBookingData.filter(
//     booking => booking.show._id === selectedTime.showId
//   )

//   const seats = bookings.flatMap(booking => booking.bookedSeats)

//   setOccupiedSeats([...new Set(seats)])
// }

//   const bookTickets = async () => {
//   try {
//     console.log("1. Button clicked");
//     console.log("user:", user);
//     console.log("selectedTime:", selectedTime);
//     console.log("selectedSeats:", selectedSeats);

//     if (!user) {
//       console.log("2. User not logged in");
//       return toast.error('Please login to proceed');
//     }

//     if (!selectedTime || !selectedSeats.length) {
//       console.log("3. Time or seats missing");
//       return toast.error('Please select a time and seats');
//     }

//     console.log("4. Calling booking API...");

//     const token = await getToken();
//     console.log("Token received:", !!token);

//     const { data } = await axios.post(
//       '/api/booking/create',
//       {
//         showId: selectedTime.showId,
//         selectedSeats
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     console.log("5. API response:", data);

//     if (data.success) {
//       console.log("6. Redirecting to:", data.url);
//       window.location.href = data.url;
//     } else {
//       toast.error(data.message);
//     }

//   } catch (error) {
//     console.error("BOOKING ERROR:", error);
//     console.error("Response:", error.response?.data);
//     toast.error(error.response?.data?.message || error.message);
//   }
// };
//   useEffect(()=>{
//     getShow()
//   },[])

//   useEffect(()=>{
//     if(selectedTime){
//       getOccupiedSeats()
//     }
//   },[selectedTime])

//   return show ? (
//     <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
//       {/* Available Timings */}
//       <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
//         <p className='text-lg font-semibold px-6'>Available Timings</p>
//         <div className='mt-5 space-y-1'>
//           {show.dateTime[date].map((item)=>(
//             <div key={item.time} onClick={()=> setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
//               <ClockIcon className="w-4 h-4"/>
//               <p className='text-sm'>{isoTimeFormat(item.time)}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Seats Layout */}
//       <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
//           <BlurCircle top="-100px" left="-100px"/>
//           <BlurCircle bottom="0" right="0"/>
//           <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
//           <img src={assets.screenImage} alt="screen" />
//           <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

//           <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
//               <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
//                 {groupRows[0].map(row => renderSeats(row))}
//               </div>

//                <div className='grid grid-cols-2 gap-11'>
//                 {groupRows.slice(1).map((group, idx)=>(
//                   <div key={idx}>
//                     {group.map(row => renderSeats(row))}
//                   </div>
//                 ))}
//               </div>
//           </div>

//           <button onClick={bookTickets} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
//             Proceed to Checkout
//             <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>
//           </button>

         
//       </div>
//     </div>
//   ) : (
//     <Loading />
//   )
// }

// export default SeatLayout
