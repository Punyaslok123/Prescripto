import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext= createContext()

const DoctorContextProvider = (props) => {
  // take the backend url which help to make the api call

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // state variable to store the doctor authentication token

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );

  // state varibale to store all appointments of a doctor

  const [appointments, setAppointments] = useState([]);

  // state variable to store the dashboard data

  const [dashData,setDashData] = useState(false)

  // state variable to store the doctor profile data 

  const [profileData,setProfileData] = useState(false)







  // function to call the backend api for all appointments of a doctor

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // function to mark the appointments completed (backend api call)

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // function to mark the appointments canceled (backend api call)

   const cancelAppointment = async (appointmentId) => {
     try {
       const { data } = await axios.post(
         backendUrl + "/api/doctor/cancel-appointment",
         { appointmentId },
         { headers: { dToken } }
       );

       if (data.success) {
         toast.success(data.message);
         getAppointments();
       } else {
         toast.error(data.message);
       }
     } catch (error) {
       console.log(error);
       toast.error(error.message);
     }
   };

   // function to call the backend api for dashboard data 

   const getDashData = async () => {
         try{
              const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dToken}})

              if(data.success) {
                   setDashData(data.dashData)

                   console.log(data.dashData)
              }else {
                  toast.error(data.message)
              }
         }catch(error){
             console.log(error);
             toast.error(error.message);
         }
   }

   // function to call the backend api to get the doctor profile data 

   const getProfileData = async ()=> {
         try{
               const {data} = await axios.get(backendUrl+'/api/doctor/profile',{headers:{dToken}})


               if(data.success) {
                    setProfileData(data.profileData)
                    console.log(data.profileData)
               }else {
                        toast.error(data.message);
               }

         }catch(error) {
              console.log(error);
              toast.error(error.message);
         }
   }
 




  const value = {
    dToken,
    setDToken,
    backendUrl,
    getAppointments,
    setAppointments,
    appointments,
    completeAppointment,cancelAppointment,
    dashData,setDashData,getDashData,
    profileData,setProfileData,getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
}

export default DoctorContextProvider