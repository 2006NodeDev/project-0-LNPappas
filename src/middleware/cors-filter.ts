import { Request, Response, NextFunction } from "express";

export function corsFilter(req:Request, res:Response, next:NextFunction) {
    // bad hack in Access-Control-Allow-Origin, don't use.
    res.header('Access-Control-Allow-Origin', `${req.headers.origin}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.sendStatus(200) // sends back options pre-flight request
    } else{
        console.log("denied")
        next() // allows real requests to go to endpoint
    }
}