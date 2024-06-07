import axios from "axios";
import { BookQueryType, BookType, CategoryQueryType, CategoryType } from "@/type";
import request from "@/utils/request";
import qs from "qs";

export async function getCategoryList(params?: CategoryQueryType) {
  return request.get(`/api/categories?${qs.stringify(params)}`);
}

export async function categoryAdd(params: CategoryType) {
  return request.post("/api/categories", params);
}

export async function categoryDelete(id: string) {
  return request.delete(`/api/categories/${id}`);
}