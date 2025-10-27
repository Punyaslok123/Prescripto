import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  // take the doctor id from the url

  const { docId } = useParams();

  const navigate=useNavigate();

  // take all the doctors

  const { doctors, currencySymbol,backendUrl,token,getDoctorsData } = useContext(AppContext);

  //   using this array we will display the dates with name 

  const daysOfWeek=["SUN","MON","TUE","WED","THU","FRI","SAT"];

  // for booking slots--

  // docSlots is array of array - contain all the time slots for the next 7 days

  const [docSlots, setDocSlots] = useState([]);

  // slot Index means which day user selected

  const [slotIndex, setSlotIndex] = useState(0);

  // which specific time the user selected
  const [slotTime, setSlotTime] = useState("");
  //---- 

  // create state variable which holds the doctor information

  const [docInfo, setDocInfo] = useState(null);

  // find the doctor which has docId

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);

    console.log(docInfo);
  };

  // logic to calculate the available booking slots of a particular doctor for the next 7 days 

  const getAvailableSlots = async () => {
    // clear previous slots

    setDocSlots([]);

    // get current date

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index

      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // settin end time (day + hours) of the day with index

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours

      // for the today available times
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );

        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // not todays , so slot time start from 10am to 9 mp - everyb slots
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      // store all the available slots for that day

      let timeSlots = [];

      while (currentDate < endTime) {
        // create slotin every 30 minitue intervel

        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // only add those slots which are not booked 

        let day=currentDate.getDate();

        let month=currentDate.getMonth()+1;

        let year=currentDate.getFullYear();


        const slotDate= day + "_"+month+"_"+year;

        const slotTime= formattedTime

        const isSlotAvailable=docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)? false:true

        // add slot to array if its available 

       if(isSlotAvailable) {
              

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
       }

        // inc current time by 30 miniute,for the next slot

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // setDocSlots(timeSlots) => if we do it then it will be overwriten in every time , [...prev, timeSlots] → makes a new array that keeps everything already in docSlots and adds timeSlots at the end

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  // logic to bookappointments

  const bookAppointment = async () => {
      
        //  check if user is logg in or not 

        if(!token) {
            toast.warn('Login to book apointment')

            return navigate('/login');

            
        }

        try {
          // take the date of the booking
          const date = docSlots[slotIndex][0].datetime;

          // take month,day,year from the date

          let day = date.getDate();

          let month = date.getMonth() + 1;

          let year = date.getFullYear();

          const slotDate = day + "_" + month + "_" + year;

          console.log(slotDate);

          // api call to book the appointment

          const {data} = await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})

          if(data.success) {

            
              
            toast.success(data.message)

            getDoctorsData()

            navigate('/my-appointments')
          }

          else {
              console.log("inside the toast")
              toast.error(data.message)
          }


        } catch (error) {

          console.log("inside the error ")
              
          console.log(error)
          toast.error(error.message)
         
        }
  }

  // doctors or doctoId if change then we will render this component again

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  // if docinfo change then timeslot change

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  // if docInfo is present in that case we will display the doctor image , otherwise in the first rendering docInfo is null so error comes null.image ??

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* DocInfo like name , degree,experience  */}

            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900 ">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>

            <div>
              <p className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                {docInfo.degree}-{docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* Doctor About */}

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment Fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* display available booking slots for the next 7 days   */}

        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
              <p>Booking slots</p>
              <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                {
                    docSlots.length && docSlots.map((item,index)=>(

                      // if we click this button then we will change this index
                       <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary text-white': 'border border-gray-200' }`} key={index}>
                             <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                             <p>{item[0] && item[0].datetime.getDate()}</p>
                       </div>
                    ))
                }
              </div>

              {/* display the slot times */}

              <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                 {
                  docSlots.length && docSlots[slotIndex].map((item,index)=>(
                      <p onClick={()=> setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'bg-primary text-white': 'text-gray-400 border border-gray-300'}`} key={index}>
                             {item.time.toLowerCase()}
                      </p>
                  ))
                 }
              </div>

              {/* button tag */}

              <button 
              onClick={bookAppointment}
              className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-6'>Book an appointment </button>


        </div>

        {/* listing related Doctors */}
        
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>

      </div>
    )
  );
}

export default Appointment
