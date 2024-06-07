import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Image, message
} from "antd";
import { BookType, CategoryType } from "@/type";
import { bookAdd } from "@/api/book";
import { useRouter } from "next/router";
import styles from './index.module.css'
import dayjs from "dayjs";
import Content from "@/components/Content";
import { getCategoryList } from "@/api/category";

export default function BookForm({ title }: { title: string }) {

  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [preview, setPreview] = useState<string>("");
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const router = useRouter()
  const handleFinish = async (values: BookType) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf()
    }
    await bookAdd(values);
    message.success('创建成功');
    router.push("/book");
  };

  useEffect(() => {
    getCategoryList({ all: true, level: 1 }).then(res => {
      setCategoryList(res.data)
    })
  },[])

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
        <Form.Item label="作者" name="author" rules={[
          {
            required: true,
            message: "请输入作者"
          }
        ]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="分类" name="category" rules={[
          {
            required: true,
            message: "请选择分类"
          }
        ]}>
          <Select placeholder="请选择" options={categoryList.map((item) => ({
            label: item.name,
            value: item._id
          }))}>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="封面" name="cover">
          <Input.Group compact>
            <Input
              placeholder="请输入"
              style={{ width: "calc(100% - 63px)" }}
              onChange={(e) => {
                form.setFieldValue("cover", e.target.value);
              }} />
            <Button type="primary"  onClick={() => {
              setPreview(form.getFieldValue("cover"));
            }}>预览</Button>
          </Input.Group>
        </Form.Item>
        {preview && (
          <Form.Item label="预览">
            <Image src={preview} alt=""></Image>
          </Form.Item>
        )}
        <Form.Item label="出版日期" name="publishAt">
          <DatePicker placeholder="请选择" />
        </Form.Item>
        <Form.Item label="库存">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="描述">
          <TextArea placeholder="请输入" rows={4} />
        </Form.Item>
        <Form.Item label="操作">
          <Button size="large" type="primary" htmlType="submit" className={styles.btn}>创建</Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
