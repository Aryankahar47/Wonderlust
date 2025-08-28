const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")


app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");




const sessionOptions = {
    secret: "mySuperSecretString",
    resave: false,
    saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success= req.flash("success")
    res.locals.error= req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name==="anonymous"){
        req.flash("error", "some error occured");
    }else{
         req.flash("success", "user registered succesfully")
    }
    
    res.redirect("/hello")
})

app.get("/hello", (req, res)=>{
    

    res.render("page.ejs", {name: req.session.name, msg: req.flash("success")})
})

// app.get("/reqcount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count =1;
//     }
//     res.send(`you send request ${req.session.count}  times`)
// })


// app.get("/test", (req, res)=>{
//     res.send("test successful");
// })




// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookies", (req, res) => {
//     res.cookie("made-in", "India", {signed: true});
//     res.send("signed cookie send");
    
// });

// app.get("/verify", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("verified")

// })

// app.get("/greet", (req, res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi ${name}`)
// })

// app.get("/getCookies", (req, res)=>{
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India")
//     res.send("Hi I am cookies")
// })


// app.get("/", (req, res)=>{
//     console.dir(req.cookies)
//     res.send("Hi I am root")
// })

// app.use("/users", users);
// app.use("/posts", posts)



app.listen("3000", ()=>{
    console.log("server is listening to 3000")
})

