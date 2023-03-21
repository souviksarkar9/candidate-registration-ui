import { Education } from "./education";
import { Employment } from "./employemnt";
import { Personal } from "./personal";
import { Photograph } from "./photograph";
import { Project } from "./project";

export class User {
    candidateId: string | undefined;
    username: string | undefined;
    name: string | undefined;    
    dob: string | undefined;
    password: string | undefined;
    education: Education[] | undefined;
    employment: Employment[] | undefined;
    personal: Personal[] | undefined;    
    photograph: Photograph[] | undefined;
    project: Project[] | undefined;
    token: string | undefined;
    
}


