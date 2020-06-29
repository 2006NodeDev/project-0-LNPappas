import express, { Request, Response, NextFunction } from 'express';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getReimbursementAuthorById } from '../dao/reimbursement-author-dao';

export const reimbursementAuthorRouter = express.Router();

/*
    Find Reimbursements By User
        ordered by date
        URL: /reimbursements/author/userId/:userId
        Alt: /reimbursements/author/userId/:userId/date-submitted?start=:startDate&end=:endDate
        Method: GET
        Allowed Roles: admin, finance-manager, current user if === userId
        Response:[ Reimbursement ]
*/

reimbursementAuthorRouter.get('/:userId', authorizationMiddleware(['admin', 'finance-manager', 'current']), async (req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params;

    if(isNaN(+userId)){
        res.status(400).send("userId must be a number")
    }else {
        try {
            let reimbursement = await getReimbursementAuthorById(+userId);
            res.json(reimbursement);
        } catch (error) {
            next(error);
        }
    }
});