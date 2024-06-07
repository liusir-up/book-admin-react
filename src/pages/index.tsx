import styles from "@/styles/Home.module.css";
import { Button } from "antd";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/book");
    }, 3000)
  }, []);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            router.push("/book");
          }}>
          欢迎使用图书管理系统
        </Button>
      </main>
    </>
  );
}
