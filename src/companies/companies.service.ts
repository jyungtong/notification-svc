import { Injectable } from '@nestjs/common';

const companySubscriptions = {
  'comp-1': {
    unsubsribed_channels: ['EMAIL'],
  },
};

const companyData = {
  'comp-1': {
    company_name: 'ABC company',
  },
  'comp-2': {
    company_name: 'BIG company',
  },
};

@Injectable()
export class CompaniesService {
  find(companyId: string) {
    return companyData[companyId];
  }

  isChannelUnsubscribed(channel: string, companyId: string): boolean {
    return companySubscriptions[companyId]?.unsubsribed_channels.includes(
      channel,
    );
  }
}
