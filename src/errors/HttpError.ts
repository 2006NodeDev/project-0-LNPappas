/*
    An abstract class: the base for all errors
    recieves a status code and optional message
    runs Error constructor with given message
    sets status code to given statusCode param

*/

export abstract class HttpError extends Error{
    statusCode:number
    constructor(statusCode:number, message?:string){
        super(message);
        this.statusCode = statusCode;
    }
}