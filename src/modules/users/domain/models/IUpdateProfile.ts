export interface IUpdateProfile {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}
