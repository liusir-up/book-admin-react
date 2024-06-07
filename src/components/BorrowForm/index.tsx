import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import Content from "@/components/Content";
import { Button, Form, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getUserList } from "@/api/user";
import { getBookList } from "@/api/book";
import { BookType, BorrowType, UserType } from "@/type";
import { borrowAdd, borrowUpdate } from "@/api/borrow";

const inter = Inter({ subsets: ["latin"] });

export default function BorrowForm({ title, editData }: { title: string }) {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    getUserList().then(res => {
      setUserList(res.data);
    });
    getBookList().then(res => {
      setBookList(res.data);
    });
  },[])

  const handleFinish = async (values: BorrowType) => {
    try {
      if (editData?._id) {
        await borrowUpdate(values);
        message.success("更新成功");
      } else {
        await borrowAdd(values);
        message.success("创建成功");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookChange = (value, option) => {
    console.log(option);
    setStock(option.stock)
  }

  return <Content title={title} operation="">
    <Form
      form={form}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 24 }}
      layout="horizontal"
      style={{ maxWidth: 1000 }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="书籍名称"
        name="book"
        rules={[
          {
            required: true,
            message: "请选择"
          }
        ]}
      >
        <Select placeholder="请选择" onChange={handleBookChange}>
          {bookList.map((item: BookType) =>
            <Select.Option
              key={item._id}
              value={item._id}
              stock={item.stock}>
              {item.name}
            </Select.Option>)
          }
        </Select>
      </Form.Item>
      <Form.Item label="借阅用户" name="user" rules={[
        {
          required: true,
          message: "请选择"
        }
      ]}>
        <Select placeholder="请选择">
          {userList.map((item: UserType) => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)}
        </Select>
      </Form.Item>
      <Form.Item label="书籍库存">
        { stock }
      </Form.Item>
      <Form.Item label="操作">
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          className={styles.btn}
          disabled={ stock <= 0 }
        >创建</Button>
      </Form.Item>
    </Form>
  </Content>;
}
