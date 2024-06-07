import {
  Form,
  Button,
  Select,
  Space,
  Row,
  Col,
  Table,
  TablePaginationConfig,
  message,
  Modal, Tag
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./index.module.css";
import dayjs from "dayjs";
import { getBookList } from "@/api/book";
import { BookType } from "@/type";
import Content from "@/components/Content";
import { borrowDelete, getBorrowList } from "@/api/borrow";
import { BorrowQueryType } from "@/type/borrow";

const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  }
];
const STATUS_OPTIONS = [
  {
    label: "借出",
    value: "on"
  }, {
    label: "归还",
    value: "off"
  }
];
const COLUMN = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: any) => {
      return record.book.name;
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (text: string) => {
      return text === "on" ? <Tag color="red">借出</Tag> : <Tag color="green">已还</Tag>;
    }
  },
  {
    title: "借阅人",
    dataIndex: "borrowUser",
    key: "borrowUser",
    render: (text: string, record: any) => {
      return record.user.name;
    }
  },
  {
    title: "借阅时间",
    dataIndex: "borrowAt",
    key: "createdAt",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD")
  },
  {
    title: "归还时间",
    dataIndex: "backAt",
    key: "createdAt",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD")
  }
];
export default function Borrow() {
  const [form] = Form.useForm();
  const Router = useRouter();
  const [data, setData] = useState([]);
  const [bookList, setBookList] = useState<BookType[]>([]);
  const [userList, setUserList] = useState<any []>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  });

  async function fetchData(values?: any) {
    const res = await getBorrowList({ ...values, current: 1, pageSize: pagination.pageSize });
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    })
  }, []);

  const handleSearchFinish = async (values: BorrowQueryType) => {
    const res = await getBorrowList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  const handleSearchReset = () => {
    console.log("click", form);
    form.resetFields();
  };

  const handleBorrowEdit = (id: string) => {
    Router.push(`/borrow/edit/${id}`);
  };

  const handleBorrowDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await borrowDelete(id);
        message.success("删除成功");
        await fetchData(form.getFieldsValue());
      }
    })
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    getBorrowList({
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
          {row.status === 'on' && <Button type="link" onClick={() => {
            handleBorrowEdit(row._id);
          }}>归还</Button>}
          <Button type="link" danger onClick={() => handleBorrowDelete(row._id)}>删除</Button>
        </Space>;
      }
    }
  ];
  return (
    <Content
      title="借阅列表"
      operation = {
        <Button
          type="primary"
          onClick={() => {
            Router.push("borrow/add");
          }}>添加
        </Button>
      }
    >
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: "",
          status: "",
          user: ""
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="书籍名称">
              <Select allowClear showSearch optionFilterProp="label" options={bookList.map((item) => ({
                label: item.name,
                value: item._id
              }))} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="状态">
              <Select allowClear options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="user" label="借阅人">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={userList.map((item) => ({
                  label: item.name,
                  value: item._id
                }))} />
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
