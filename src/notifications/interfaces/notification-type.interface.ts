import { Document } from 'mongoose';

export interface NotificationType extends Document {
  readonly type: string;
  readonly channels: string[];
  readonly template: {
    content: string;
    subject?: string;
  };
}
