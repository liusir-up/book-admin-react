import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import UserForm from "@/components/UserForm";

const inter = Inter({ subsets: ["latin"] });

export default function BookAdd() {
  return <UserForm title="用户添加" />
}
