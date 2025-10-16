import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Popover,
  Dropdown,
  Menu,
  Tag,
  message,
  Select,
  Modal,
  Descriptions,
  Space,
  Switch,
  Card,
} from "antd";
import {
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useTheme } from "../../../context/ThemeContext";
import { employeeService } from "../../services/employeeservice";
import { companyService } from "../../../company/services/CompanyServices";
import { divisionService } from "../../../company/services/divisionService";
import { departmentService } from "../../../company/services/departmentService";
import { branchServices } from "../../../company/services/CompanyServices";
import { roleService } from "../../../hrms/services/Role";

const { Option } = Select;

const FiltersPopover = ({
  onApply,
  companies,
  divisions,
  branches,
  departments,
  designations,
}) => {
  const [filters, setFilters] = useState({
    companyId: undefined,
    divisionId: undefined,
    branchId: undefined,
    departmentId: undefined,
    designationId: undefined,
    status: undefined,
  });

  const onChange = (field, value) =>
    setFilters((f) => ({ ...f, [field]: value }));

  const fields = [
    {
      key: "divisionId",
      label: "Division",
      options: divisions.map((d) => ({ label: d.name, value: d.id })),
    },
    {
      key: "branchId",
      label: "Branch",
      options: branches.map((b) => ({ label: b.name, value: b.id })),
    },
    {
      key: "departmentId",
      label: "Department",
      options: departments.map((d) => ({ label: d.name, value: d.id })),
    },
    {
      key: "designationId",
      label: "Designation",
      options: designations.map((d) => ({ label: d.name, value: d.id })),
    },
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  return (
    <div style={{ padding: 10, width: 240 }}>
      {fields.map(({ key, label, options }) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <Popover
            content={
              <>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
                <Select
                  allowClear
                  placeholder={`Select ${label}`}
                  style={{ width: 200 }}
                  value={filters[key]}
                  onChange={(val) => onChange(key, val)}
                >
                  {options.map((o) => (
                    <Option key={o.value} value={o.value}>
                      {o.label}
                    </Option>
                  ))}
                </Select>
              </>
            }
            trigger="hover"
            placement="right"
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: filters[key] ? 600 : 400,
                color: filters[key] ? "#1890ff" : undefined,
              }}
            >
              {label}
              {filters[key] && <span style={{ marginLeft: 4 }}>(1)</span>}
            </div>
          </Popover>
        </div>
      ))}

      <Space style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
        <Button
        
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
          disabled={!Object.values(filters).some((v) => v != null)}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={!Object.values(filters).some((v) => v != null)}
        >
          Apply
        </Button>
      </Space>
    </div>
  );
};

