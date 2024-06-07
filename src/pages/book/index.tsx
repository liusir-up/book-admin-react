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
  Tooltip,
  message,
  Modal
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "../borrow/index.module.css";
import dayjs from "dayjs";
import { bookDelete, getBookList } from "@/api/book";
import { BookQueryType, CategoryType } from "@/type";
import Content from "@/components/Content";
import { getCategoryList } from "@/api/category";

const COLUMN = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "封面",
    dataIndex: "cover",
    key: "cover",
    render: (text: string) => (<img src={text} style={{ width: 50, height: 50 }} />)
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author"
  },
  {
    title: "分类",
    dataIndex: "category",
    key: "category"
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    render: (text: string) => (
      <Tooltip placement="topLeft" title={text}>
        {text.slice(0, 15) + "..."}
      </Tooltip>
    )
  },
  {
    title: "库存",
    dataIndex: "stock",
    key: "stock"
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD")
  }
];
export default function Home() {
  const [form] = Form.useForm();
  const Router = useRouter();
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  });

  async function fetchData(values?: any) {
    const res = await getBookList({ ...values, current: 1, pageSize: pagination.pageSize });
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    })
  }, []);

  const handleSearchFinish = async (values: BookQueryType) => {
    const res = await getBookList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  const handleSearchReset = () => {
    console.log("click", form);
    form.resetFields();
  };

  const handleBookEdit = (id: string) => {
    Router.push(`/book/edit/${id}`);
  };

  const handleBookDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await bookDelete(id);
        message.success("删除成功");
        await fetchData(form.getFieldsValue());
      }
    })
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    getBookList({
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
          <Button type="link" onClick={() => {
            handleBookEdit(row._id);
          }}>编辑</Button>
          <Button type="link" danger onClick={() => handleBookDelete(row._id)}>删除</Button>
        </Space>;
      }
    }
  ];
  return (
    <Content
      title="图书列表"
      operation = {
        <Button
          type="primary"
          onClick={() => {
            Router.push("book/add");
          }}>添加
        </Button>
      }
    >
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: "", author: "", category: ""
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="分类">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={categoryList.map((item) => ({
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
