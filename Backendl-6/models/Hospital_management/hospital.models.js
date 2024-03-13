import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        address1:{
            type:String,
            required:true,

        },
        address2:{
            type:String,
        },
        city:{
            type:String,
            required:true,
        },
        specialisedIn:{
            type:[{
                type:String,
            }],
            required:true,
        },
        likes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }]
    },{timestamps:true});

export const Hospital = mongoose.model("Hospital",hospitalSchema);