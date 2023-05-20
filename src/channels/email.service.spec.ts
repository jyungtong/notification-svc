import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

describe('EmailService', () => {
  let service: EmailService;
  const mockUsersService = {
    find: jest.fn(),
    isChannelUnsubscribed: jest.fn(),
  };
  const mockCompaniesService = {
    find: jest.fn(),
    isChannelUnsubscribed: jest.fn(),
  };
  const mockSendgridService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
        {
          provide: SendgridService,
          useValue: mockSendgridService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    beforeEach(function () {
      mockUsersService.find.mockResolvedValueOnce({
        first_name: 'john doe',
      });

      mockCompaniesService.find.mockResolvedValueOnce({
        company_name: 'ABC Company',
      });
    });
    describe('when no unsubsribed', function () {
      beforeEach(function () {
        mockUsersService.isChannelUnsubscribed.mockReturnValueOnce(false);
        mockCompaniesService.isChannelUnsubscribed.mockReturnValueOnce(false);
      });

      it('should send email', async () => {
        await service.send('user-1', 'comp-1', {
          content: 'test content',
          subject: 'test subject',
        });

        expect(mockSendgridService.sendEmail).toHaveBeenCalled();
      });
    });

    describe('when has unsubsribed', function () {
      beforeEach(function () {
        mockUsersService.isChannelUnsubscribed.mockReturnValueOnce(true);
        mockCompaniesService.isChannelUnsubscribed.mockReturnValueOnce(false);
      });

      it('should not send email', async () => {
        await service.send('user-1', 'comp-1', {
          content: 'test content',
          subject: 'test subject',
        });

        expect(mockSendgridService.sendEmail).not.toHaveBeenCalled();
      });
    });
  });
});
