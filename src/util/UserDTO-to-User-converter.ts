import { User } from "../models/User";
import { UserDTO } from "../dto/user-dto";
import { Role } from "../models/Role";

export function UserDTOtoUserConvertor( dto:UserDTO ):User{
    let role:Role = ({roleId:dto.role_id, role:dto.role});
    return {
        userId: dto.user_id,
        username: dto.username, 
        password: dto.password,
        firstName: dto.first_name,
        lastName: dto.last_name, 
        email: dto.email, 
        role
    }
}