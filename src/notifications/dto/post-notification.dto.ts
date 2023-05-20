type NotificationType =
  | 'leave-balance-reminder'
  | 'monthly-payslip'
  | 'happy-birthday';

export class PostNotificationDto {
  notification_type: NotificationType;

  company_id: string;

  user_id: string;
}
