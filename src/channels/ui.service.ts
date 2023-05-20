import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Channel } from './abstract/Channel.base';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { UINotification } from 'src/notifications/interfaces/ui-notification.interface';

@Injectable()
export class UIService extends Channel {
  constructor(
    @Inject('UI_NOTIFICATION_MODEL')
    private readonly uiNotificationModel: Model<UINotification>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {
    super('UI');
  }

  async send(userId: string, companyId: string, payload): Promise<void> {
    const isUserUnsubscribedChannel = this.usersService.isChannelUnsubscribed(
      this.CHANNEL_TYPE,
      userId,
    );
    const isCompanyUnsubscribedChannel =
      this.companiesService.isChannelUnsubscribed(this.CHANNEL_TYPE, companyId);

    if (!isUserUnsubscribedChannel && !isCompanyUnsubscribedChannel) {
      await this.uiNotificationModel.create({
        content: payload.content,
        user_id: userId,
        company_id: companyId,
      });

      return console.log(
        `===sent to ${this.CHANNEL_TYPE} with ${JSON.stringify({
          content: payload.content,
        })}`,
      );
    }

    console.log('====channel unsubsribed');
  }

  async getNotifications(userId: string): Promise<any> {
    return this.uiNotificationModel.find({ user_id: userId });
  }
}
