import * as mongoose from 'mongoose';

export const NotificationType = new mongoose.Schema({
  type: String,
  channels: [String],
  template: {
    content: String,
    subject: String,
  },
});
