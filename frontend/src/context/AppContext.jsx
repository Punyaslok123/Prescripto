import { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets";   //access the doctors array 
import axios from 'axios'
import {toast} from 'react-toastify'


export const AppContext=createContext();

// create the context provider function 

const AppContextProvider=(props)=>{
  // for storing the doctor informations


  const [doctors, setDoctors] = useState([]);

  const [userData,setUserData]=useState(false)



  const currencySymbol = "₹";

  // token variable 
  const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if(!backendUrl) {
      console.log("backend url is not set");
  }

  // call api for all doctors from the database

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        // save this data in the state varibale

        setDoctors(data.doctors);
      } else {
        console.log("oops")
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      console.log("oops2")

      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);


  const loadUserProfile = async () =>{
        try{

          const {data} = await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})


          if(data.success){
              setUserData(data.userData)
          }else {
              toast.error(data.message)
          }
        }catch(error){
            console.log(error)
            toast.error(error.message)
        }
  }  

  useEffect(()=>{
       
    if(token) {
         loadUserProfile();
    }
    // if we looged out then  clear the state(since token unavailable) 

    else {
         setUserData(false)
    }
  },[token])

  // whatever we store in the value object we can access it any component
  const value = {
    doctors,
    currencySymbol,
    token,setToken,backendUrl,
    userData,setUserData,loadUserProfile,
    getDoctorsData
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export default AppContextProvider