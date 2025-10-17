import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Popover,
  Select,
  Space,
  message,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Card,
  Tag,
  Dropdown,
  Menu,
  Switch,
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  TableOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import moment from "moment";
import { useTheme } from "../../../context/ThemeContext";

const { Option } = Select;

// Utility to get unique values for filters
const getUniqueValues = (data, key) =>
  [...new Set(data.map((item) => item[key]))].filter(Boolean);

// Filters popover component
const FiltersPopover = ({ onApply, dataSource, currentFilters }) => {
  const [filters, setFilters] = useState({ ...currentFilters });
  const statuses = getUniqueValues(dataSource, "status");

  const onChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const renderHoverFilter = (field, options) => (
    <Popover
      content={
        <div style={{ width: 180 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </div>
          <Select
            value={filters[field]}
            onChange={(val) => onChange(field, val)}
            placeholder={`Select ${
              field.charAt(0).toUpperCase() + field.slice(1)
            }`}
            style={{ width: "100%" }}
            allowClear
          >
            {options.map((opt) => (
              <Option key={opt} value={opt}>
                {typeof opt === "string"
                  ? opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase()
                  : opt}
              </Option>
            ))}
          </Select>
        </div>
      }
      trigger="hover"
      placement="right"
    >
      <div
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color: filters[field] ? "#1890ff" : "inherit",
          padding: "4px 0",
        }}
      >
        {field.charAt(0).toUpperCase() + field.slice(1)}
        {filters[field] && <span style={{ marginLeft: 4 }}>(1)</span>}
      </div>
    </Popover>
  );

  return (
    <Space>
      <Popover
        content={
          <div style={{ width: 200 }}>
            {renderHoverFilter("status", statuses)}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Button
                danger
                size="small"
                onClick={() => {
                  setFilters({});
                  onApply({});
                }}
                disabled={Object.values(filters).every((val) => !val)}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => onApply(filters)}
                disabled={Object.values(filters).every((val) => !val)}
                style={{ marginLeft: 8 }}
              >
                Apply
              </Button>
            </div>
          </div>
        }
        trigger="click"
        placement="bottomLeft"
      >
        <Button icon={<FilterOutlined />}>Filters</Button>
      </Popover>
    </Space>
  );
};

