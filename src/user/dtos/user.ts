import { Expose, Exclude } from 'class-transformer';

export class UserDTO {
  @Expose()
  user_id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;
}
