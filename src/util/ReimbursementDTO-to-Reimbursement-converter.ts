import { ReimbursementDTO } from "../dto/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementStatus } from "../models/ReimbursementStatus";
import { ReimbursementType } from "../models/ReimbursementType";

export function ReimbursementDTOtoReimbursementConverter(dto: ReimbursementDTO): Reimbursement{
    let status:ReimbursementStatus = ({ statusId:dto.status_id, status:dto.status });
    let type:ReimbursementType = ({ typeId:dto.type_id, type:dto.type });

    return{
        reimbursementId: dto.reimbursement_id,
        author: dto.author,
        amount: dto.amount,
        dateSubmitted: dto.date_submitted, 
        dateResolved: dto.date_resolved, 
        description: dto.description, 
        resolver: dto.resolver, 
        status,
        type
    }
}