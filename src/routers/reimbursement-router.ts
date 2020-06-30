import express, { Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursment-author-router';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { InputError } from '../errors/InputError';
import { saveOneReimbursement, getReimbursementsById, getAllReimbursements, updateOneReimbursement } from '../dao/rembursement-dao';

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
        description,
        dateSubmitted,
        type
    } = req.body
    if(!author || !amount || !description || !dateSubmitted || !type){
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
        status:{statusId:1, status:'processing'},
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
                reimbursement.dateResolved = req.body.dateSubmitted;
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
                reimbursement.status.statusId = req.body.status.statusId;
            }
            if (req.body.type){
                reimbursement.type.typeId = req.body.type.typeId;
            }
            let updatedReimbursement = await updateOneReimbursement(reimbursement);
            res.json(updatedReimbursement);
        }catch(error){
            next(error)
        }
    }
});

reimbursementRouter.get('/', authorizationMiddleware(['admin', 'finance-manager']), async (req:Request ,res:Response, next:NextFunction)=>{
    try {
        let allReimbursments = await getAllReimbursements();
        res.json(allReimbursments);
    } catch (error) {
        next(error);
    }
})

reimbursementRouter.get('/:id', authorizationMiddleware(['admin', 'finance-manager']), async (req:Request, res:Response, next:NextFunction)=>{
    let {id} = req.params;
    if(isNaN(+id)){
        res.status(400).send("ID must be a number");
    } else{
        try {
            let user = await getReimbursementsById(+id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
})