import express from "express";
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList,doctorProfile,loginDoctor, updateDoctorProfile } from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";


const doctorRouter = express.Router();

// api endpoints 

doctorRouter.get('/list',doctorList)

// api for doctor login 

doctorRouter.post('/login',loginDoctor)

// route for all appointments for a specific doctor 

doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)

// route for the appointment completed mark

doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)

// route for the appointment completed 

doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)

// route for the doctor dashboard 

doctorRouter.get('/dashboard',authDoctor,doctorDashboard)

// route for get doctor profile 


doctorRouter.get('/profile',authDoctor,doctorProfile)

// route for update doctor profile 


doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)





export default doctorRouter