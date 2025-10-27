import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"

import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"


// API for adding doctors, whenever we call this API , in the req we have all the doctor information  


const addDoctor = async (req,res) => {
     
    try{

      
          console.log("req.body:", req.body); // Check what multer put here
          console.log("req.file:", req.file);
          const {name,email,password,speciality,degree,experience,about,fees,address} = req.body;

        //   se need to send a form data , to parse the form data we need middleware 

        const imageFile=req.file
         
        console.log({
          name,
          email,
          password,
          speciality,
          degree,
          experience,
          about,
          fees,
          address,
          
        },imageFile);

        // checking for all data to add doctor

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({success:false,message:"Missing Details"})
        }

        //  validating email format 

        if(!validator.isEmail(email)) {
          return res.json({ success: false, message: "please enter the valid email" });
             
        }

        // validating strong password 

        if(password.length< 8) {
               return res.json({
                 success: false,
                 message: "please enter a strong password",
               });
        }

        // encrypt the password and save in the database 
      


        // hashing doctor password 

        const salt= await bcrypt.genSalt(10)

        const hashedPassword= await bcrypt.hash(password, salt)

        // upload image to cloudinary , response will store imageUpload variable 

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
          
        });

        const imageUrl=imageUpload.secure_url

        //save data into the database 

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        // store into databse 

        const newDoctor=new doctorModel(doctorData);
        await newDoctor.save();

        res.json({success:true,message:"Doctor Added"})






    } catch(error) {
          console.log("error comes ",error);
          res.json({success:false,message:error.message})
    }
}

// API for the Admin Login 

const loginAdmin = async (req, res) => {
  try {
    console.log("inside the loginAdmin");

    // take the email and password 

    const { email, password} = req.body
    
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
    
    const emailTrim = email.trim();
    const passTrim = password.trim();
    

    if (emailTrim === adminEmail && passTrim === adminPassword) {
      
      const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET);
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("loginAdmin error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// api to get all doctor list for the admin pannel 

const allDoctors= async (req,res) => {
          
     try{

       // dont take the password properties 

        const doctors= await doctorModel.find({}).select('-password')

        res.json({success:true,doctors})


          
     } catch(error) {
         console.log("inside the error block ")
          console.log(error);
          res.json({ success: false, message: error.message });
     }
}

//API to get all appointments list 

const appointmentsAdmin= async (req,res) =>{
     try{
            const appointments= await appointmentModel.find({})

            res.json({success:true,appointments})
     }catch(error){
            console.log(error);
            res.json({ success: false, message: error.message });
     }
}

// API to cancel appointment 

const appointmentCancels= async (req,res)=>{
       try{    
               
               const {appointmentId} = req.body

               const appointmentData=await appointmentModel.findById(appointmentId)

            

               await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

               // if appointment cancelled then  this slot  time will be available for the doctor 

               // releasing doctor slots 

               const {docId,slotDate,slotTime} = appointmentData

               const doctorData= await doctorModel.findById(docId)

               let slots_booked=doctorData.slots_booked

               slots_booked[slotDate] = slots_booked[slotDate].filter(e => e!==slotTime)

               await doctorModel.findByIdAndUpdate(docId,{slots_booked})

               res.json({success:true,message:'Appointment Cancelled'})









       }catch(error) {
                console.log(error);
                res.json({ success: false, message: error.message });
       }
}

// API to get dashboard data for admin pannel

const adminDashboard = async (req,res) => {
      
  try{
          const doctors= await doctorModel.find({});

          const users=await userModel.find({})

          const appointments=await appointmentModel.find({})

          const dashData={
               doctors:doctors.length,
               appointments:appointments,
               patients:users.length,
               latestAppointments:appointments.reverse().slice(0,5)
          }
           
          res.json({success:true,dashData})
          
  }catch(error){
         console.log(error);
         res.json({ success: false, message: error.message });
  }
}



export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancels,adminDashboard}

// now create new routes , adminRoutes.js , doctorRoutes.js.  go adminRoutes.js  