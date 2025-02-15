const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const tracker = require("./routes/tracker");
const categories = require("./routes/category");
const userRoute = require("./routes/userRoute");
const groupRoutes = require("./routes/groupRoutes");
const { userRouter } = require("./routes/user.route");
const { connectToMongoDB } = require("./utils/db");

dotenv.config();
const application = express();

application.use(express.json());
application.use(cors());
application.use("/api", userRouter);
application.use("/tracker", tracker);
application.use("/categories", categories);
application.use(userRoute);
application.use(groupRoutes);

application.get("/", (request, response) => {
  response.send("Hello World!");
});

application.listen(8080, async () => {
  console.log("Server is running on port 8080");
  try {
    await connectToMongoDB();
  } catch (err) {
    console.log(err);
  }
});
