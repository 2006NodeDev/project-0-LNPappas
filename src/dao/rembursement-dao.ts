import { Reimbursement } from "../models/Reimbursement";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { ReimbursementDTOtoReimbursementConverter } from "../util/ReimbursementDTO-to-Reimbursement-converter";

export async function getAllReimbursements():Promise<Reimbursement[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select r.*, rs.status, rs."status_id", rt."type", rt."type_id" from ers.reimbursement r
                                                        join ers.reimbursement_status rs on r.status = rs.status_id
                                                        join ers.reimbursement_type rt on r."type" = rt.type_id
                                                        order by r.date_submitted;`);       
        if (results.rowCount === 0){
            throw new Error('No Reimbursements Found');
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (error) {
        if (error.message === "No Reimbursements Found"){
            console.log(error);
            throw new Error(error.message);
        }
        throw new Error('Unknown Error');
    } finally {
        client && client.release();
    }
}

export async function getReimbursementsById(id:number):Promise<Reimbursement>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select r.*, rs.status, rs."status_id", rt."type", rt."type_id" from ers.reimbursement r
                                                        join ers.reimbursement_status rs on r.status = rs.status_id
                                                        join ers.reimbursement_type rt on r."type" = rt.type_id
                                                        where r.reimbursement_id = $1;`, [id]);
        return ReimbursementDTOtoReimbursementConverter(results.rows[0]);
    } catch (error) {
        if (error.message === "Reimbursement Not Found"){
            console.log(error);
            throw new Error(`The Reimbursement was ${error.message}`);
        }
        throw new Error('Unknown Error');
    } finally {
        client && client.release();
    }
}

export async function saveOneReimbursement(newReimbursement:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query(`insert into ers.reimbursement ("author",
                                            "amount","date_submitted","description","status","type")
                                            values($1,$2,$3,$4,$5,$6) returning "reimbursement_id" `,
                                            [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted, 
                                            newReimbursement.description, 1, newReimbursement.type.typeId]);
        newReimbursement.reimbursementId = results.rows[0].reimbursement_id
        console.log("New Id: ", newReimbursement.reimbursementId)
        return newReimbursement
    }catch(e){
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}

export async function updateOneReimbursement(updatedReimbursement:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        await client.query(`update ers.reimbursement as r
                                set "author"=$1, "amount"=$2, "date_submitted"=$3, "date_resolved"=$4, "description"=$5, 
                                "resolver"=$6, "status"=$7, "type"=$8
                                where r."reimbursement_id"=$9 returning "reimbursement_id"`,
                                [updatedReimbursement.author, updatedReimbursement.amount, updatedReimbursement.dateSubmitted,
                                updatedReimbursement.dateResolved, updatedReimbursement.description, updatedReimbursement.resolver,
                                updatedReimbursement.status.statusId, updatedReimbursement.type.typeId, updatedReimbursement.reimbursementId]);
        
        return getReimbursementsById(updatedReimbursement.reimbursementId);
    }catch(e){
        console.log(e)
        throw new Error('Update Error Occured')
    }finally{
        client && client.release();
    }
}