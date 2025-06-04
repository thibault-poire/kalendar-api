import { IsNotEmpty } from 'class-validator';

export class AccountActivationDto {
  @IsNotEmpty()
  token: string;
}
