import express, { Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursment-author-router';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { InputError } from '../errors/InputError';
import { saveOneReimbursement, getReimbursementsById } from '../dao/rembursement-dao';

export const reimbursementRouter = express.Router();

reimbursementRouter.use('/status', reimbursementStatusRouter);
reimbursementRouter.use('/author/userId', reimbursementAuthorRouter);

/*
    Submit Reimbursement
        URL: /reimbursements
        Method: POST
        Request: The reimbursementId should be 0
        Allowed Roles: admin, finance-manager, user
        Response:
            Status Code 201 CREATED
            Reimbursement
*/
reimbursementRouter.post('/', authorizationMiddleware(['admin', 'finance-manager', 'user']), async (req:Request, res:Response, next:NextFunction)=>{
    let {
        author,
        amount,
        dateSubmitted,
        description,
        type
    } = req.body
    if(!author || !amount || !dateSubmitted || !description || !type){
        next(InputError)
    } 

    let newReimbursement:Reimbursement = {
        reimbursementId:0,
        author,
        amount,
        dateSubmitted,
        dateResolved:null,
        description,
        resolver:null,
        status:1,
        type
    }

    try {
        let savedReimbursement = await saveOneReimbursement(newReimbursement);
        res.json(savedReimbursement);
    } catch (error) {
        next(error);
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
        Response: Reimbursement
*/
reimbursementRouter.patch('/', authorizationMiddleware(['admin', 'finance-manager']), async (req:Request, res:Response, next:NextFunction)=>{
    let {reimbursementId} = req.body;
    if(!reimbursementId){
        throw InputError
    }else if(isNaN(+reimbursementId)){
        res.status(400).send("Reimbursement Id must be a number");
    }else{
        try{
            let reimbursement = await getReimbursementsById(+reimbursementId);
            if(req.body.author){
                reimbursement.author = req.body.author;
            }
            if(req.body.amount){
                reimbursement.amount = req.body.amount;
            }
            if(req.body.dateSubmitted){
                reimbursement.dateSubmitted = req.body.dateSubmitted;
            }
            if(req.body.dateResolved){
                reimbursement.dateResolved = req.body.dateResolved;
            }
            if(req.body.description){
                reimbursement.description = req.body.description;
            }
            if (req.body.resolver){
                reimbursement.resolver = req.body.resolver;
            }
            if (req.body.status){
                reimbursement.status = req.body.status;
            }
            if (req.body.type){
                reimbursement.type = req.body.type;
            }
        }catch(error){
            next(error)
        }
    }
});