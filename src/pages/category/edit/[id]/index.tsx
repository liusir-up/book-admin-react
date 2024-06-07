import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import BookForm from "@/components/BookForm";
import CategoryForm from "@/components/CategoryForm";

const inter = Inter({ subsets: ["latin"] });

export default function CategoryEdit() {
  return <CategoryForm title="分类编辑" />
}
