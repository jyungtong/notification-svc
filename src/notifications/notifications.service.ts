import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { PostNotificationDto } from 'src/notifications/dto/post-notification.dto';
import { NotificationType } from './interfaces/notification-type.interface';
import { Channel } from 'src/channels/abstract/Channel.base';
import { EmailService } from 'src/channels/email.service';
import { UIService } from 'src/channels/ui.service';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
const mustache = require('mustache');

@Injectable()
export class NotificationsService {
  private readonly channelRunners: Record<string, Channel>;

  constructor(
    @Inject('NOTIFICATION_TYPE_MODEL')
    private notificationTypeModel: Model<NotificationType>,
    private readonly emailService: EmailService,
    private readonly uiService: UIService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {
    this.channelRunners = {
      EMAIL: this.emailService,
      UI: this.uiService,
    };
  }

  async getNotifications({
    channel_type,
    user_id,
  }: {
    channel_type: string;
    user_id: string;
  }): Promise<any> {
    const results = await this.channelRunners[channel_type].getNotifications(
      user_id,
    );
    return results;
  }

  async postNotifications(body: PostNotificationDto): Promise<void> {
    const {
      user_id: userId,
      company_id: companyId,
      notification_type: notificationType,
    } = body;

    const user = this.usersService.find(userId);
    const company = this.companiesService.find(companyId);
    const foundNotificationType = await this.notificationTypeModel
      .findOne({ type: notificationType })
      .exec();

    const { channels, template } = foundNotificationType;

    const subject = this.renderTemplate(template.subject, {
      ...user,
      ...company,
    });
    const content = this.renderTemplate(template.content, {
      ...user,
      ...company,
    });

    const runnerPromises = channels.map((channel) => {
      return this.channelRunners[channel].send(userId, companyId, {
        subject,
        content,
      });
    });

    await Promise.all(runnerPromises);
  }

  private renderTemplate(templateString: string, data): string {
    return mustache.render(templateString, data);
  }
}
