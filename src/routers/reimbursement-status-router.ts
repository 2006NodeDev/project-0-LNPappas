import express, { Request, Response, NextFunction } from 'express';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { reimbursements } from './reimbursement-router';
import { Reimbursement } from '../models/Reimbursement';

export const reimbursementStatusRouter = express.Router();

/*
    Find Reimbursements By Status 
        ordered by date
        URL: /reimbursements/status/:statusId
        Alt: /reimbursements/status/:statudId/date-submitted?start=:startDate&end=:endDate
        Method: GET
        Authorization: finance-manager, admin
        Response:[ Reimbursement ]
*/
reimbursementStatusRouter.get('/:statusId', authorizationMiddleware(['admin', 'finance-manager']), (req:Request, res:Response, next:NextFunction)=>{
    let{statusId} = req.params;
    let reimbursement_list:Reimbursement[] = [];
    if(isNaN(+statusId)){
        res.status(400).send("StatusId must be a number")
    } else{
        let found = false;
        for(const reimbursement of reimbursements){
            
            if(reimbursement.status === +statusId){
                reimbursement_list.push(reimbursement);
                found = true;
            }
        }
        if(!found){
            res.status(404).send('Status not found')
        } else{
            res.json(reimbursement_list);
        }
    }
})