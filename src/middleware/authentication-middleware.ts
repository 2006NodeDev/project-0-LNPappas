/* 
    Middleware for a session request
    to validate the user is authenticated

    throws AuthenticationFailureError if 
    username/password are invalid
*/

import { Request, Response, NextFunction } from "express";
import { AuthenticationFailureError } from "../errors/AuthenticationFailureError"
 
export function authenticationMiddleware(req:Request, res:Response, next:NextFunction){
    if(!req.session.user){
        throw new AuthenticationFailureError();
    } else{
        console.log(`User: ${req.session.user.username}, Role: ${req.session.user.role}`);
        next();
    }
}