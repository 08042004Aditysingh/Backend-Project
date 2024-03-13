import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        content:{
            type:String,
            required:true,
            unique:false,
            lowercase:false,
        },
        complete:{
            type:Boolean,
            default:false,
            // required:true,
            //no unique 
            //no lowercase
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        subTodos:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"SubTodo"
            }
        ]




}
,{timestamps:true});

export const Todo = mongoose.model("Todo",todoSchema);