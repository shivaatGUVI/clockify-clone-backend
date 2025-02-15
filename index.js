const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const tracker = require("./routes/tracker");
const categories = require("./routes/category");
const userRoute = require("./routes/userRoute");
const groupRoutes = require("./routes/groupRoutes");
const { userRouter } = require("./routes/user.route");

dotenv.config();
const application = express();

// testing purposes
mongoose
  .connect("mongodb://localhost:27017/clockifyClone")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

application.use(express.json());
// // application.use("/api", userRouter);
// application.use("/tracker", tracker);
// application.use("/categories", categories);
// // application.use(userRoute);
// application.use(groupRoutes);

application.get("/", (request, response) => {
  response.send("Hello World!");
});

application.listen(8080, () => {
  console.log("Server started");
});
