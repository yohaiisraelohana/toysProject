const express = require("express");
const http = require("http");
const path = require("path");
const fileUpload  = require("express-fileupload")
const {routesInit} = require("./routes/configRoutes")
require("./db/mongoConnect");

const app = express();

app.use(fileUpload({
    limits:{fieldSize:"5mb"},
    useTempFiles:true
}))
app.use(express.json({limit:"5mb"}));

app.use(express.static(path.join(__dirname,"public")));

routesInit(app);


const server = http.createServer(app);

const port = process.env.PORT || 3001;
server.listen(port);