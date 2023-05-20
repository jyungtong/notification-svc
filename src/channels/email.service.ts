import { Injectable } from '@nestjs/common';
import { Channel } from './abstract/Channel.base';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

@Injectable()
export class EmailService extends Channel {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly sendgridService: SendgridService,
  ) {
    super('EMAIL');
  }

  async send(userId: string, companyId: string, payload): Promise<void> {
    const isUserUnsubscribedChannel = this.usersService.isChannelUnsubscribed(
      this.CHANNEL_TYPE,
      userId,
    );
    const isCompanyUnsubscribedChannel =
      this.companiesService.isChannelUnsubscribed(this.CHANNEL_TYPE, companyId);

    if (!isUserUnsubscribedChannel && !isCompanyUnsubscribedChannel) {
      return this.sendgridService.sendEmail(payload.subject, payload.content);
    }

    console.log('====channel unsubsribed');
  }

  async getNotifications(userId: string): Promise<any> {
    return;
  }
}
