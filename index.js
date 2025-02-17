const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const tracker = require("./routes/tracker");
const categories = require("./routes/category");
const groupRoutes = require("./routes/groupRoutes");
const { userRouter } = require("./routes/user.route");
const { connectToMongoDB } = require("./utils/db");
const cors = require("cors");


dotenv.config();
const application = express();

application.use(express.json());
application.use(cors("*"));
application.use("/api", userRouter);
application.use("/tracker", tracker);
application.use("/categories", categories);
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
