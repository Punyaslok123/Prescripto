import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    // state variables store the form data 

    const [docImg,setDocImg]=useState(false)
    const [name,setName]=useState('')
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("1 Year");
    const [fees, setFees] = useState("");
    const [about, setAbout] = useState("");
    const [speciality, setSpeciality] = useState("General physician");
    const [degree, setDegree] = useState("");
    const [address1,setAddress1]=useState("");
    const [address2, setAddress2] = useState("");


    // when we submit the form then the form data will store in the database , so we need to do it 

    const {backendUrl,aToken} = useContext(AdminContext);





    // function execute when we click the add docor 

    const onSubmitHandler= async (event) => {
           event.preventDefault();

           // api call to add the doctor information in the database
           
           try{
                if(!docImg) {
                     return toast.error('Image not selected ')
                }

                // create form data where we will add these data 

                const formData= new FormData()

                formData.append('image',docImg)


                 formData.append("name", name);

                  formData.append("email", email);
                  
                   formData.append("password", password);

                    formData.append("experience", experience);

                     formData.append("fees", Number(fees));

                     formData.append("about", about);

                      formData.append("speciality", speciality);

                       formData.append("degree", degree);

                        formData.append(
                          "address",
                          JSON.stringify({ line1: address1, line2: address2 })
                        );

                        //  console log form data 

                        formData.forEach((value,key)=>{
                              console.log(`${key} : ${value}`)
                        })

                        // make the api call to save the doctor in hte database

                        const {data} = await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers:{aToken}})  // in backend aToken will be atoken 

                        if(data.success) {
                             toast.success(data.message)

                             // reset our data so that we can add another doctor after that, we are not reseting the speciality,

                             setDocImg(false)
                             setName('')
                             setPassword('')
                             setEmail('')
                             setAddress1('')
                             setAddress2('')
                             setDegree('')
                             setAbout('')
                             setFees('')

                        } else {
                             toast.error(data.message)
                        }







           }catch(error){
               toast.error(error.message)
               console.log(error)
           }


    }


  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      {/* Main Content Container */}
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Upload Doctor Picture Section - Remains flex-row */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload area placeholder"
            />
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />

          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        {/* Main Two-Column Layout - Adjusted to use flex-row on large screens and full width on smaller screens */}
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* LEFT COLUMN - Now correctly full width and takes 1 space on lg */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {/* Doctor Name */}
            <div className="flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            {/* Doctor Email */}
            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full border rounded px-3 py-2" // Added w-full and styling
                type="email"
                placeholder="Email"
                required
              />
            </div>

            {/* Doctor Password */}
            <div className="flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border rounded px-3 py-2" // Added w-full and styling
                type="password"
                placeholder="Password"
                required
              />
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="w-full border rounded px-3 py-2 appearance-none bg-white"
                name=""
                id=""
              >
                <option value="1 year">1 Year</option>
                <option value="2 year">2 Year</option>
                <option value="3 year">3 Year</option>
                <option value="4 year">4 Year</option>
                <option value="5 year">5 Year</option>
                <option value="6 year">6 Year</option>
                <option value="7 year">7 Year</option>
                <option value="8 year">8 Year</option>
                <option value="9 year">9 Year</option>
                <option value="10 year">10 Year</option>
              </select>
            </div>

            {/* Fees */}
            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="w-full border rounded px-3 py-2" // Added w-full and styling
                type="number"
                placeholder="fees"
                required
              />
            </div>
          </div>

          {/* RIGHT COLUMN - Now correctly full width and takes 1 space on lg */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {/* Speciality */}
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="w-full border rounded px-3 py-2 appearance-none bg-white"
                name=""
                id=""
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="w-full border rounded px-3 py-2" // Added w-full and styling
                type="text"
                placeholder="Education"
                required
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="w-full border rounded px-3 py-2 mb-2" // Added w-full and styling + margin
                type="text"
                placeholder="address1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="w-full border rounded px-3 py-2" // Added w-full and styling
                type="text"
                placeholder="address2"
                required
              />
            </div>
          </div>
        </div>

        {/* About Doctor Section - Full Width, placed below the two columns */}
        <div className="mt-6 flex flex-col gap-1">
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border rounded px-3 py-2 resize-none"
            placeholder="write about doctor"
            rows={5}
            required
          />
        </div>

        {/* Submit Button */}
        <button
         
          className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-150"
          type="submit"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
