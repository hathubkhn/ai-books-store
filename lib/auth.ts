import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          console.error("Admin credentials not configured");
          return null;
        }

        if (credentials.email !== adminEmail) {
          return null;
        }

        // For demo, if password hash is not a bcrypt hash, do simple comparison
        let isValid = false;
        if (
          adminPasswordHash.startsWith("$2b$") ||
          adminPasswordHash.startsWith("$2a$")
        ) {
          isValid = await bcrypt.compare(
            credentials.password as string,
            adminPasswordHash
          );
        } else {
          // Fallback for demo (not recommended for production)
          isValid = credentials.password === adminPasswordHash;
        }

        if (!isValid) {
          return null;
        }

        return {
          id: "1",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
