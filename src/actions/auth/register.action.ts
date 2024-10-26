import { defineAction } from 'astro:actions';
import { db, eq, User } from 'astro:db';
import { z } from 'astro:schema';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs';

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  handler: async ({ name, email, password }, { cookies }) => {
    const existentUser = await db.select().from(User).where(eq(User.email, email))

    if (existentUser.length > 0) {
      throw new Error('User already exists');
    }

    await db.insert(User).values([{
      name,
      email,
      password: bcrypt.hashSync(password),
      id: UUID(),
      role: 'user'
    }])

    return { ok: true };
  },
});
