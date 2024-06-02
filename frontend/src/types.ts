export interface PartnerData {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
  repoPath: string;
  active: boolean;
  lastUpdated: string;
  updatedBy: string;
  usersWorkingOnProject: string[];
  formattedUsersWorkingOnProject: string;
}

  
export interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
}
