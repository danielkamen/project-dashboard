export interface PartnerData {
    id: number;
    name: string;
    logoUrl: string;
    description: string;
    active: boolean;
    repoPath: string;
    lastUpdated: string;
    updatedBy: string;
  }
  
  export interface UserData {
    id: number;
    name: string;
    email: string;
    password: string;
  }
  