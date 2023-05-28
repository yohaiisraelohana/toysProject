const mongoose = require('mongoose');
const {config} = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.USER_DB}:${config.PASSWORD_DB}@cluster0.wgnnwc2.mongodb.net/toysProject`);
  console.log("mongo connect toysProject atlas");
}
