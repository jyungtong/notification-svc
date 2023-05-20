import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { DatabaseModule } from './database/database.module';
import { notificationTypeProviders } from 'src/notifications/notification-type.providers';
import { uiNotificationProviders } from 'src/notifications/ui-notification.providers';
import { EmailService } from './channels/email.service';
import { UIService } from './channels/ui.service';
import { UsersService } from './users/users.service';
import { CompaniesService } from './companies/companies.service';
import { SendgridService } from './sendgrid/sendgrid.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, NotificationsController],
  providers: [
    ...notificationTypeProviders,
    ...uiNotificationProviders,
    AppService,
    NotificationsService,
    EmailService,
    UIService,
    UsersService,
    CompaniesService,
    SendgridService,
  ],
})
export class AppModule {}
