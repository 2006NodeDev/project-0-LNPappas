/*
    Middleware that allows us to 
    create a session. By configureing
    the session with a factory function
    which is returned in the form of
    (req, res, next). After the session
    is next() can be called to move onto
    the next() piece of middleware in that
    session.

    Uses built in module crypto to create
    unique sha1 hash for sessionConfig.secret.
*/

import session, { SessionOptions } from "express-session";

// use date and random # to create a sha1 hash
let currentDate:string = (new Date()).valueOf().toString(); // gets current date, converts to string
let random = Math.random().toString(); // gets random number, converts to string
var crypto = require('crypto'); // includes crypto module in application
let hash = crypto.createHash('sha1').update(currentDate + random).digest('hex'); // makes sha1 hash in hex with date & random #

const sessionConfig:SessionOptions = {
    secret: hash,
    cookie:{
        secure:false
    },
    resave:false,
    saveUninitialized:false
}

export const sessionMiddleware = session(sessionConfig);