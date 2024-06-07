import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  message
} from "antd";
import { BookType, CategoryType } from "@/type";
import { useRouter } from "next/router";
import styles from './index.module.css'
import Content from "@/components/Content";
import { LEVEL_OPTIONS } from "@/pages/category";
import { categoryAdd, getCategoryList } from "@/api/category";

export default function CategoryForm({ title } : { title: string }) {

  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [preview, setPreview] = useState<string>("");
  const [form] = Form.useForm();
  const [level, setLevel] = useState(1);
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const router = useRouter()
  const handleFinish = async (values: CategoryType) => {
    await categoryAdd(values);
    message.success('创建成功');
    router.push("/category");
  }

  useEffect(() => {
    async function fetchData () {
      const res = await getCategoryList({ all: true, level: 1 })
      setLevelOneList(res.data)
    }
    fetchData();
  },[])
  const leveOneOptions = useMemo(() => {
    return levelOneList.map((item) => {
      return {
        label: item.name,
        value: item._id
      }
    })
  },[levelOneList]);

  return (
    <Content title={title} operation="">
      <Form
        form={form}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
        style={{ maxWidth: 1000 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入名称"
            }
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="级别"
          name="level"
          rules={[
            {
              required: true,
              message: "请选择级别"
            }
          ]}
        >
          <Select onChange={(value) => {
            setLevel(value);
          }} placeholder="请选择" options={LEVEL_OPTIONS}>
          </Select>
        </Form.Item>
        {level === 2 && <Form.Item
          label="所属级别"
          name="parent"
          rules={[
            {
              required: true,
              message: "请选择所属级别"
            }
          ]}
        >
          <Select placeholder="请选择" options={leveOneOptions}>
          </Select>
        </Form.Item>}
        <Form.Item label="操作">
          <Button size="large" type="primary" htmlType="submit" className={styles.btn}>创建</Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