const AttendanceMaster = () => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Persist view mode in localStorage
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("attendanceViewMode") || "table"
  );
  useEffect(() => {
    localStorage.setItem("attendanceViewMode", viewMode);
  }, [viewMode]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const { primaryColor, showCustomButton } = useTheme();

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const stored = localStorage.getItem("attendanceVisibleColumns");
    return stored
      ? JSON.parse(stored)
      : [
          "employeeName",
          " date",
          "phone",
          " checkin",
          "checkout",
          " totalhours",
          " status",
          "actions",
        ];
  });

  // Add this effect to persist column preferences
  useEffect(() => {
    localStorage.setItem(
      "attendanceVisibleColumns",
      JSON.stringify(visibleColumns)
    );
  }, [visibleColumns]);

  useEffect(() => {
    if (showCustomButton === "disable") {
      localStorage.removeItem("attendanceVisibleColumns");
      setVisibleColumns(defaultColumns); // Reset to defaults if needed
    }
  }, [showCustomButton]);

  // Sample data source
  const dataSource = [
    {
      key: "1",
      employeeName: "John Doe",
      date: "2024-05-01",
      checkin: "09:00 AM",
      checkout: "05:00 PM",
      totalhours: "8h",
      status: "Present",
    },
    {
      key: "2",
      employeeName: "Jane Smith",
      date: "2024-05-01",
      checkin: "10:00 AM",
      checkout: "06:00 PM",
      totalhours: "8h",
      status: "Late",
    },
  ];

  useEffect(() => {
    applyFilters(filters, searchText);
  }, []);

  const applyFilters = (f, txt) => {
    let fd = dataSource.filter((item) =>
      item.employeeName.toLowerCase().includes(txt.toLowerCase())
    );
    if (f.status) fd = fd.filter((it) => it.status === f.status);
    setFilteredData(fd);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    applyFilters(filters, val);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters, searchText);
  };

  const handleMenuClick = (record, e) => {
    if (e.key === "view") {
      message.info(`Viewing ${record.employeeName}`);
    } else if (e.key === "edit") {
      setIsEditMode(true);
      form.setFieldsValue({
        employeeName: record.employeeName,
        date: moment(record.date, "YYYY-MM-DD"),
        checkin: moment(record.checkin, "hh:mm A"),
        checkout: moment(record.checkout, "hh:mm A"),
        status: record.status,
      });
      setIsModalOpen(true);
    } else if (e.key === "delete") {
      message.error(`Deleted ${record.employeeName}`);
    }
  };

  const onFormFinish = async (values) => {
    setIsSubmitting(true);
    const payload = {
      employeeName: values.employeeName,
      date: values.date.format("YYYY-MM-DD"),
      checkin: values.checkin.format("HH:mm A"),
      checkout: values.checkout.format("HH:mm A"),
      status: values.status,
    };
    console.log("Submitted attendance:", payload);
    await new Promise((r) => setTimeout(r, 500));
    setIsSubmitting(false);
    form.resetFields();
    setIsModalOpen(false);
    message.success("Attendance saved");
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const allColumns = [
    { title: "S.No", key: "index", render: (_t, _r, idx) => idx + 1 },
    { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Check In", dataIndex: "checkin", key: "checkin" },
    { title: "Check Out", dataIndex: "checkout", key: "checkout" },
    { title: "Total Hours", dataIndex: "totalhours", key: "totalhours" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_t, rec) => (
        <Dropdown
          overlay={
            <Menu onClick={(e) => handleMenuClick(rec, e)}>
              <Menu.Item key="view" icon={<EyeOutlined />}>
                View
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                Edit
              </Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />}>
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <EllipsisOutlined
            style={{ fontSize: 18, cursor: "pointer", color: primaryColor }}
            rotate={90}
          />
        </Dropdown>
      ),
    },
  ];
  const columns = allColumns.filter((col) =>
    visibleColumns.includes(col.dataIndex || col.key)
  );

  return (
    <div className=" bg-white">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <h2 className="text-xl font-semibold">Attendance Master</h2>

        <Space>
          <Input.Search
            placeholder="Search by name"
            value={searchText}
            onChange={handleSearchChange}
            allowClear
            style={{ width: 200 }}
          />
          <FiltersPopover
            dataSource={dataSource}
            currentFilters={filters}
            onApply={handleFilterApply}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
          >
            Add Attendance
          </Button>
          {showCustomButton && (
            <Dropdown
              menu={{
                items: allColumns.map((col) => ({
                  key: col.dataIndex || col.key,
                  label: (
                    <Space>
                      <Switch
                        checked={visibleColumns.includes(
                          col.dataIndex || col.key
                        )}
                        onChange={(checked) => {
                          if (checked) {
                            setVisibleColumns([
                              ...visibleColumns,
                              col.dataIndex || col.key,
                            ]);
                          } else {
                            setVisibleColumns(
                              visibleColumns.filter(
                                (k) => k !== (col.dataIndex || col.key)
                              )
                            );
                          }
                        }}
                      />
                      {col.title}
                    </Space>
                  ),
                })),
              }}
            >
              <Button icon={<SettingOutlined />}></Button>
            </Dropdown>
          )}
          <Button
            icon={
              viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />
            }
            onClick={() =>
              setViewMode((m) => (m === "table" ? "card" : "table"))
            }
          >
            {/* {viewMode === "table" ? "Card View" : "Table View"} */}
          </Button>
        </Space>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          size="small"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t, r) => `${r[0]}-${r[1]} of ${t}`,
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    padding: "8px 8px",
                    whiteSpace: "nowrap",
                  }}
                />
              ),
            },
          }}
          rowKey="key"
          scroll={{ x: "max-content" }}
          bordered
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <Card
              key={item.key}
              size="small"
              title={item.employeeName}
              extra={
                <Tag color={item.status === "Present" ? "green" : "orange"}>
                  {item.status}
                </Tag>
              }
            >
              <p>
                <b>Date:</b> {item.date}
              </p>
              <p>
                <b>Check In:</b> {item.checkin}
              </p>
              <p>
                <b>Check Out:</b> {item.checkout}
              </p>
              <p>
                <b>Total Hours:</b> {item.totalhours}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceMaster;
