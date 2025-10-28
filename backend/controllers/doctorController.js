import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailablity= async (req,res) => {
      
    try{
    
        const {docId}=req.body

        const docData= await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availablity Changed '})
    }
    catch(error) {
          console.log(error)
          res.json({success:false,message:error.message})
    }
    

}

// api function to fetch all the doctors from the database

const doctorList= async (req,res) => {
      try{
        // withput email and password property
        // doctorController.js (Correct)
      const doctors = await doctorModel.find({}).select("-password -email");

        res.json({ success: true, doctors });
      }catch(error) {
              console.log(error);
              res.json({ success: false, message: error.message });
      }
}


// API for doctor login 

const loginDoctor = async (req,res) => {
      
  try{
        // use email and password to authenticate the doctor 
        
        const {email,password} = req.body

        // find the doctor

        const doctor= await doctorModel.findOne({email})

        if(!doctor) {
             return res.json({success:false,message:"Invalid Credential"})
        }

        // check the password with the database password 

        const isMatch= await bcrypt.compare(password,doctor.password)

        if(isMatch){
              
          // provide the authentication token (use jwt to create the token )
           const token= jwt.sign({id:doctor._id},process.env.JWT_SECRET)

           res.json({success:true,token})
        }else {
            return res.json({ success: false, message: "Invalid Credential" });

        }
  }
  catch(error){
      console.log(error);
      res.json({ success: false, message: error.message });
  }
}

// API to get doctor appointments of a specific docotor for doctor pannel

const appointmentsDoctor= async (req,res) => {
     
    try{
            const docId=req.docId

            const appointments = await appointmentModel.find({ docId: docId });

            res.json({success:true,appointments})
    }catch(error){
           
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to mark appointment completed for doctor pannel 

const appointmentComplete = async (req,res) => {
     try{
          const docId=req.docId

          const {appointmentId}= req.body


          const appointmentData = await appointmentModel.findById(appointmentId)

          if(appointmentData && appointmentData.docId) {
               await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})

               return res.json({success:true,message:'Appointment Completed'})
          }
          else {
               return res.json({
                 success: false,
                 message: "Mark failed",
               });
          }


     }catch(error) {
           console.log(error);
           res.json({ success: false, message: error.message });
     }
}

// API to mark appointment cancel for doctor pannel 

const appointmentCancel = async (req,res) => {
     try{
          const docId=req.docId

          const {appointmentId}= req.body


          const appointmentData = await appointmentModel.findById(appointmentId)

          if(appointmentData && appointmentData.docId) {
               await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

               return res.json({success:true,message:'Appointment Cancelled'})
          }
          else {
               return res.json({
                 success: false,
                 message: "Cancelltion failed",
               });
          }


     }catch(error) {
           console.log(error);
           res.json({ success: false, message: error.message });
     }
}

// API to get dashboard data for doctor panel

const doctorDashboard = async (req,res) => {
      try{
           const docId=req.docId

           const userId=req.userId

           const appointments = await appointmentModel.find({docId})

           // calculate the earning of this doctor 

           let earnings = 0 

           appointments.map((item)=>{
               if(item.isCompleted || item.payment) {
                      earnings+=item.amount
               }
           })

           // calculate total number of unique patients 

           let patients = []

           appointments.map((item)=>{
                   if(!patients.includes(item.userId))  patients.push(item.userId)
           })
          
           // create the dashboard data 

           const dashData  = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)

           }
           // send this dashdata using response 

           res.json({success:true,dashData})





      }catch(error){
          console.log(error);
          res.json({ success: false, message: error.message });
      }
}

// API to get doctor profile for doctor pannel 

const doctorProfile = async (req,res) => {
        try{
           const docId=req.docId;
           const profileData= await doctorModel.findById(docId).select('-password')

           res.json({success:true,profileData})
        }catch(error) {
                console.log(error);
                res.json({ success: false, message: error.message });
        }
}

// API to get update doctor profile data from doctor panel 

const updateDoctorProfile = async (req,res) => {
        try{

            const docId=req.docId
            const {fees,address,available} = req.body

            await doctorModel.findByIdAndUpdate(docId,{fees,address,available})


            res.json({success:true,message:"Profile Updated"})


        }catch(error){
              console.log(error);
              res.json({ success: false, message: error.message });
        }
}

export {changeAvailablity,doctorList,loginDoctor,appointmentsDoctor,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,updateDoctorProfile}

