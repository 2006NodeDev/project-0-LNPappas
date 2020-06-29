import { Reimbursement } from "../models/Reimbursement";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { ReimbursementDTOtoReimbursementConverter } from "../util/ReimbursementDTO-to-Reimbursement-converter";

export async function getReimbursementAuthorById(id:number):Promise<Reimbursement[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`sselect r.*, rs.status, rs."status_id", rt."type", rt."type_id" from ers.reimbursement r
                                                        join ers.reimbursement_status rs on r.status = rs.status_id
                                                        join ers.reimbursement_type rt on r."type" = rt.type_id
                                                        where r."author" = $1;`, [id]);
        if (results.rowCount === 0){
            throw new Error('No Reimbursements Found');
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
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