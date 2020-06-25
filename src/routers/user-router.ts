
import express, { Request, Response, NextFunction, response } from 'express';
import { User } from '../models/User'
import { authenticationMiddleware } from '../middleware/authentication-middleware';
import { authorizationMiddleware } from '../middleware/authorization-middleware';

export const userRouter = express.Router();

userRouter.use(authenticationMiddleware); // authenticates user

userRouter.get('/', authorizationMiddleware(['admin']), (req:Request, res:Response, next:NextFunction)=>{
    res.json(users); // respond to get request with user array if authorization === admin
})

/*
    Find Users
        URL: /users
        Method: GET
        Allowed Roles: admin, finance-manager
        Response: [ User ]
*/
userRouter.get('/:id', authorizationMiddleware(['admin', 'finance-manager']), (req:Request, res:Response, next:NextFunction)=>{
    let {id} = req.params;
    if(isNaN(+id)){
        res.status(400).send("ID must be a number");
    } else{
        let found = false;
        for(const user of users){
            if(user.userId === +id){
                res.json(user);
                found = true;
            }
        }
        if(!found){
            res.status(404).send('User not found')
        }
    }
})

/*
    Find Reimbursements By Status 
        order by date
        URL: /reimbursements/status/:statusId
        Alt: /reimbursements/status/:statudId/date-submitted?start=:startDate&end=:endDate
        Method: GET
        Allowed Roles: admin, finance-manager
        Response: [ Reimbursement ]
*/
userRouter.patch('/', authorizationMiddleware(['admin']), (req:Request, res:Response, next:NextFunction)=>{
    let id = req.body.userId;

    if(!id){
        throw response.status(404).send('User not found')
    }else if(isNaN(+id)){
        res.status(400).send("User Id must be a number");
    }else{
        let found = false;
        for(const user of users){
            if(user.userId === +id){

                let username = req.body.username;
                let password = req.body.password;
                let firstName = req.body.firstName;
                let lastName = req.body.lastName;
                let email = req.body.email;
                let role = req.body.role;

                if(username){
                    user.username = username;
                }
                if(password){
                    user.password = password;
                }
                if(firstName){
                    user.firstName = firstName;
                }
                if(lastName){
                    user.lastName = lastName;
                }
                if(email){
                    user.email = email;
                }
                if (role){
                    user.role = role;
                }

                res.json(user);
                found = true;
            }
        }
        if(!found){
            res.status(404).send('User not found')
        }
    }

})

export let users:User[] = [
    {
        userId:1,
        username:'TheSpy',
        password:'password',
        firstName:'Harriet',
        lastName:'Daniels',
        email:'TheSpy@amin.com',
        role:{
            roleId: 1,
            role: "admin"
        },
    },
    {
        userId:2,
        username:'Wilber',
        password:'password',
        firstName:'Charlotte',
        lastName:'Web',
        email:'Wilber@financeManager.com',
        role:{
            roleId: 2,
            role: "finance-manager"
        },
    },
    {
        userId:3,
        username:'Bucks',
        password:'password',
        firstName:'Barry',
        lastName:'Carbuckle',
        email:'BCarBucks@user.com',
        role:{
            roleId: 3,
            role: "user"
        },
    },
]


/* json format for post tests:

    {
        "userId":"2",
        "username":"Wilber",
        "password":"password",
        "firstName":"Charlotte",
        "lastName":"Web",
        "email":"Wilber@financeManager.com",
        "role":{
            "roleId": "2",
            "role": "finanace-manager"
        }
    }

User login:
{
    "username":"Bucks",
    "password":"password"
}
Admin login:
{
    "username":"TheSpy",
    "password":"password"
}
Financial Login:
{
    "username":"Wilber",
    "password":"password"
}

*/