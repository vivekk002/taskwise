import NextAuth from "next-auth";
import type { NextAuthOptions, User, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "name@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        const userRecord = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userRecord) {
          throw new Error("Invalid email or password");
        }

        if (!userRecord.emailVerified) {
          throw new Error("EmailNotVerified");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          userRecord.password
        );
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: userRecord.id,
          email: userRecord.email,
          name: userRecord.name ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
