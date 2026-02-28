export type UserRole = 'admin' | 'advertiser' | 'viewer';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
