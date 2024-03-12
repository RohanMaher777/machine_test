require('dotenv').config()
const express = require("express");
const app = express();
const Router = require("./src/routes/route");

app.use(express.json());
app.use("/", Router);

const port = 8081;
app.listen(port, () => {
   console.log("Server started on port " + port);
});
