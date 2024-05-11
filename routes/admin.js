const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin,User,Course} =require('../db/index')
require('dotenv').config();
const secretKey=process.env.secretKey;
const jwt=require('jsonwebtoken');
// Admin Routes
router.post('/signup', async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
   //use zod validation here will implement later
    try{
        await Admin.create({username,password});
        res.status(201).send(`user created with name : ${username}`);
    }
    catch(e){
        console.log("error : ",e);
        res.json({msg :"registeration failed"})
    }
});

router.post('/signin', async(req, res) => {
    //check if the admin exist
    const username=req.body.username;
    const password=req.body.password;
    const adminData=await Admin.findOne({username,password});
    if(adminData){
        //return a jwt token
        
        const token=jwt.sign({username},secretKey);
        res.status(200).json({"token" : token});
    }
    else{
        res.status(401).send("wrong username or password");
    }

    
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const tittle=req.body.tittle;
    const description=req.body.description;
    const price=req.body.price;
    const imgLink=req.body.imgLink;
    const courseData=await Course.create({
        tittle,
        description,
        price,
        imgLink
    })
    res.status(201).json({msg:`${tittle} successfully created`});
});

router.get('/courses', adminMiddleware,async (req, res) => {
    const data=await Course.find({});
    res.status(200).json({"course list":data})
});

module.exports = router;