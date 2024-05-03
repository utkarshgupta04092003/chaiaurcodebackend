import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () =>{
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log('connected to: ')
        console.log(connectInstance.connection.host);
    }
    catch(err){
        console.log("Error", err);
    }
}