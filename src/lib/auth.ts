import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuth 타입 확장
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

// 사용자 데이터베이스를 시뮬레이션합니다 (실제 환경에서는 DB를 사용해야 합니다)
const users = [
  {
    id: "1",
    name: "사용자",
    email: "user@example.com",
    password: "password123", // 실제로는 해시된 비밀번호를 사용해야 합니다
    role: "admin", // 관리자 역할 추가
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "이메일/비밀번호",
      credentials: {
        email: { label: "이메일", type: "email", placeholder: "이메일 주소 입력" },
        password: { label: "비밀번호", type: "password", placeholder: "비밀번호 입력" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 실제 환경에서는 여기서 데이터베이스 쿼리를 수행합니다
        const user = users.find(user => user.email === credentials.email);

        if (!user || user.password !== credentials.password) {
          return null;
        }

        // 비밀번호는 클라이언트에 노출되지 않도록 제외합니다
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // 역할 정보 추가
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // JWT 토큰에 역할 정보 추가
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role as string; // 세션에 역할 정보 추가
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "비밀키는_환경변수에서_로드되어야_합니다",
}; 