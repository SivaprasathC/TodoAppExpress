import express from 'express'; //if declared common js in package.json use const exprees=require('express'); here it is declared as module(ES6,new version,asynchronous loading) in package.json
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
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
import {user} from './usermodel.js';



app.get('/todos',async (req,res)=>{   


    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; 
    const reqestedUser = jwt.verify(token, process.env.JWTSECRET);
    console.log(reqestedUser.id);
    const todoResult = await todo.find({ user:reqestedUser.id});
    console.log(todoResult);
    try{
        res.send(todoResult);
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
    const decode=jwt.verify(req.body.jwttoken,process.env.JWTSECRET)
    console.log(decode);
    var data={
            "todo":req.body.todo,
            "deadline":req.body.deadline,
            "user":decode.id
       }
     console.log(data);
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
// ----------------Authentication-------------------------------//
app.post('/register', async(req,res)=>{

    var{name,number,mail,password}=req.body 
    if(!name||!number||!mail||!password){
        res.send({
            err:"Please fill all the fields!"
        })
    }
    var userExits = await user.findOne({mail}); 
    if (userExits){
        res.send({
            err:"User Mail already exists!"
        })
    }
    else{
        const salt = await bcrypt.genSalt (10);
        const hashedPassword = await bcrypt.hash (password, salt);
        const usercreatestatus = await user.create({name,number,mail,password:hashedPassword})
        if(usercreatestatus){
            res.send({
                message:"Success"
            })
        }
        else{
            res.send({
                 message:"Error"
            })
        }
    }
})

app.post('/login', async(req,res)=>{
    const {mail, password} = req.body;
    const userExits = await user.findOne({mail});
    if(userExits && (await bcrypt.compare (password, userExits.password))){
             return res.send({
                    message:"Success",
                    token:gentoken(userExits._id)
      })
    }
    else{
        res.json({
           msg:"Failure"
        })
    }
})

function gentoken(id){
     return jwt.sign({id},process.env.JWTSECRET)
}

app.post('/reset-pass', async(req,res)=>{
    const {mail} = req.body;
    const userexists = await user.findOne({mail});

    if(!userexists){
        res.send({
            message:"User not found"
        })
    }
    else{
        const token = Math.random().toString(36).slice(-8);
        userexists.resettoken = token;
        userexists.tokenexpire = Date.now() + 360000; //1hour

        userexists.save();
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user:process.env.EMAIL,
              pass:process.env.PASSWORD
            }
          });
          
          var mailOptions = {
            from:process.env.EMAIL,
            to: userexists.mail,
            subject: 'Todo Password Reset',
            text:`You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please Use the below code to reset your password \n\n Code:${token} (Exipres in 1 Hour)\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.send({
                  message:"Error"
              })
            } else {
                res.send({
                    message:"Success"
                })
            }
          });
    }   

})

app.post('/reset-pass/:code', async(req,res)=>{

    const code = req.params.code;
    const password = req.body.password
    const userexists = await user.findOne(
        {resettoken:code,
        tokenexpire:{$gt:Date.now()}
    })
    
    if(!userexists){
        res.send({
            message:"Invalid or Expired Token"
        })
    }
    else{
        const salt = await bcrypt.genSalt (10);
        const hashedPassword = await bcrypt.hash (password, salt);
        userexists.password = hashedPassword;
        userexists.resettoken = null;
        userexists.tokenexpire = null;
        userexists.save();
        res.send({
            message:"Password Reset Success"
        })
    }

})


// app.get('/getme', async(req,res)=>{
//     res.send({
//         message:"Register",
//      })
// })



app.listen(process.env.X_ZOHO_CATALYST_LISTEN_PORT||3000,()=>{
    console.log(`Server is running on port ${port}`);
});
