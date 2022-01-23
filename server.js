require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// import routes
// const authRoute = require("./routes/auth");


const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Fullstack React Course Express Server");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database");

      app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
      });
    })
    .catch((error) => {
      console.log(error);
    });