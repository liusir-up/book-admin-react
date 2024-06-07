import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import BookForm from "@/components/BookForm";

const inter = Inter({ subsets: ["latin"] });

export default function BookAdd() {
  return <BookForm title="图书添加" />
}
