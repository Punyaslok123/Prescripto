import express from 'express'

import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, paymentRazorpay, registerUser, updateProfile, verifyRazorpay } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter=express.Router();

// create api router for register 

userRouter.post("/register",registerUser)

// api router for the login user 

userRouter.post('/login',loginUser)

// create new route for the user profile 

userRouter.get('/get-profile',authUser, getProfile)

// for the update profile - two middle ware use first one is for the user data and the second one is for the user authentication(since we need the userId in the updateProfile controller.function )

userRouter.post('/update-profile',upload.single('image'),authUser, updateProfile)

//route for the book appointment 

userRouter.post('/book-appointment',authUser,bookAppointment)

// route for the all appointments for a user 

userRouter.get('/appointments',authUser,listAppointment)

// create route for the cancel appointment

userRouter.post('/cancel-appointment',authUser,cancelAppointment)

// route for the razorpay payment 

userRouter.post('/payment-razorpay',authUser,paymentRazorpay);

// route for verify razorpay 

userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)


export default userRouter
