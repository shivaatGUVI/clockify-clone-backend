const express = require("express");
const application = express();
const tracker = require("./routes/tracker");
const categories = require("./routes/category");

application.use(express.json());

application.use("/tracker", tracker);
application.use("/categories", categories);

application.get("/", (request, response) => {
  response.send("Hello World!");
});

application.listen(8080, () => {
  console.log("Server started");
});
