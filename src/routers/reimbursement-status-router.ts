import express, { Request, Response, NextFunction } from 'express';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getReimbursementStatusById } from '../dao/reimbursement-status-dao';

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
reimbursementStatusRouter.get('/:statusId', authorizationMiddleware(['admin', 'finance-manager', 'current']), async (req:Request, res:Response, next:NextFunction)=>{
    let{statusId} = req.params;
    if(isNaN(+statusId)){
        res.status(400).send("StatusId must be a number")
    } else{
        try {
            let reimbursement = await getReimbursementStatusById(+statusId);
            res.json(reimbursement);
        } catch (error) {
            next(error);
        }
    }
})