import { Test, TestingModule } from '@nestjs/testing';
import { UIService } from './ui.service';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

describe('UIService', () => {
  let service: UIService;
  const mockUsersService = {
    isChannelUnsubscribed: jest.fn(),
  };
  const mockCompaniesService = {
    isChannelUnsubscribed: jest.fn(),
  };
  const mockUiNotificationModel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UIService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
        {
          provide: 'UI_NOTIFICATION_MODEL',
          useValue: mockUiNotificationModel,
        },
      ],
    }).compile();

    service = module.get<UIService>(UIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    describe('when no unsubsribed', function () {
      beforeEach(function () {
        mockUsersService.isChannelUnsubscribed.mockReturnValueOnce(false);
        mockCompaniesService.isChannelUnsubscribed.mockReturnValueOnce(false);
      });

      it('should create ui notification', async () => {
        await service.send('user-1', 'comp-1', {
          content: 'test content',
          subject: 'test subject',
        });

        expect(mockUiNotificationModel.create).toHaveBeenCalled();
      });
    });

    describe('when has unsubsribed', function () {
      beforeEach(function () {
        mockUsersService.isChannelUnsubscribed.mockReturnValueOnce(true);
        mockCompaniesService.isChannelUnsubscribed.mockReturnValueOnce(false);
      });

      it('should create ui notification', async () => {
        await service.send('user-1', 'comp-1', {
          content: 'test content',
          subject: 'test subject',
        });

        expect(mockUiNotificationModel.create).not.toHaveBeenCalled();
      });
    });
  });
});
