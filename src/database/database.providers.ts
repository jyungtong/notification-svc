import * as mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(MONGODB_URI || 'mongodb://test:test@localhost/'),
  },
];