const Employee = () => {
  const navigate = useNavigate();
  const { primaryColor, showCustomButton } = useTheme();

  // Data + loading
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Filters + search
  const [searchText, setSearchText] = useState("");
  const [filterParams, setFilterParams] = useState({});

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("employeeVisibleColumns");
    return saved
      ? JSON.parse(saved)
      : [
          "employee",
          "company_name",
          "branch_name",
          "department_name",
          "division_name",
          "phone",
          "address",
          "designation_name",
          "status",
          "actions",
        ];
  });
  useEffect(() => {
    localStorage.setItem(
      "employeeVisibleColumns",
      JSON.stringify(visibleColumns)
    ),
      [visibleColumns];
  });

  const defaultColumns = [
    "employee",
    "company_name",
    "branch_name",
    "department_name",
    "division_name",
    "phone",
    "address",
    "designation_name",
    "status",
    "actions",
  ];

  // VIEW MODE: table | card | desktop
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("employeeViewMode") || "table"
  );
  useEffect(
    () => localStorage.setItem("employeeViewMode", viewMode),
    [viewMode]
  );

  // Modal detail
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Master lists
  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Fetch masters
  useEffect(() => {
    Promise.all([
      companyService.getCompany(),
      divisionService.getAllDivisions(),
      departmentService.getAllDepartments(),
      branchServices.getBranch(),
      roleService.getroleAll(),
    ])
      .then(([c, dpt, dp, br, rs]) => {
        setCompanies(c.data.data || []);
        setDivisions(dpt.data.divisions || []);
        setDepartments(dp.data.departments || []);
        setBranches(br.data.data.branches || []);
        setDesignations(rs.data || []);
      })
      .catch(() => message.error("Failed to load filters"));
  }, []);

  // Fetch employees
  const fetchEmployees = (params) => {
    setLoading(true);
    employeeService
      .getEmployees({
        page: params.page || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        search: params.search || searchText,
        ...params,
      })
      .then((res) => {
        const rows = res.data || [];
        const formatted = rows.map((it, idx) => ({
          key: it.id,
          employee: `${it.first_name} ${it.last_name}`,
          company_name: it.company?.name || "-",
          branch_name: it.branch?.name || "-",
          department_name: it.departments?.name || "-",
          division_name: it.divisions?.name || "-",
          phone: it.phone || "-",
          address: [
            it.address_line1,
            it.address_line2,
            it.citys?.name,
            it.states?.name,
            it.countrys?.name,
          ]
            .filter(Boolean)
            .join(", "),
          designation_name: it.designation?.name || "-",
          status: it.status,
          raw: it,
        }));
        setEmployees(formatted);
        setPagination({
          current: res.meta.page,
          pageSize: res.meta.limit,
          total: res.meta.total,
        });
      })
      .catch(() => {
        message.error("Failed to fetch employees");
        setEmployees([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchEmployees({}), []);

  // Handlers
  const handleSearch = (val) => {
    setSearchText(val);
    fetchEmployees({ search: val, page: 1 });
  };
  const handleFilterApply = (f) => {
    setFilterParams(f);
    fetchEmployees({ ...f, page: 1 });
  };
  const handleView = (id) => {
    setModalLoading(true);
    employeeService
      .getEmployeeById(id)
      .then((r) => {
        setSelectedEmployee(r.data);
        setModalVisible(true);
      })
      .catch(() => message.error("Failed to load details"))
      .finally(() => setModalLoading(false));
  };

  const handleMenuClick = (record, e) => {
    if (e.key === "view") return handleView(record.raw.id);
    if (e.key === "edit")
      return navigate("/hrms/pages/create", {
        state: {
          isEdit: true,
          initialValues: { id: record.raw.id, status: record.raw.status },
        },
      });
    if (e.key === "delete")
      return employeeService
        .deleteEmployee(record.raw.id)
        .then(() => fetchEmployees({}))
        .catch(() => message.error("Delete failed"));
  };

  // Columns
  const allColumns = [
    {
      title: "S.No",
      key: "serial",
      render: (_, __, i) =>
        (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    { title: "Employee", dataIndex: "employee", key: "employee" },
    { title: "Company", dataIndex: "company_name", key: "company_name" },
    { title: "Branch", dataIndex: "branch_name", key: "branch_name" },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
    },
    { title: "Division", dataIndex: "division_name", key: "division_name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Designation",
      dataIndex: "designation_name",
      key: "designation_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "active" ? "green" : "red"}>
          {s?.[0].toUpperCase() + s.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
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
        >
          <EllipsisOutlined
            style={{ fontSize: 18, cursor: "pointer", color: primaryColor }}
            rotate={90}
          />
        </Dropdown>
      ),
    },
  ];
  const columns = allColumns.filter((c) => visibleColumns.includes(c.key));

  // Row selection
  const rowSelection = {
    selectedRowKeys: [],
    onChange: () => {},
  };

  return (
    <div className=" bg-white">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3 ">
        <h1 className="text-xl font-semibold">Employee</h1>
        <Space>
          <Input.Search
            placeholder="Search name"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Popover
            content={
              <FiltersPopover
                onApply={handleFilterApply}
                companies={companies}
                divisions={divisions}
                branches={branches}
                departments={departments}
                designations={designations}
              />
            }
            trigger="click"
            placement="bottomLeft"
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Popover>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/hrms/pages/create")}
          >
            Add Employee
          </Button>
          {showCustomButton && (
            <Dropdown
              menu={{
                items: allColumns.map((col) => ({
                  key: col.key,
                  label: (
                    <Space>
                      <Switch
                        checked={visibleColumns.includes(col.key)}
                        onChange={(chk) => {
                          setVisibleColumns((vs) =>
                            chk
                              ? [...vs, col.key]
                              : vs.filter((k) => k !== col.key)
                          );
                        }}
                      />
                      {col.title}
                    </Space>
                  ),
                })),
              }}
            >
              <Button icon={<SettingOutlined />} />
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

      {/* content */}
      {viewMode === "table" && (
        <div className="overflow-x-auto">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={employees}
            size="small"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (p, ps) => fetchEmployees({ page: p, pageSize: ps }),
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
        </div>
      )}

      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading…</div>
          ) : employees.length ? (
            employees.map((it, i) => (
              <Card
                key={it.key}
                title={it.employee}
                extra={
                  <Tag color={it.status === "active" ? "green" : "red"}>
                    {it.status}
                  </Tag>
                }
                className="shadow hover:shadow-md"
              >
                <p>
                  <b>Company:</b> {it.company_name}
                </p>
                <p>
                  <b>Branch:</b> {it.branch_name}
                </p>
                <p>
                  <b>Department:</b> {it.department_name}
                </p>
                <p>
                  <b>Division:</b> {it.division_name}
                </p>
                <p>
                  <b>Phone:</b> {it.phone}
                </p>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              No employees found
            </div>
          )}
        </div>
      )}

      {/* desktop (expandable) view if desired */}
      {viewMode === "desktop" && (
        <Table
          columns={columns}
          dataSource={employees}
          expandable={{
            expandedRowRender: (record) => (
              <Descriptions bordered column={1}>
                {allColumns
                  .filter((c) => c.dataIndex)
                  .map((c) => (
                    <Descriptions.Item key={c.key} label={c.title}>
                      {record[c.dataIndex]}
                    </Descriptions.Item>
                  ))}
              </Descriptions>
            ),
          }}
   
          size="small"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          rowKey="key"
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
        />
      )}

      {/* details modal */}
      {selectedEmployee && (
        <Modal
          visible={modalVisible}
          title="Employee Details"
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setModalVisible(false)}>
              Close
            </Button>,
          ]}
          confirmLoading={modalLoading}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {selectedEmployee.first_name} {selectedEmployee.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedEmployee.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedEmployee.phone}
            </Descriptions.Item>
            <Descriptions.Item label="DOB">
              {moment(selectedEmployee.date_of_birth).format("DD-MM-YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {selectedEmployee.departments?.name}
            </Descriptions.Item>
            {/* …etc */}
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default Employee;
