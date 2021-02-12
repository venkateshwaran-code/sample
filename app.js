const express = require("express");
const bodyparser=require("body-parser");
const mongoose = require("mongoose");
const onlineDB=require("./onlineDB/connectionDB");
const cookieSession = require("cookie-session");
const path = require("path");
const bcrypt = require("bcrypt");

const indexrouter=require("./routers/index");
const User = require("./models/User");
const Donation=require("./models/Donation");
const Event=require("./models/Event");

const authenticateUser = require("./middlewares/authenticateUser");
const databaseconnection = require("./onlineDB/connectionDB");
const { send } = require("process");

const app = express();
app.use('/',indexrouter);


// online DB
databaseconnection();

// mongdb cloud connection is here
/*mongoose
  .connect("mongodb://localhost/charity", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to mongodb :)");
  })
  .catch((err) => {
    console.log(err);
  });*/

// middlewares
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 
app.use(express.static("public"));
app.use('/static',express.static('static'));
app.use(express.static(path.join(__dirname,"asserts")));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.set("view engine", "ejs");

// cookie session
app.use(
  cookieSession({
    keys: ["randomStringASyoulikehjudfsajk"],
  })
);

// route for serving frontend files
app
    .get("/home", authenticateUser, (req, res) => {
    res.render("home", { user: req.session.user });
  });

// route for handling post requirests
app
  .post("/login", async (req, res) => {
    const { email, password, Access } = req.body;

    // check for missing filds
    if (!email || !password||!Access) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExits = await User.findOne({ email, Access });

    if (!doesUserExits) {
      res.send("invalid username or Access type");
      return;
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) {
      res.send("invalid useranme or password");
      return;
    }

    // else he\s logged in
    req.session.user = {
      email,
    };
    if(doesUserExits.Access=='ADMIN')
    {
      res.render("admin",{ user: req.session.user });
    }
    else if(doesUserExits.Access=='NGO')
    {
      res.render("ngo",{ user: req.session.user });
    }
    else
    {
      res.send('no');
    }
  });

  //register
  app
  .post("/registerusers", async (req, res) => {
    const { name, email, password, Access } = req.body;

    // check for missing filds
    if (!name|| !email || !password||!Access) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay) {
      res.send("A user with that email already exits please try another one!");
      return;
    }

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ name, email, password: hashedPassword, Access });

    latestUser
      .save()
      .then(() => {
        res.redirect("/login")
        return;
      })
      .catch((err) => console.log(err));
  });

  //Donation Donate
  app.post("/donation",async (req,res)=>{
    const {Name,Phone,City}=req.body;
    const donation=new Donation({Name,Phone,City});
    donation.save();
    res.redirect("https://test.instamojo.com/@venkateshwaran8569");
  });

  //Donation Details
  app.get('/donationdetails',(req,res)=>{
    Donation.find({},(err,docs)=>{
        if(err)throw err;
        else  res.render('donations',{users:docs});
    });
});

//admin
app.get("/admin", authenticateUser, (req,res)=>{
  res.render("admin",{ user: req.session.user });
})



//Fund Donation
app.get("/FundDonation",(req,res)=>{
  
    res.redirect("https://test.instamojo.com/@venkateshwaran8569");
  
});

//Event Creation
app.post("/Event",(req,res)=>{
  const {Name,Eventdate,Eventduration,Eventdescrption}=req.body;
  const event=new Event({Name,Eventdate,Eventduration,Eventdescrption});
  event.save();
  res.send("success");
})

//logout
app.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});
// server config
const PORT = process.env.Port||3000;
app.listen(PORT, () => {
  console.log(`Server started listening on port: ${PORT}`);
});
