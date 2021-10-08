export enum UserRole {
  seller = 'seller',
  buyer = 'buyer',
}

export class User {
  id: number;
  // Implement user model with username, password, deposit and role fields
  username: string;
  password: string; // todo: don't store passwords in database
  deposit: number;
  role: UserRole;
}
