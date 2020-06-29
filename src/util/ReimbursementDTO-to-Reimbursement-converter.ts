import { ReimbursementDTO } from "../dto/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConverter(dto: ReimbursementDTO): Reimbursement{
    return{
        reimbursementId: dto.reimbursement_id,
        author: dto.author,
        amount: dto.amount,
        dateSubmitted: dto.date_submitted, 
        dateResolved: dto.date_resolved, 
        description: dto.description, 
        resolver: dto.resolver, 
        status: dto.status_id,
        type: dto.type
    }
}