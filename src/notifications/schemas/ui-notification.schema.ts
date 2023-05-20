import * as mongoose from 'mongoose';

export const UINotification = new mongoose.Schema({
  content: String,
  user_id: String,
  company_id: String,
});
