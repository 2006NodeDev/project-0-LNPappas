/*
    Middleware for a session request
    to validate the user is authorized

    throws AuthorizationFailureError if 
    user does not have valid permissions
*/

import { Request, Response, NextFunction } from "express";
import { AuthorizationFailureError } from "../errors/AuthorizationFailureError";

export function authorizationMiddleware(roles:string[]){
    return (req:Request, res:Response, next:NextFunction)=>{
        let allowed = false; //throws error if allowed is false & session request fails
        // for of loop because array
        for(const role of roles){
            console.log(`User role: ${req.session.user.role.role}, role array: ${role}`);
            if(req.session.user.role.role === role){
                allowed = true
                next()
                break;
            }else if (role === 'current'){
                let id = req.url.substring(1);
                console.log(`User Session id: ${req.session.user.userId}, User req id: ${id}`);
                if(req.session.user.userId == id){
                    console.log(true);
                    allowed = true
                    next()
                    break;
                }
            }
        }
        if(!allowed){
            throw new AuthorizationFailureError(); // user unauthorized, throw error
        }
    }
}