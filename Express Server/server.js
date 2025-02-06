import express from 'express'; //if declared common js in package.json use const exprees=require('express'); here it is declared as module(ES6,new version,asynchronous loading) in package.json
const app=express(); 
const port=3000;

app.use(express.json()) //will treat all post requests as json //miidleware

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db.js';
connectDB();

// import cors from 'cors';
// app.use(cors());
// app.use(cors({
//     origin: 'https://todoplannersite.netlify.app',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.options('*', cors());


import {todo} from './tomodel.js';



app.get('/todos',async (req,res)=>{   
    
    const todoresult=await todo.find();
    try{
        res.send(todoresult);
    }
    catch(err){
        res.send({
            message:"Data not fetched",
            success:false,
            data:err
        });
    }
   
})



app.post('/create',async (req,res)=>{
    const data=req.body;
    const newtodo= await todo.create(data);
    try{
        res.send({
            message:"Data created successfully",
            success:true,
            data:newtodo
    
        });
    }
    catch(err){
        res.send({
            message:"Data not created",
            success:false,
            data:err
        });
    }
})


app.patch('/update/:id',async (req,res)=>{
    const id=req.params.id;
    const updatedtodo=req.body;

    try{
    await todo.findByIdAndUpdate(id,updatedtodo);
    const todoresult=await todo.find();
    res.send({
        message:"Data updated successfully",
        success:true,
        data:todoresult
    });
  }
  catch(err){
    res.send({
        message:"Data not updated",
        success:false,
        data:err
    });
    }
})


app.delete('/delete/:id',async (req,res)=>{

    // res.header('Access-Control-Allow-Origin', 'https://todoplannersite.netlify.app');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const id=req.params.id;

    try{
    await todo.findByIdAndDelete(id);
    const todoresult=await todo.find();
    res.send({
        message:"Data deleted successfully",
        success:true,
        data:todoresult
    });
  }
  catch(err){
    res.send({
        message:"Data not deleted",
        success:false,
        data:err
    });
    }
})


app.listen(process.env.X_ZOHO_CATALYST_LISTEN_PORT||3000,()=>{
    console.log(`Server is running on port ${port}`);
});
