import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoutes.js'


// app config 

const app= express()

const port=process.env.PORT || 4000 


connectDB();
connectCloudinary();

// middlewares 

app.use(express.json())

// for deployment 
const allowedOrigins = [
  // This will be our deployed Vercel domain for the main frontend (e.g., https://prescripto-main.vercel.app)
  process.env.FRONTEND_URL,
  // This will be our deployed Vercel domain for the admin panel (e.g., https://prescripto-admin.vercel.app)
  process.env.ADMIN_URL,
  // Local development fallbacks
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // If the origin is not provided (e.g., direct API calls, server-to-server), allow it.
      // Or, if the origin is in our explicitly allowed list, allow it.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Reject requests from unauthorized origins in production
        console.log("CORS rejected origin:", origin);
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);



// api endpoints 
app.use('/api/admin',adminRouter);  // localhost:4000/api/admin/add-doctor

app.use('/api/doctor',doctorRouter)

app.use('/api/user',userRouter)


app.get('/',(req,res)=>{
       res.send("API WORKING ")
})



app.listen(port,()=> console.log("Server Started",port))
