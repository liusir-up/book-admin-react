import { BookType } from "@/type/book";

export interface BorrowQueryType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
}

export interface BorrowType {
  book: BookType;
  user: any;
  borrowAt: string;
  backAt: string;
  status: string;
  _id?: string;
}