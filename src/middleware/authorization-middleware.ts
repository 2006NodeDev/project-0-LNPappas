/*
    Middleware for a session request
    to validate the user is authorized

    throws AuthorizationFailureError if 
    user does not have valid permissions
*/

import { Request, Response, NextFunction } from "express";
import { AuthorizationFailureError } from "../errors/AuthorizationFailureError";
import { users } from "../routers/user-router";

export function authorizationMiddleware(roles:string[]){
    return (req:Request, res:Response, next:NextFunction)=>{
        let allowed = false; //throws error if allowed is false & session request fails
        
        // for of loop because array
        for(const user of users){
            if(req.session.user.role.role === user.role.role){
                
                allowed = true;
                console.log(`role: ${user.role.role}, input role:${req.session.user.role.role}`);
                
                next(); //calls next piece of middleware
            }
        }
        if(!allowed){
            throw new AuthorizationFailureError(); // user unauthorized, throw error
        }
    }
}