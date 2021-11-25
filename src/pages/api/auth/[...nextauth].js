import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "@/libs/prisma";
import { compare } from "bcrypt";

const options = {
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const result = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        //Not found - send error res
        if (!result) {
          await prisma.$disconnect();
          throw new Error("No user found with the email !");
        }
        //Check hased password with DB password
        const checkPassword = await compare(
          credentials.password,
          result.password
        );
        //Incorrect password - send response
        if (!checkPassword) {
          await prisma.$disconnect();
          throw new Error("Password is wrong !");
        }
        //Else send success response
        await prisma.$disconnect();
        return { email: result.email };
      },
    }),

    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    error: "/auth/signin",
    verifyRequest: "/auth/verify-account",
    signIn: "/auth/signin",
  },
};

const authHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
