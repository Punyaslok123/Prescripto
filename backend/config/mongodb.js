import mongoose from "mongoose"; // Imports the Mongoose library

// Defines an asynchronous function called connectDB. The function’s job is to make the actual database connection.

const connectDB = async () => {
  //  This line listens for a special event called 'connected' , When MongoDB successfully connects, this event runs . its a optional

  mongoose.connection.on("connected", () => console.log("database connected"));

  //   This line actually connects your app to MongoDB.prescripto — is the database name you want to use in your cluster.


  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "prescripto",
  });
};

export default connectDB;
