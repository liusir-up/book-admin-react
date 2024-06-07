import BorrowForm from "@/components/BorrowForm";
import { useEffect, useState } from "react";
import { getBorrowDetail } from "@/api/borrow";
import { useRouter } from "next/router";

export default function BorrowEdit() {
  const router = useRouter();
  const [data, setData] = useState({});
  useEffect(() => {
    if (router.query.id) {
      getBorrowDetail(router.query.id).then((res) => {
        setData(res.data);
      });
    }
  },[router.query.id])
  return <BorrowForm title="借阅编辑" editData={data} />
}
