import mongoose from "mongoose";

// This line defines a schema, i.e., the structure or blueprint of a doctor document inside MongoDB.
const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique:true},
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    // date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);


// to initialize the value into empty object we need to use minimize:false


// create doctor model, using this model we can store the doctor data in the database

// mongoose.model('doctor', doctorSchema) creates a model named doctor in the database (the actual collection name will be doctors automatically — pluralized).


const doctorModel=mongoose.models.doctor || mongoose.model('doctor',doctorSchema)

export default doctorModel