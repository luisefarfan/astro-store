/// <reference path="../.astro/types.d.ts" />

interface User {
  email: string;
  name: string;
  role: string;
  id: string;
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean;
    user: User | null;
    isAdmin: boolean;
  }
}

interface ImportMetaEnv {
  readonly AUTH_TRUST_HOST: string;
  readonly AUTH_SECRET: string;
  readonly PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
