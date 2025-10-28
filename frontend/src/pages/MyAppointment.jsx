import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'
const MyAppointment = () => {

    const navigate=useNavigate();

    const {doctors,backendUrl,token,getDoctorsData}=useContext(AppContext)

    const [appointments,setAppointments] = useState([])

    // formating function for the date 

    const months=["","Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"]

    const slotDateFormat = (slotDate) => {
        //  we get like this slotDate = 30_10_2025

        const dateArray=slotDate.split('_');

        return dateArray[0] + " " + months[dateArray[1]] + " " + dateArray[2];
    }

    // function to get the appointments for user 

    

    const getUserAppointments = async () => {
        
      try{

        // call the backend api 

        
         const {data} = await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})

         if(data.success) {
               // store the appointments data in the appointment state 
               // reverse so that new appointments will be added to the top 
               setAppointments(data.appointments.reverse())

               console.log(data.appointments)
         }
      } catch(error) {
              console.log(error);
              toast.error(error.message)

      }
    }

    // run this function if token is change 

    useEffect(()=>{
        if(token)  {
            getUserAppointments()
        }
    },[token])


    // function for the cancel appointment 
     
    const cancelAppointment = async(appointmentId) =>{
            try{

              // first need to appointment id , in cancel Appointment button we use onClick and pass this id 

              console.log(appointmentId)
                
              // call the backend api 

              const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})


              if(data.success) {
                    
                toast.success(data.message)

                getUserAppointments()
                // call the getDoctorsData so that dont need to refresh the page to see the change in appointment page slots 

                getDoctorsData();
              }else {
                   
                toast.error(data.message)
              }


            }catch(error) {
                    console.log(error);
                    toast.error(error.message);

            }
    }

    // razorpay payment 

    const initPay= (order) =>{

      console.log("razorpay id is", import.meta.env.VITE_RAZORPAY_KEY_ID);
         
      // we will create the options using the order
      
      // razorpay key id  variable also create in the frontend env file 

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:order.amount,
        currency:order.currency,
        name:'Appointment Payment',
        description:'Appointment Payment',
        order_id:order.id,
        receipt: order.receipt,
        handler:async (response) =>{
             console.log(response)

             try{
               // call the backend verify api

               const { data } = await axios.post(
                 backendUrl + "/api/user/verifyRazorpay",
                 response,
                 { headers: { token } }
               );

               console.log(data)

               if (data.success) {
                 getUserAppointments();

                 // navigate the user to the my appointment page

                 navigate("/my-appointments");
               }
             }catch(error){
                  console.log(error)
                  toast.error(error.message)
             }
        }
      };

      // in above handler after the razorpay payment we will get the response which consist razorpay_order_id,payment_id,signature(using this we will verify the payment in backend and we will mark the payment true)

      // initialize the payment 
     
      const rzp=new window.Razorpay(options)

      rzp.open();

      // 


    }

    // function for the razorpay payment using backend api 



    const appointmentRazorpay = async (appointmentId) =>{
          try{
               // backend api call 
               
               const {data}=await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}})


               if(data.success){

                  console.log(data.order);

                  // using this order we will initialize the razorpay payment (first need to razorpay integration steps script link in the index.html after root div , to get the script search  razorpay web integration step broswer )
                  
                  initPay(data.order)

               }

          }catch{

          }
    }

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>

            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-nutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address: </p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time{" "}
                </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div></div>

            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                  Paid
                </button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}

              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}
              {
                item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointment
