/*
    # Expense Reimbursement System (ERS) API
    The Expense Reimbursement System (ERS) will manage 
    the process of reimbursing employees for expenses 
    incurred while on company time. All employees in the 
    company can login and submit requests for 
    reimbursement and view their past tickets and pending 
    requests. Finance managers can log in and view all 
    reimbursement requests and past history for all 
    employees in the company. Finance managers are 
    authorized to approve and deny requests for expense 
    reimbursement.
*/

/* 
    Start project by creating and installing necessary libraries: 
        npm init
        npm install express
        npm install -D typescript ts-node @types/express
        copy in tsconfig.json
        npm install express-session
        npm install -D @types/express-session nodemon
        in package.json: "main": "src/index.ts"
        in package.json scripts{ "start": "nodemon --exec ts-node src/index.ts", }
*/ 

import express, { Request, Response } from 'express';
import { sessionMiddleware } from './middleware/session-middleware';
import { AuthenticationFailureError } from './errors/AuthenticationFailureError';
import { userRouter, users } from './routers/user-router';
import { reimbursementRouter } from './routers/reimbursement-router';

// returns pre-build express app, must run first
const app = express();

// middleware: body-parser, only parses json
app.use(express.json());

// middleware: creates unique sessions 
app.use(sessionMiddleware);

app.use('/user', userRouter);
app.use('/reimbursements', reimbursementRouter);

// User login, validate authentication
app.post('/login', (req:Request, res:Response)=>{

    // get username and password from body of request
    let username = req.body.username;
    let password = req.body.password;

    // if username or password are empty throw error
    if(!username || !password){
        throw new AuthenticationFailureError();

    // if username & password are valid & found in database, request a session for the user & respond with the user info in json format
    } else{
        let found = false
        for(const user of users){
            // proper credetials result in unique session
            if(user.username === username && user.password === password){
                req.session.user = user;
                console.log("login successful");
                
                res.json(user);
                found = true;
            }
        }
        // if username & password not found it database throw an error
        if(!found){
            throw new AuthenticationFailureError();
        }

    }
})

/* start server on port 2006
 access through browser or postman
 http://localhost:2006 or http://127.0.0.1
*/
app.listen(2006, ()=> console.log('Server started...'));