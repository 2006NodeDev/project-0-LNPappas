import express, { Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { reimbursements } from './reimbursement-router';

export const reimbursementAuthorRouter = express.Router();

/*
    Find Reimbursements By User, ordered by date
    URL: /reimbursements/author/userId/:userId
    Alt: /reimbursements/author/userId/:userId/date-submitted?start=:startDate&end=:endDate
    Method: GET
    Allowed Roles: admin, finance-manager, userId of user
    Response:[ Reimbursement ]
*/

reimbursementAuthorRouter.get('/:userId', authorizationMiddleware(['admin', 'finance-manager', 'current']), (req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params;

    if(isNaN(+userId)){
        res.status(400).send("userId must be a number")
    }else {
        let found = false;
        let reimbursement_list:Reimbursement[] = [];
        for (const reimbursement of reimbursements){
            console.log(`userId: ${userId} reimbursement author ${reimbursement.author}`);
            if (reimbursement.author === +userId){
                reimbursement_list.push(reimbursement);
                found = true;
            }
        }
            if(found){
                res.json(reimbursement_list);
            } else {
                res.status(404).send("Reimbursement not found")

            }
    }
})