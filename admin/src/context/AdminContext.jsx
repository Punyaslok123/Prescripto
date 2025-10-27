import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext= createContext()



const AdminContextProvider = (props) => {

  const [dashData,setDashData] = useState(false)

  // to store all the appointments 

  const [appointments,setAppointments] = useState([])
  // const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"");
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );   // means if you are already logged in then it will not show the login page again (token is store in the localstorage )

  // state variable to store the doctors in some state variables

  const [doctors,setDoctors] = useState([])



  const backendUrl = import.meta.env.VITE_BACKEND_URL;

    console.log("AdminContext backendUrl =", backendUrl);
  
    // get all the doctors 

    const getAllDoctors= async () => {
          
      try{
            
        // the api is written in the backend , so we will use the url to call it 

        const {data}= await axios.post(backendUrl + '/api/admin/all-doctors',{},{headers:{aToken}});

        console.log("go lang ",aToken)

        if(data.success) {
            // api call is successful 

            

            setDoctors(data.doctors);
            console.log(data.doctors)
        }
        else {
             console.log("not success ")
             toast.error(data.message)
        }
      } catch(error) {
           console.log("oops its error ")
           toast.error(error.message)
      }
    }

    const changeAvailablity= async (docId) => {
           try{

            // call the changeAvailablity api controller (backend )

            
              
            const {data} = await axios.post(backendUrl+ '/api/admin/change-availablity',{docId},{headers:{aToken}})

            if(data.success){
                toast.success(data.message)
                // update the doctors 

                getAllDoctors();
            } else {
                toast.error(data.message)
            }

           } catch(error){
               toast.error(error.message)
           }
    }


    

  // now create one environment variable(backend url ) in

  // api call to get all the appointments 

  const getAllAppointments = async() => {
       
    try{
            
      const {data} = await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}}) 

      // to store the appointsments data create one state variable 

      if(data.success){
          setAppointments(data.appointments)
          console.log(data.appointments)
      }
      else {
          toast.error(data.message)
      }
      



    }catch(error) {
          toast.error(error.message)
    }
  }

  // function to call the cancel appointment backend api 


  const cancelAppointment =async  (appointmentId) =>{
         try{

          const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})

          if(data.success) {
                toast.success(data.message)
                // get all appointments 

                getAllAppointments()
          }else {
              toast.error(data.message)
          }

         }catch(error){
                toast.error(error.message);
         }
  }

  // function to get the getDash data 

  const getDashData = async () => {
        try{
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})

            if(data.success) {
                 setDashData(data.dashData)
                 console.log(data.dashData)
            }
            else {
                toast.error(data.message)
            }
        }catch(error) {
             toast.error(error.message);
        }
  }



  const value = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    backendUrl,
    changeAvailablity,
    appointments,setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,getDashData,

  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
}

export default AdminContextProvider