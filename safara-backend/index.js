const express = require("express");
const cors = require('cors');
require('dotenv').config()
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors())

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t9lecvs.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0`

app.post("/jwt", async (req, res) => {
  const user = req.body;

  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  res.send({token})
});

app.get("/",async(req,res)=>{
    res.send('working server safara')
})
app.listen(4000, () => {
  console.log("server is running on port 4000");
});
