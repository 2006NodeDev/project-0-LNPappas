
import express, { Request, Response, NextFunction, response } from 'express';
import { authenticationMiddleware } from '../middleware/authentication-middleware';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getAllUsers, getUsersById, updateOneUser } from '../dao/user-dao';

export const userRouter = express.Router();

userRouter.use(authenticationMiddleware); // authenticates user

/*
    Find User
        URL: /users
        Method: GET
        Allowed Roles: admin, finance-manager
        Response: User
*/

userRouter.get('/', authorizationMiddleware(['admin']), async (req:Request, res:Response, next:NextFunction)=>{
    try {
        let allUsers = await getAllUsers();
        res.json(allUsers);
    } catch (error) {
        next(error);
    }
})

/*
    Find User By ID
        URL: /users/:id
        Method: GET
        Allowed Roles: admin, finance-manager
        Response: User
*/
userRouter.get('/:id', authorizationMiddleware (['admin', 'finance-manager']), async (req:Request, res:Response, next:NextFunction)=>{
    let {id} = req.params;
    if(isNaN(+id)){
        res.status(400).send("ID must be a number");
    } else{
        try {
            let user = await getUsersById(+id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
})

/*
    Update User
        URL: /users
        Method: PATCH
        Allowed Roles: admin

        Request: The userId must be presen as well 
                as all fields to update, any field left 
                undefined will not be updated
        Response: User
*/
userRouter.patch('/', authorizationMiddleware(['admin']), async (req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.body;
    if(!userId){
        throw response.status(404).send('User not found')
    }else if(isNaN(+userId)){
        res.status(400).send("User Id must be a number");
    }else{
        try {
            let user = await getUsersById(+userId);
            // res.json(user);
            if(req.body.username){
                user.username = req.body.username;
            }
            if(req.body.password){
                user.password = req.body.password;
            }
            if(req.body.firstName){
                user.firstName = req.body.firstName;
            }
            if(req.body.lastName){
                user.lastName = req.body.lastName;
            }
            if(req.body.email){
                user.email = req.body.email;
            }
            if (req.body.role){
                user.role.roleId = req.body.role.roleId;
            }

            let updatedUser = await updateOneUser(user);
            res.json(updatedUser);

        } catch (error) {
            next(error);
        }
    }
})
