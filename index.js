const express = require("express");
const app = express();
const routes = require("./routes");

let port = process.env.port || 3000;

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`The elasticsearch server is running on port ${port}`);
});
