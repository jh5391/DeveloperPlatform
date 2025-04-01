"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          내부 개발자 플랫폼
        </h1>

        <div className={styles.grid}>
          {session ? (
            <Link href="/dashboard" className={styles.card}>
              <h2>대시보드 &rarr;</h2>
              <p>
                인증된 사용자만 접근할 수 있는 대시보드로 이동
              </p>
            </Link>
          ) : (
            <Link href="/login" className={styles.card}>
              <h2>로그인 &rarr;</h2>
              <p>
                계정에 로그인하여 시작하세요
              </p>
            </Link>
          )}
          
          <Link href="/api/hello" className={styles.card}>
            <h2>API 테스트 &rarr;</h2>
            <p>
              샘플 API 엔드포인트를 확인해보세요
            </p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
