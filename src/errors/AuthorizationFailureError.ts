/*
    Error for Authorization Failure
    extends HttpError abstract class
    calls HttpError constructor with 
    statusCode and message as params 

    This error is thrown if the user
    does not have the correct access
    persmissions
*/

import { HttpError } from "./HttpError";

export class AuthorizationFailureError extends HttpError{
    constructor(){
        super(401, "The incoming token has expired");
    }
}