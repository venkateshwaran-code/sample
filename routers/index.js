const express=require('express');
const router=express.Router();

router
  .get('/',(req,res)=>{
    res.render('index');
  })
  .get("/website",(req,res)=>{
    res.render("website");
  })
  .get("/login", (req, res) => {
    res.render("login");
  })
  .get("/register", (req, res) => {
    res.render("register");
  })
  .get("/donation", (req, res) => {
    res.render("donar");
  })
  .get("/event", (req,res)=>{
    res.render("event")
  })

module.exports=router;