import mongoose, {model,Schema} from "mongoose";


const todoSchema = new Schema({
               todo: {type: String},
               deadline: {type: String},
});
export const todo = mongoose.models.todo || new model("todo", todoSchema) //if the model is already created, use that model, else create a new model