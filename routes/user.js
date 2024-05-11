const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {Admin,User,Course}=require('../db/index')
require('dotenv').config();
const secretKey=process.env.secretKey;
// User Routes
router.post('/signup',async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
   //use zod validation here will implement later
    try{
        await User.create({username,password});
        res.status(201).send(`user created with name : ${username}`);
    }
    catch(e){
        console.log("error : ",e);
        res.json({msg :"registeration failed"})
    }
});

router.post('/signin',async(req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    const adminData=await User.findOne({username,password});
    if(adminData){
        //return a jwt token
        
        const token=jwt.sign({username},'secretKey');
        res.status(200).json({"token" : token});
    }
    else{
        res.status(401).send("wrong username or password");
    }
});

router.get('/courses', async(req, res) => {
    const data=await Course.find({});
    res.status(200).json({"course list":data})
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    const id=req.params.courseId;
    const username=req.headers.username;
    const courseId=await Course.findOne({_id : id});
    if(courseId){
        const data=await User.updateOne(
            {username},
            {
                $push : {purchasedCourses:courseId}
            }
        )
        
        res.json({"course added to user " :username});
    }
    else res.send("wrong course id")
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router