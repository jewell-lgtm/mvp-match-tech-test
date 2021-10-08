export type UserRole = 'seller' | 'buyer';

export class User {
  // Implement user model with username, password, deposit and role fields
  username: string;
  password: string; // todo: don't store passwords in database
  deposit: number;
  role: UserRole;
}
