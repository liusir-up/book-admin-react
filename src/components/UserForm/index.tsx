import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message, Radio
} from "antd";
import { BookType, CategoryType, UserType } from "@/type";
import { useRouter } from "next/router";
import styles from './index.module.css'
import dayjs from "dayjs";
import Content from "@/components/Content";
import { getCategoryList } from "@/api/category";
import { userAdd, userUpdate } from "@/api/user";
import { USER_ROLE, USER_SEX, USER_STATUS } from "@/constant/user";

export default function UserForm({ title, editData = {
  sex: USER_SEX.MALE,
  role: USER_ROLE.USER,
  status: USER_STATUS.ON,
}}: {
  title: string;
  editData?: Partial<UserType>;
}) {
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const router = useRouter()

  useEffect(() => {
    if (editData._id) {
      form.setFieldsValue(editData)
    }
  },[editData])

  const handleFinish = async (values: UserType) => {
    if (editData?._id) {
      await userUpdate(values);
    } else {
      await userAdd(values);
    }
    message.success('创建成功');
    router.push("/user");
  };

  return (
    <Content title={title} operation="">
      <Form
        form={form}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 24 }}
        initialValues={editData}
        layout="horizontal"
        style={{ maxWidth: 1000 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="账号"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入账号"
            }
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="名称" name="nickName" rules={[
          {
            required: true,
            message: "请输入名称"
          }
        ]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="性别" name="sex" rules={[
          {
            required: true,
            message: "请选择性别"
          }
        ]}>
          <Radio.Group>
            <Radio value="male">男</Radio>
            <Radio value="female">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[
          {
            required: true,
            message: "请输入密码"
          }
        ]}>
          <Input.Password placeholder="请输入"/>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value="on">启用</Radio>
            <Radio value="off">禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="角色" name="role">
          <Radio.Group>
            <Radio value="user">用户</Radio>
            <Radio value="admin">管理员</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="操作">
          <Button size="large" type="primary" htmlType="submit" className={styles.btn}>创建</Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
