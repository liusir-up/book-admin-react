import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import BookForm from "@/components/BookForm";

const inter = Inter({ subsets: ["latin"] });

export default function BookEdit() {
  return <BookForm title="图书编辑"/>
}
