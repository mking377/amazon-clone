const express = require("express");
const app = express();
app.get("/", (req,res)=> res.send("Hello from Cart Service (Node.js)"));
app.listen(4003, ()=> console.log("Cart running on 4003"));
