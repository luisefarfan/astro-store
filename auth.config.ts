// import GitHub from '@auth/core/providers/github';
import { defineConfig } from 'auth-astro';
import Credentials from '@auth/core/providers/credentials';
import { db, eq, User } from 'astro:db';
import bcrypt from 'bcryptjs'
import type { AdapterUser } from '@auth/core/adapters';

export default defineConfig({
  providers: [
    // GitHub({
    //   clientId: import.meta.env.GITHUB_CLIENT_ID,
    //   clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    // }),
    Credentials({
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async ({ email, password }) => {
        const [user] = await db.select().from(User).where(eq(User.email, email as string))

        if (!user) {
          throw new Error('User not found')
        }

        if (!bcrypt.compareSync(password as string, user.password)) {
          throw new Error('Invalid password')
        }

        // Remove password from user object
        const { password: _, ...rest } = user
        return { ...rest }
      }
    })
  ],
  callbacks: {
    // Default behavior
    // jwt: ({ token }) => {
    //   return token
    // }
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user
      }

      return token
    },
    // Default behavior
    // session: ({session}) => {
    //   return session
    // }
    session: ({ session, token }) => {
      session.user = token.user as AdapterUser

      return session
    }
  }
});
