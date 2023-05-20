export abstract class Channel {
  constructor(readonly CHANNEL_TYPE: string) {}

  abstract send(
    userId: string,
    companyId: string,
    payload: { content: string; subject?: string },
  ): Promise<void>;
  abstract getNotifications(userId: string): Promise<any>;
}
