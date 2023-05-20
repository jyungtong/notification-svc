import { Mongoose } from 'mongoose';
import { NotificationType } from './schemas/notification-type.schema';

export const notificationTypeProviders = [
  {
    provide: 'NOTIFICATION_TYPE_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('NotificationType', NotificationType),
    inject: ['DATABASE_CONNECTION'],
  },
];
