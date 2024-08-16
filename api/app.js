import express from "express";
import 'dotenv/config'
import Authroutes from './routes/auth.route.js'
import postroutes from './routes/post.route.js'
import userroutes from './routes/user.route.js'
import connectDB from "../api/Model/db.js"

const app = express();
app.use(express.json());
const PORT = process.env.PORT



app.use('/api/auth', Authroutes)
app.use('/api/post', postroutes)
app.use('/api/user', userroutes)


connectDB();



app.listen  (PORT, ()=>{console.log(`Server is running on ${PORT} `)

})
