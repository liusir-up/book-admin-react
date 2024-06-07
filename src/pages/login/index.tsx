import styles from './index.module.css';
import { Button, Form, Input, message } from "antd";
import { login } from "@/api/user";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const handleFinish = async (values: {name: string,password: string}) => {
    const res = await login(values)
    if (res.success) {
      message.success('登陆成功')
      router.push('/book')
    }
  }

  return (<div className={styles.container}>
      <div>
        <h2 className={styles.title}>图书管理系统</h2>
      </div>
      <Form onFinish={handleFinish}>
        <Form.Item label="账号" name="name" rules={[
          {
            required: true,
            message: "请输入账号"
          }
        ]}>
          <Input placeholder="请输入账号"></Input>
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[
          {
            required: true,
            message: "请输入密码"
          }
        ]}>
          <Input.Password placeholder="请输入密码" autoComplete="off"></Input.Password>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
          >登陆</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
