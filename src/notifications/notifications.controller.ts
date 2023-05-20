import { Request, Response } from 'express';
import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PostNotificationDto } from 'src/notifications/dto/post-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async postNotifications(
    @Res() res: Response,
    @Body() postNotificationDto: PostNotificationDto,
  ): Promise<Response> {
    await this.notificationsService.postNotifications(postNotificationDto);

    return res.json({ message: 'OK' });
  }

  @Get()
  async getNotifications(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const { channel_type: channelType, user_id: userId } = req.query as {
      channel_type: string;
      user_id: string;
    };
    const results = await this.notificationsService.getNotifications({
      channel_type: channelType,
      user_id: userId,
    });
    return res.json({ data: results });
  }
}
