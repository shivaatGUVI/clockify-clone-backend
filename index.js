const express = require("express");
const application = express();

application.use(express.json());

application.get("/", (request, response) => {
  response.send("Hello World!");
});

application.listen(8080, () => {
  console.log("Server started");
});
