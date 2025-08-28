const express = require("express");
const router = express.Router();


//index - users
router.get("/", (req, res)=>{
    res.send("GET for users");
});

//show - users
router.get("/:id", (req, res)=>{
    res.send("GET for user id");
});

//post - user
router.post("/", (req, res)=>{
    res.send("POST for users");
});

//delete- users
router.delete("/:id", (req, res)=>{
    res.send("delete for user id")
})

module.exports = router;
