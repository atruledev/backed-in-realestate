import bycrpt from "bcrypt";
const saltRounds = 10;
import jwt from "jsonwebtoken";
import { user } from "../Model/schema.js";
const SECRET = "jwttoken";
const refreshSECRET = "jwtrefreshtoken";

import validator from "email-validator";
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "fields are required" });
    }

    const isValid = validator.validate(email);
    if (!isValid) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    if (password.length < 3) {
      return res
        .status(400)
        .json({
          message: "password length should me above then three characters",
        });
    }
    const hashedPassword = await bycrpt.hash(password, saltRounds);
    const newUser = new user({ username, email, password: hashedPassword });
    await newUser.save();
    console.log(newUser);
    const token = jwt.sign(newUser.id, SECRET);
    newUser.token = token;
    await newUser.save();
    return res.status(200).json({ newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ message: "field is required" });
    }
    const userExist = await user.findOne({ email });
    if (!userExist) {
      return res.status(401).json({ message: "email not found" });
    }
    console.log(userExist);
    const comparePassword = await bycrpt.compare(password, userExist.password);

    if (!comparePassword) {
      return res.status(401).json({ message: "invalid credientials" });
    }
    
    const accessToken = jwt.sign(userExist.id, SECRET, {expiresIn: '1m'});
    const refreshToken = jwt.sign(userExist.id, refreshSECRET, {expiresIn: '5m'});

    res.cookie('accessToken', accessToken, {maxAge: 60000})
    res.cookie('refreshToken', refreshToken, {maxAge: 300000, httpOnly:true});

    const verifyUser = (req,res, next)=>{
        const accessToken = req.cookie.accessToken

        if(!accessToken){
            
        }else{
            jwt.verify(accessToken, SECRET, (err)=>{
                return res.json({valid:false, message:"token is invalid"})
            })
        }

    }
    const RenewToken= (req,res, next)=>{
        const refreshToken = req.cookie.refreshToken

        if(!refreshToken){
            
        }else{
            jwt.sign(refreshToken, SECRET, (err)=>{
                return res.json({valid:false, message:"token is invalid"})
            })
        }

    }



    return res.status(201).json({ message: "login successfully", token }) ;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.send("hello");
};

export default { register, login, logout };
