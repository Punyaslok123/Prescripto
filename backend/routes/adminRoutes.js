import express from 'express'
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancels,
  appointmentsAdmin,
  loginAdmin,
  
} from "../controllers/adminController.js";

import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';
import { changeAvailablity } from '../controllers/doctorController.js';

const adminRouter=express.Router()

// endpoint 

// adminRouter.post('/add-doctor',upload.single("image"),addDoctor)

// before calling add the authentication middleware 

adminRouter.post("/add-doctor",authAdmin,  upload.single("image"), addDoctor);

// for API login handle 

adminRouter.post('/login',loginAdmin);

// for all doctors fetch (also add middleware so that we can authenticate the admin to access the api )

adminRouter.post('/all-doctors',authAdmin,allDoctors)

// for changeavailblity 

adminRouter.post('/change-availablity',authAdmin,changeAvailablity)

// route for to get the all appointments 

adminRouter.get("/appointments", authAdmin,appointmentsAdmin);

// route for cancel appointment

adminRouter.post('/cancel-appointment',authAdmin,appointmentCancels)

// route for the dashboard page 

adminRouter.get('/dashboard',authAdmin,adminDashboard)



export default adminRouter

// no go server.js api endpoints 

