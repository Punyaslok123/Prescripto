
import validator from 'validator'

import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'

import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'
// api to register user 

const registerUser=async (req,res) =>{
        
    try{
       
        const {name,email,password}=req.body;
        
        if(!name || !password || !email) {
              return res.json({success:false,message:"Missing Details"})
        }

        // chack email is validate or not
        
        if(!validator.isEmail(email)){
               return res.json({ success: false, message: "Enter a valid email" }); 
        }

        if(password.length < 8) {
               return res.json({ success: false, message: "Enter a Strong passeord " });
        }

        // hashing user password 

        const salt= await bcrypt.genSalt(10)

        const hashedPassword=await bcrypt.hash(password,salt);

        // save this hash password in the dataabse

        const userData={
            name,email,password:hashedPassword
        }

        const newUser=new userModel(userData);

        const user=await newUser.save();

        // _id property , using this _id we will create a token , so that a user can login 

        // to create token, first need to import the jwt 

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

        //gen response so that we can send this token to the user 

        res.json({success:true,token})

    }catch(error){
        
         console.log(error);
         res.json({ success: false, message: error.message });
    }
}


// api for user login 

const loginUser=async (req,res)=>{
          try{ 
            // need email,password to login the user 

              const {email,password}=req.body

              const user=await userModel.findOne({email})

              // if the user exist with this email id or not 

              if(!user){
                    return res.json({ success: false, message:"User does not exist" });
              }

              // check password is match or not 
              
              const isMatch= await bcrypt.compare(password,user.password)


              if(isMatch){
                   const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

                  res.json({success:true,token})
              } else {
                  res.json({ success: false, message: "Invalid credentials" });
              }

          }catch(error){
                console.log(error);
                res.json({ success: false, message: error.message });
          }
}

// API to get the user profile data 

const getProfile= async (req,res) =>{
      try{
          // get the user id using authenrication (using the token we will get the userId ) , we will provide the userId to the frontend , userId add the request body , so that we can access it 
          
          // middleware create - authUser.js (same as authAdmin.js )
          
          const {userId} = req
          
          // find this user 

          const userData=await userModel.findById(userId).select('-password')

          res.json({success:true,userData})




      }catch(error){
            console.log(error);
            res.json({ success: false, message: error.message });
      }
}

// api to update the user profile 

const updateProfile=async(req,res)=>{
     
    try{

        // need the datas from the request , so when we call this api , we will send this 

        const userId=req.userId


        const {name,phone,address,dob,gender}=req.body

        const imageFile=req.file

        if(!userId)   return res.json({ success: false, message: "Id missing" });

        if(!name || !phone || !dob || !gender) {
        
              return res.json({success:false,message:"Data Missing"})
        }


        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})


        if(imageFile){
              
             // upload the image to cloudinary 

             const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})

             const imageURL=imageUpload.secure_url

             // save this image in hte user data 

             await userModel.findByIdAndUpdate(userId,{image:imageURL})


        }

        res.json({success:true,message:"Profile Updated"})




    }catch(error){
         console.log(error);
         res.json({ success: false, message: error.message });
    }
}

//api to book appointment 


const bookAppointment = async (req,res) =>{
       
    try{
        
        const userId=req.userId
        const {docId,slotDate,slotTime} = req.body

        // find the doctor 
        console.log("doc id is ",docId);
        const docData= await doctorModel.findById(docId).select('-password')

        if(!docData.available) {
              return res.json({success:false,message:'doctor not available'})
        }

        // copy of slots booked data 


        let slots_booked=docData.slots_booked

        // checking for slots availablity

        if(slots_booked[slotDate]){

              if(slots_booked[slotDate].includes(slotTime)){
                    return res.json({
                      success: false,
                      message: "slots not available",
                    });
              }
              else {
                   
                slots_booked[slotDate].push(slotTime)
              }
        } else {
               
            slots_booked[slotDate]=[]

            slots_booked[slotDate].push(slotTime)
        }

        const userData=await userModel.findById(userId).select('-password')

        // now need to delete , because we need to save the doctor data in the apointment data also (unnecessary data we dont want in the appointment model )

        delete docData.slots_booked

        const appointmentData= {
             userId,
             docId,
             userData,
             docData,
             amount:docData.fees,
             slotTime,
             slotDate,
             date:Date.now()
        }

        // save this data in the database 

        const newAppointment= new appointmentModel(appointmentData)

        await newAppointment.save()

        console.log("doctor is booked")

        // save new slots data in the doctor data 

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})


        res.json({success:true,message:'Appointment Booked'})


        
    }catch(error){
          console.log(error);
          res.json({ success: false, message: error.message });
    }
}

// api to get user appointments for frontend my appointment page 

const listAppointment = async(req,res) =>{
      try{
             const userId = req.userId

             // variable where we store all the appointments for the user 

             const appointments= await appointmentModel.find({userId})

             res.json({success:true,appointments})



      }catch(error) {
              console.log(error);
              res.json({ success: false, message: error.message });
      }
}


// api to cancel appointment 

const cancelAppointment= async (req,res)=>{
       try{    
               const userId=req.userId
               const {appointmentId} = req.body

               const appointmentData=await appointmentModel.findById(appointmentId)

               // verify appointment user 

               if(appointmentData.userId!==userId) {
                    return res.json({success:false,message:'Unauthorized action'})
               }

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

//  make payment appointment through razorpay 

// create razorpay instance 

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// api function to make payment in online

const paymentRazorpay= async (req,res) =>{
       
     try{
            const { appointmentId } = req.body;

            const appointmentData = await appointmentModel.findById(
              appointmentId
            );

            if (!appointmentData || appointmentData.cancelled) {
              return res.json({
                success: false,
                message: "Appointment Cancelled or not Found",
              });
            }

            // create one env variable for the currency type

            // creating options for razorpay payment

            const options = {
              amount: appointmentData.amount * 100,
              currency: process.env.CURRENCY,
              receipt: appointmentId,
            };

            // creation of an order

            const order = await razorpayInstance.orders.create(options);

            res.json({ success: true, order });
     }catch(error){
            console.log(error);
            res.json({ success: false, message: error.message });
     }
}


// api to verify the payment 

const verifyRazorpay= async (req,res) =>{
      try{
            // from requst body take this response values 

            const {razorpay_order_id}=req.body
            const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id)

            console.log(orderInfo); 

            // make the payment status of that appointment true

            if(orderInfo.status==='paid'){
                     await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})

                     res.json({success:true,message:"Payment successful"})

            }
            else {
                     
                  res.json({ success: false, message: "payment failed" });
            }
      }catch{
                console.log(error);
                res.json({ success: false, message: error.message });
      }
}



export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}