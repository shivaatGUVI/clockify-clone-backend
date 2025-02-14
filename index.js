const express = require("express");
const dotenv = require("dotenv");
const tracker = require("./routes/tracker");
const categories = require("./routes/category");
const { userRouter } = require("./routes/user.route");

dotenv.config();
const application = express();

application.use(express.json());
application.use("/api", userRouter);
application.use("/tracker", tracker);
application.use("/categories", categories);

application.get("/", (request, response) => {
  response.send("Hello World!");
});

application.listen(8080, () => {
  console.log("Server started");
});
