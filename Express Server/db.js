import mongoose from "mongoose";
const connectDB = async () => {
   await mongoose.connect(process.env.URI).then((res)=>{  // aync await is used because mongoose.connect() runs asynchronously(it returns a promise), so console.log("Connected to MongoDB") may execute before the connection is actually established.
         console.log("Connected to MongoDB");
   } )
}

export default connectDB; //when exporting only single function, use export default