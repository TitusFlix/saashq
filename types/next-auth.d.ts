/* eslint-disable no-unused-vars */
import type { User } from 'next-auth';
import type { SupportLanguageDict } from '@/dictionaries';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId;
      _id: UserId;
      avatar?: string | null | undefined;
      isAdmin: boolean;
      userLanguage: SupportLanguageDict;
      userStatus: string;
    };
  }
}
