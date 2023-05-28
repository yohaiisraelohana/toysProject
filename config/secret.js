require("dotenv").config();


exports.config = {
    USER_DB: process.env.USER_DB,
    PASSWORD_DB: process.env.PASSWORD_DB,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
}