const express = require("express");
const application = express();
const tracker = require("./routes/tracker");
const categories = require("./routes/category");
const userRoute = require("./routes/userRoute");
const groupRoutes= require("./routes/groupRoutes");
const mongoose = require("mongoose");

// testing purposes
mongoose.connect("mongodb://localhost:27017/clockifyClone")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));


application.use(express.json());

application.use("/tracker", tracker);
application.use("/categories", categories);

application.get("/", (request, response) => {
  response.send("Hello World!");
});

application.use(express.json());

application.use(userRoute);
application.use(groupRoutes)

application.listen(8080, () => {
  console.log("Server started");
});
