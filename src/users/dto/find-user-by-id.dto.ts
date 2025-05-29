import { IsMongoId } from 'class-validator';

export class FindUserByIdDto {
  @IsMongoId()
  user_id: string;
}
