import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { EmailService } from 'src/channels/email.service';
import { UIService } from 'src/channels/ui.service';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { DatabaseModule } from 'src/database/database.module';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const mockNotificationTypeModel = {
    findOne: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };
  const mockEmailService = {
    send: jest.fn(),
  };
  const mockUIService = {
    send: jest.fn(),
    getNotifications: jest.fn(),
  };
  const mockUsersService = {
    find: jest.fn(),
    isChannelUnsubscribed: jest.fn(),
  };
  const mockCompaniesService = {
    find: jest.fn(),
    isChannelUnsubscribed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        NotificationsService,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: UIService,
          useValue: mockUIService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
        {
          provide: 'NOTIFICATION_TYPE_MODEL',
          useValue: mockNotificationTypeModel,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);

    mockUsersService.find.mockResolvedValueOnce({
      first_name: 'john doe',
    });

    mockCompaniesService.find.mockResolvedValueOnce({
      company_name: 'ABC Company',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should get notifications', async () => {
      const returnBody = [
        {
          _id: '1',
          user_id: 'user-2',
          company_id: 'comp-1',
        },
      ];
      mockUIService.getNotifications.mockResolvedValueOnce(returnBody);

      const results = await service.getNotifications({
        channel_type: 'UI',
        user_id: 'user-2',
      });

      expect(results).toMatchObject(returnBody);
    });
  });

  describe('postNotifications', () => {
    describe('when using channel EMAIL', () => {
      beforeEach(() => {
        mockNotificationTypeModel.exec.mockResolvedValueOnce({
          channels: ['EMAIL'],
          template: {
            subject: 'test {{first_name}}',
            content: 'test {{company_name}}',
          },
        });
      });

      it('then should call only email service', async () => {
        await service.postNotifications({
          notification_type: 'happy-birthday',
          user_id: 'user-1',
          company_id: 'comp-1',
        });

        expect(mockEmailService.send).toHaveBeenCalled();
        expect(mockUIService.send).not.toHaveBeenCalled();
      });
    });

    describe('when using channels EMAIL and UI', () => {
      beforeEach(() => {
        mockNotificationTypeModel.exec.mockResolvedValueOnce({
          channels: ['EMAIL', 'UI'],
          template: {
            subject: 'test {{first_name}}',
            content: 'test {{company_name}}',
          },
        });
      });

      it('then should call email and ui service', async () => {
        await service.postNotifications({
          notification_type: 'happy-birthday',
          user_id: 'user-1',
          company_id: 'comp-1',
        });

        expect(mockEmailService.send).toHaveBeenCalled();
        expect(mockUIService.send).toHaveBeenCalled();
      });
    });
  });
});
