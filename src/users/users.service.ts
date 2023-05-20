import { Injectable } from '@nestjs/common';

const userSubscriptions = {
  'user-1': {
    unsubsribed_channels: ['EMAIL'],
  },
  'user-2': {
    unsubsribed_channels: [],
  },
};

const userData = {
  'user-1': {
    first_name: 'john doe',
  },
  'user-2': {
    first_name: 'lily',
  },
};

@Injectable()
export class UsersService {
  find(userId: string) {
    return userData[userId];
  }

  isChannelUnsubscribed(channel: string, userId: string): boolean {
    return userSubscriptions[userId]?.unsubsribed_channels.includes(channel);
  }
}
