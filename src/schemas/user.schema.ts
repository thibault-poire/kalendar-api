import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ required: true, unique: true })
  mail: string;

  @Prop({ default: false })
  is_verified?: boolean;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token?: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  activation_token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
