import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        product:{
            type:String,
            required:true,
            unique:false,
            
        }
    },{timestamps:true});

export const Category = mongoose.model("Category",categorySchema);