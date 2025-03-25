import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Next.js App Router의 API 라우트 핸들러
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 