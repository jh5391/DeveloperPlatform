"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <p>로딩 중...</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          로그아웃
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>환영합니다!</h2>
          <div className={styles.userInfo}>
            <p>
              <strong>이름:</strong> {session?.user?.name || "사용자"}
            </p>
            <p>
              <strong>이메일:</strong> {session?.user?.email}
            </p>
          </div>
          <p className={styles.message}>
            성공적으로 인증되었습니다. 이것은 인증이 필요한 보호된 페이지입니다.
          </p>
        </div>
      </div>
    </div>
  );
} 