// require("dotenv").config({path:"./env"});
import connectDB from "./db/index.js";
import {app} from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR: ",error);
        throw error;
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGO db connection Failed !!! ",error);
});
































/*
import express from "express";
const app = express();
    //IIFE - Immediately Invoked Function Expression

    //; for cleaning purpose

    ; (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error",(error)=>{
                console.log("ERROR: ",error);
                throw error

            })
            app.listen(process.env.PORT,()=>{
                console.log(`App is listening on port ${process.env.PORT}`)
            })


        } catch (error) {
            console.log("ERROR: ", error)
            throw err
        }

    })()
    */