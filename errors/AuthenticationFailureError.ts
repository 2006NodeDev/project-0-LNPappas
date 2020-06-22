/*
    Error for Authentication Failure
    extends HttpError abstract class
    calls HttpError constructor with 
    statusCode and message as params 

    This error is thrown if the user
    name and/or password is not valid
*/

import { HttpError } from "./HttpError";

export class AuthenticationFailureError extends HttpError{
    constructor(){
        super(400, "Invalid Credentials");
    }
}