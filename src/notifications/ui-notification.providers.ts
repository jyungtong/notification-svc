import { Mongoose } from 'mongoose';
import { UINotification } from './schemas/ui-notification.schema';

export const uiNotificationProviders = [
  {
    provide: 'UI_NOTIFICATION_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('UINotification', UINotification),
    inject: ['DATABASE_CONNECTION'],
  },
];
