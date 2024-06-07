import {
  Form,
  Button,
  Input,
  Select,
  Space,
  Row,
  Col,
  Table,
  TablePaginationConfig,
  Tag,
  Modal,
  message, Switch
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./index.module.css";
import dayjs from "dayjs";
import { userDelete, getUserList, userUpdate } from "@/api/user";
import { UserQueryType, UserType } from "@/type";
import Content from "@/components/Content";

const COLUMN = [
  {
    title: "账号",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "用户名",
    dataIndex: "nickName",
    key: "nickName"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (text: string) => {
      return text === STATUS.ON ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>;
    }
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD")
  }
];

const STATUS = {
  ON: "on",
  OFF: "off"
};

export const STATUS_OPTIONS = [
  { label: "启用", value: STATUS.ON },
  { label: "禁用", value: STATUS.OFF }
];
export default function Home() {
  const [form] = Form.useForm();
  const Router = useRouter();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  });

  async function fetchData(values?: any) {
    const res = await getUserList({
      current: 1,
      pageSize: pagination.pageSize,
      ...values
    });
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchFinish = async (values: UserQueryType) => {
    const res = await getUserList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  const handleSearchReset = () => {
    console.log("click", form);
    form.resetFields();
  };

  const handleUserEdit = (id: string) => {
    Router.push(`/user/edit/${id}`);
  };

  const handleStatusChange = async (row: any) => {
    const status = row.status === STATUS.ON ? STATUS.OFF : STATUS.ON;
    await userUpdate({
      ...row,
      status
    })
    fetchData(form.getFieldsValue());
  }

  const handleUserDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await userDelete(id);
        message.success("删除成功");
        await fetchData(form.getFieldsValue());
      }
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
  };
  const columns = [...COLUMN,
    {
      title: "操作",
      key: "action",
      render: (_: any, row: any) => {
        return <Space>
          <Button
            type="link"
            onClick={() => {
              handleUserEdit(row._id);
            }}>编辑</Button>
          <Button
            type="link"
            danger={row.status === STATUS.ON ? true : false}
            onClick={ async () => {
              await handleStatusChange(row);
            }}>{row.status === STATUS.ON ? '禁用' : '启用'}</Button>
          <Button
            type="link"
            danger
            onClick={() =>
              handleUserDelete(row._id)}
          >删除</Button>
        </Space>;
      }
    }
  ];
  return (
    <Content
      title="用户列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            Router.push("user/add");
          }}>添加
        </Button>
      }
    >
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: "", status: ""
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  清空
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableWrap}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000, y: 600 }}
          onChange={handleTableChange}
          pagination={{ ...pagination, showTotal: () => `共${pagination.total}条` }}
        />
      </div>
    </Content>);
}
