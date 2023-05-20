import { Document } from 'mongoose';

export interface UINotification extends Document {
  readonly content: string;
  user_id: string;
  company_id: string;
}
