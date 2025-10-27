import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
const login = () => {
  const [state, setState] = useState("Admin");

  // take the token,backend envirionment  variable

  const { setAToken,backendUrl } = useContext(AdminContext);

  // take dToken,setDToken 

  const {setDToken} = useContext(DoctorContext)

  // state variable to store the email and password 

  const [email,setEmail] = useState('')

  const [password,setPassword]=useState('')


  const onSubmitHandler= async (event) => {
         event.preventDefault();

         console.log("vniovnreo vienvrle inrweovr")

         // api call 

         try {
            
             if(state==='Admin') {
                  
              // logic to login the admin 

              // use axios package 

              const {data} = await axios.post(backendUrl+ '/api/admin/login',{email,password})
              console.log("uri",data.token);
              if (data.success) {
                console.log(data.token);

                // token store in the local storage 
                localStorage.setItem("aToken", data.token);

                // set the token

                setAToken(data.token);
              } else {
                // display this toast notification (to do this first we need to import the toastify in the app.jsx)

                toast.error(data.message);
              }

             } else {
                   // logic to call the backend api and allow doctor to login 

                   const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})

                   // now we will get response 

                    if (data.success) {
                      console.log("doctor token is ",data.token);

                      // token store in the local storage
                      localStorage.setItem("dToken", data.token);

                      // set the token

                      setDToken(data.token);
                    } else {
                      // display this toast notification (to do this first we need to import the toastify in the app.jsx)

                      toast.error(data.message);
                    }





             }
         }
         catch (error) {
                 console.log("error comes ",error)
         }
  }

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E]">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login ?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login ?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default login
