import express, { Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursment-author-router';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { InputError } from '../errors/InputError';

export const reimbursementRouter = express.Router();

reimbursementRouter.use('/status', reimbursementStatusRouter);
reimbursementRouter.use('/author/userId', reimbursementAuthorRouter);

/*
    Submit Reimbursement
    URL: /reimbursements
    Method: POST
    Request: The reimbursementId should be 0
    Response:
        Status Code 201 CREATED
        Reimbursement
*/
reimbursementRouter.post('/', authorizationMiddleware(['admin', 'finance-manager', 'user']), (req:Request, res:Response, next:NextFunction)=>{
    let {
        reimbursementId = 0,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type
    } = req.body
    if(reimbursementId && author && amount && dateSubmitted && dateResolved && description && resolver && status && type){
        reimbursements.push({reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type})
        res.status(201).send(reimbursements[reimbursements.length-1]);
    } else{
        console.log(`reimbursement id: ${reimbursementId}`)
        throw new InputError
    }
})

/*
    Update Reimbursement
    URL: /reimbursements
    Method: PATCH
    Allowed Roles: admin, finance-manager
    Request: The reimbursementId must be present as well 
        as all fields to update, any field left undefined 
        will not be updated. This can be used to approve 
        and deny.
    Response:
    Reimbursement
*/
reimbursementRouter.patch('/', authorizationMiddleware(['admin', 'finance-manager']), (req:Request, res:Response, next:NextFunction)=>{
    let id = req.body.reimbursementId;
    if(!id){
        throw InputError
    }else if(isNaN(+id)){
        res.status(400).send("Reimbursement Id must be a number");
    }else{
        let found = false;
        for(const reimbursement of reimbursements){
            if(reimbursement.reimbursementId === +id){
                let author = req.body.author;
                let amount = req.body.amount;
                let dateSubmitted = req.body.dateSubmitted;
                let dateResolved = req.body.dateResolved;
                let description = req.body.description;
                let resolver = req.body.resolver;
                let status = req.body.status;
                let type = req.body.type;

                if(author){
                    reimbursement.author = author;
                }
                if(amount){
                    reimbursement.amount = amount;
                }
                if(dateSubmitted){
                    reimbursement.dateSubmitted = dateSubmitted;
                }
                if(dateResolved){
                    reimbursement.dateResolved = dateResolved;
                }
                if(description){
                    reimbursement.description = description;
                }
                if (resolver){
                    reimbursement.resolver = resolver;
                }
                if (status){
                    reimbursement.status = status;
                }
                if (type){
                    reimbursement.type = type;
                }

                res.json(reimbursement);
                found = true;
            }
        }
        if(!found){
            res.status(404).send('Reimbursment not found')
        }
    }
})

export let reimbursements:Reimbursement[] = [
    {
        reimbursementId:1,
        author:1,
        amount:36.08,
        dateSubmitted:2008,
        dateResolved:2008,
        description:"Bought office supplies",
        resolver:2,
        status:2,
        type:2,
    },
    {
        reimbursementId:2,
        author:3,
        amount:2600.57,
        dateSubmitted:2019,
        dateResolved:2020,
        description:"Bought computer",
        resolver:2,
        status:2,
        type:2,
    },
    {
        reimbursementId:3,
        author:3,
        amount:260000000.07,
        dateSubmitted:2020,
        dateResolved:2020,
        description:"Bought spaceship",
        resolver:2,
        status:3,
        type:2,
    },
    {
        reimbursementId:4,
        author:1,
        amount:2.07,
        dateSubmitted:2015,
        dateResolved:2020,
        description:"Bought pen",
        resolver:2,
        status:2,
        type:2,
    }
];

/*
{
    "reimbursementId":"0",
    "author":"1",
    "amount":"900",
    "dateSubmitted":"2.29.2015",
    "dateResolved":"2016",
    "description":"New Shoes",
    "resolver":"2",
    "status":"2",
    "type":"2",
}

*/