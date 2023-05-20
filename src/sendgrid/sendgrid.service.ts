import { Injectable } from '@nestjs/common';

@Injectable()
export class SendgridService {
  sendEmail(subject: string, content: string) {
    console.log('===send email', JSON.stringify({ subject, content }));
  }
}
