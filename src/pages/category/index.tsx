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
  message
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "../user/index.module.css";
import dayjs from "dayjs";
import { categoryDelete, getCategoryList } from "@/api/category";
import { CategoryQueryType } from "@/type";
import Content from "@/components/Content";

const COLUMN = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "级别",
    dataIndex: "level",
    key: "level",
    render: (text: number) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>{`级别${text}`}</Tag>
    }
  },
  {
    title: "所属分类",
    dataIndex: "parent",
    key: "parent",
    render: (text: { name: string }) => {
      return text?.name ?? "-"
    }
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD")
  }
];

const LEVEL = {
  ONE: 1,
  TWO: 2,
}

export const LEVEL_OPTIONS = [
  { label: "一级", value: LEVEL.ONE },
  { label: "二级", value: LEVEL.TWO },
]
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
    const res = await getCategoryList({
      current: 1,
      pageSize: pagination.pageSize,
      ...values,
    });
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchFinish = async (values: CategoryQueryType) => {
    const res = await getCategoryList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  const handleSearchReset = () => {
    console.log("click", form);
    form.resetFields();
  };

  const handleCategoryEdit = (id: string) => {
    Router.push(`/category/edit/${id}`);
  };

  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await categoryDelete(id);
        message.success("删除成功")
        await fetchData(form.getFieldsValue());
      }
    })
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    getCategoryList({
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
            handleCategoryEdit(row._id);
          }}>编辑</Button>
          <Button type="link" danger onClick={() => handleCategoryDelete(row._id)}>删除</Button>
        </Space>;
      }
    }
  ];
  return (
    <Content
      title="分类列表"
      operation = {
        <Button
          type="primary"
          onClick={() => {
            Router.push("category/add");
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
            <Form.Item name="level" label="级别">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                options={LEVEL_OPTIONS} />
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
