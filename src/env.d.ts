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
