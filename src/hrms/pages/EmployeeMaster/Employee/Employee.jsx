// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Input,
//   Popover,
//   Dropdown,
//   Menu,
//   Tag,
//   message,
//   Select,
//   Modal,
//   Descriptions,
//   Space,
//   Switch,
//   Card,
// } from "antd";
// import {
//   FilterOutlined,
//   EllipsisOutlined,
//   PlusOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   SettingOutlined,
//   TableOutlined,
//   AppstoreOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import moment from "moment";
// // Import your custom hooks/services below
// // import { useTheme } from "../../../context/ThemeContext";
// // import { employeeService } from "../../services/employeeservice";
// // import { companyService } from "../../../company/services/CompanyServices";
// // import { divisionService } from "../../../company/services/divisionService";
// // import { departmentService } from "../../../company/services/departmentService";
// // import { branchServices } from "../../../company/services/CompanyServices";
// // import { roleService } from "../../../hrms/services/Role";

// const { Option } = Select;

// // Example stats for cards
// const stats = [
//   { title: "Total Employees", value:0 , color: "bg-black", percent: "0%", percentClass: "text-purple-500" },
//   { title: "Active", value: 0, color: "bg-green-500", percent: "0%", percentClass: "text-red-500" },
//   { title: "Inactive", value: 0, color: "bg-red-500", percent: "-0%", percentClass: "text-gray-500" },  // Change values accordingly
//   { title: "New Joiners", value: 0, color: "bg-blue-500", percent: "0%", percentClass: "text-blue-500" },
// ];

// // Filter popover
// const FiltersPopover = ({
//   onApply,
//   companies = [],
//   divisions = [],
//   branches = [],
//   departments = [],
//   designations = [],
// }) => {
//   const [filters, setFilters] = useState({});

//   const fields = [
//     { key: "divisionId", label: "Division", options: divisions.map((d) => ({ label: d.name, value: d.id })) },
//     { key: "branchId", label: "Branch", options: branches.map((b) => ({ label: b.name, value: b.id })) },
//     { key: "departmentId", label: "Department", options: departments.map((d) => ({ label: d.name, value: d.id })) },
//     { key: "designationId", label: "Designation", options: designations.map((d) => ({ label: d.name, value: d.id })) },
//     {
//       key: "status",
//       label: "Status",
//       options: [
//         { label: "Active", value: "active" },
//         { label: "Inactive", value: "inactive" },
//       ],
//     },
//   ];

//   const onChange = (field, value) => setFilters((f) => ({ ...f, [field]: value }));

//   return (
//     <div style={{ padding: 10, width: 240 }}>
//       {fields.map(({ key, label, options }) => (
//         <div key={key} style={{ marginBottom: 12 }}>
//           <Popover
//             content={
//               <>
//                 <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
//                 <Select
//                   allowClear
//                   placeholder={`Select ${label}`}
//                   style={{ width: 200 }}
//                   value={filters[key]}
//                   onChange={(val) => onChange(key, val)}
//                 >
//                   {options.map((o) => (
//                     <Option key={o.value} value={o.value}>
//                       {o.label}
//                     </Option>
//                   ))}
//                 </Select>
//               </>
//             }
//             trigger="hover"
//             placement="right"
//           >
//             <div
//               style={{
//                 cursor: "pointer",
//                 fontWeight: filters[key] ? 600 : 400,
//                 color: filters[key] ? "#1890ff" : undefined,
//               }}
//             >
//               {label}
//               {filters[key] && <span style={{ marginLeft: 4 }}>(1)</span>}
//             </div>
//           </Popover>
//         </div>
//       ))}

//       <Space style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
//         <Button
//           danger
//           size="small"
//           onClick={() => {
//             setFilters({});
//             onApply({});
//           }}
//           disabled={!Object.values(filters).some((v) => v != null)}
//         >
//           Reset
//         </Button>
//         <Button
//           type="primary"
//           size="small"
//           onClick={() => onApply(filters)}
//           disabled={!Object.values(filters).some((v) => v != null)}
//         >
//           Apply
//         </Button>
//       </Space>
//     </div>
//   );
// };

// // Main component
// const Employee = () => {
//   const navigate = useNavigate();
//   const primaryColor = "#10b981"; // replace with useTheme() if available
//   const showCustomButton = true; // replace with useTheme() if available

//   // Demo: useState hooks for master lists and employees
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
//   const [searchText, setSearchText] = useState("");
//   const [filterParams, setFilterParams] = useState({});
//   const [visibleColumns, setVisibleColumns] = useState([
//     "employee",
//     "company_name",
//     "branch_name",
//     "department_name",
//     "division_name",
//     "phone",
//     "address",
//     "designation_name",
//     "status",
//     "actions",
//   ]);
//   const [viewMode, setViewMode] = useState("table");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   // Demo: master data (replace with service calls)
//   const [companies, setCompanies] = useState([]);
//   const [divisions, setDivisions] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   // Demo fetch employees (replace with actual API)
//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setPagination({ current: 1, pageSize: 10, total: 1 });
//       setLoading(false);
//     }, 500);
//   }, []);

//   // Table columns
//   const allColumns = [
//     {
//       title: "S.No",
//       key: "serial",
//       render: (_, __, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
//     },
//     { title: "Employee", dataIndex: "employee", key: "employee" },
//     { title: "Company", dataIndex: "company_name", key: "company_name" },
//     { title: "Branch", dataIndex: "branch_name", key: "branch_name" },
//     {
//       title: "Department",
//       dataIndex: "department_name",
//       key: "department_name",
//     },
//     { title: "Division", dataIndex: "division_name", key: "division_name" },
//     { title: "Phone", dataIndex: "phone", key: "phone" },
//     { title: "Address", dataIndex: "address", key: "address" },
//     {
//       title: "Designation",
//       dataIndex: "designation_name",
//       key: "designation_name",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (s) => (
//         <Tag color={s === "active" ? "green" : "red"}>
//           {s?.[0].toUpperCase() + s.slice(1)}
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, rec) => (
//         <Dropdown
//           overlay={
//             <Menu onClick={() => {}}>
//               <Menu.Item key="view" icon={<EyeOutlined />}>
//                 View
//               </Menu.Item>
//               <Menu.Item key="edit" icon={<EditOutlined />}>
//                 Edit
//               </Menu.Item>
//               <Menu.Item key="delete" icon={<DeleteOutlined />}>
//                 Delete
//               </Menu.Item>
//             </Menu>
//           }
//         >
//           <EllipsisOutlined
//             style={{ fontSize: 18, cursor: "pointer", color: primaryColor }}
//             rotate={90}
//           />
//         </Dropdown>
//       ),
//     },
//   ];
//   const columns = allColumns.filter((c) => visibleColumns.includes(c.key));

//   // Row selection
//   const rowSelection = {
//     selectedRowKeys: [],
//     onChange: () => {},
//   };

//   return (
//     <div className="bg-white p-4">
//       {/* STATS GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         {stats.map((s) => (
//           <Card key={s.title} className="flex flex-row items-center gap-3 shadow">
//             <div className={`rounded-full h-10 w-10 flex items-center justify-center ${s.color}`}>
//               <UserOutlined className="text-white text-xl" />
//             </div>
//             <div>
//               <div className="text-xs font-medium text-gray-400">{s.title}</div>
//               <div className="text-xl font-bold">{s.value}</div>
//               <div className={`text-xs ${s.percentClass}`}>{s.percent}</div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* header with filters/search/add */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-3 ">
//         <h1 className="text-xl font-semibold">Employee</h1>
//         <Space>
//           <Input.Search
//             placeholder="Search name"
//             allowClear
//             onSearch={(val) => setSearchText(val)}
//             style={{ width: 200 }}
//           />
//           <Popover
//             content={
//               <FiltersPopover
//                 onApply={(filters) => setFilterParams(filters)}
//                 companies={companies}
//                 divisions={divisions}
//                 branches={branches}
//                 departments={departments}
//                 designations={designations}
//               />
//             }
//             trigger="click"
//             placement="bottomLeft"
//           >
//             <Button icon={<FilterOutlined />}>Filters</Button>
//           </Popover>

//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => navigate("/hrms/pages/create")}
//           >
//             Add Employee
//           </Button>
//           {showCustomButton && (
//             <Dropdown
//               menu={{
//                 items: allColumns.map((col) => ({
//                   key: col.key,
//                   label: (
//                     <Space>
//                       <Switch
//                         checked={visibleColumns.includes(col.key)}
//                         onChange={(chk) => {
//                           setVisibleColumns((vs) =>
//                             chk
//                               ? [...vs, col.key]
//                               : vs.filter((k) => k !== col.key)
//                           );
//                         }}
//                       />
//                       {col.title}
//                     </Space>
//                   ),
//                 })),
//               }}
//             >
//               <Button icon={<SettingOutlined />} />
//             </Dropdown>
//           )}
//           <Button
//             icon={
//               viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />
//             }
//             onClick={() =>
//               setViewMode((m) => (m === "table" ? "card" : "table"))
//             }
//           />
//         </Space>
//       </div>

//       {/* content views */}
//       {viewMode === "table" && (
//         <div className="overflow-x-auto">
//           <Table
//             rowSelection={rowSelection}
//             columns={columns}
//             dataSource={employees}
//             size="small"
//             loading={loading}
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               total: pagination.total,
//             }}
//             components={{
//               header: {
//                 cell: (props) => (
//                   <th
//                     {...props}
//                     style={{
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 2,
//                       padding: "8px 8px",
//                       whiteSpace: "nowrap",
//                     }}
//                   />
//                 ),
//               },
//             }}
//             rowKey="key"
//             scroll={{ x: "max-content" }}
//             bordered
//           />
//         </div>
//       )}

//       {/* card view */}
//       {viewMode === "card" && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {loading ? (
//             <div className="col-span-full text-center py-8">Loading…</div>
//           ) : employees.length ? (
//             employees.map((it) => (
//               <Card
//                 key={it.key}
//                 title={it.employee}
//                 extra={
//                   <Tag color={it.status === "active" ? "green" : "red"}>
//                     {it.status}
//                   </Tag>
//                 }
//                 className="shadow hover:shadow-md"
//               >
//                 <p><b>Company:</b> {it.company_name}</p>
//                 <p><b>Branch:</b> {it.branch_name}</p>
//                 <p><b>Department:</b> {it.department_name}</p>
//                 <p><b>Division:</b> {it.division_name}</p>
//                 <p><b>Phone:</b> {it.phone}</p>
//               </Card>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-8">
//               No employees found
//             </div>
//           )}
//         </div>
//       )}

//       {/* modal view */}
//       {selectedEmployee && (
//         <Modal
//           visible={modalVisible}
//           title="Employee Details"
//           onCancel={() => setModalVisible(false)}
//           footer={[
//             <Button key="close" onClick={() => setModalVisible(false)}>
//               Close
//             </Button>,
//           ]}
//           confirmLoading={modalLoading}
//         >
//           <Descriptions bordered column={1}>
//             <Descriptions.Item label="Name">
//               {selectedEmployee.first_name} {selectedEmployee.last_name}
//             </Descriptions.Item>
//             <Descriptions.Item label="Email">
//               {selectedEmployee.email}
//             </Descriptions.Item>
//             <Descriptions.Item label="Phone">
//               {selectedEmployee.phone}
//             </Descriptions.Item>
//             <Descriptions.Item label="DOB">
//               {moment(selectedEmployee.date_of_birth).format("DD-MM-YYYY")}
//             </Descriptions.Item>
//             <Descriptions.Item label="Department">
//               {selectedEmployee.departments?.name}
//             </Descriptions.Item>
//           </Descriptions>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Employee;
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
  Form,
  DatePicker,
  Upload,
  Avatar,
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
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const stats = [
  { title: "Total Employees", value: 0, color: "bg-black", percent: "0%", percentClass: "text-purple-500" },
  { title: "Active", value: 0, color: "bg-green-500", percent: "0%", percentClass: "text-red-500" },
  { title: "Inactive", value: 0, color: "bg-red-500", percent: "-0%", percentClass: "text-gray-500" },
  { title: "New Joiners", value: 0, color: "bg-blue-500", percent: "0%", percentClass: "text-blue-500" },
];

const FiltersPopover = ({ onApply, companies = [], divisions = [], branches = [], departments = [], designations = [] }) => {
  const [filters, setFilters] = useState({});
  const fields = [
    { key: "divisionId", label: "Division", options: divisions.map((d) => ({ label: d.name, value: d.id })) },
    { key: "branchId", label: "Branch", options: branches.map((b) => ({ label: b.name, value: b.id })) },
    { key: "departmentId", label: "Department", options: departments.map((d) => ({ label: d.name, value: d.id })) },
    { key: "designationId", label: "Designation", options: designations.map((d) => ({ label: d.name, value: d.id })) },
    { key: "status", label: "Status", options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }] },
  ];

  const onChange = (field, value) => setFilters((f) => ({ ...f, [field]: value }));

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
  const primaryColor = "#10b981";
  const showCustomButton = true;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState("");
  const [filterParams, setFilterParams] = useState({});
  const [visibleColumns, setVisibleColumns] = useState([
    "employeeCode",
    "attendanceId",
    "firstName",
    "lastName",
    "dateOfJoining",
    "reportingManager",
    "employeeType",
    "status",
    "shiftType",
    "actions",
  ]);
  const [viewMode, setViewMode] = useState("table");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPagination({ current: 1, pageSize: 10, total: 1 });
      setLoading(false);
    }, 500);
  }, []);

  const allColumns = [
    {
      title: "S.No",
      key: "serial",
      render: (_, __, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profile",
      render: (_, record) => (
        <Avatar
          src={record.profileImage}
          icon={!record.profileImage && <UserOutlined />}
          style={{
            backgroundColor: "#EDE9FE",
            color: primaryColor,
            cursor: "pointer",
          }}
          size={40}
        />
      ),
    },
    { title: "Employee Code", dataIndex: "employeeCode", key: "employeeCode" },
    { title: "Attendance ID", dataIndex: "attendanceId", key: "attendanceId" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Date of Joining", dataIndex: "dateOfJoining", key: "dateOfJoining" },
    { title: "Reporting Manager", dataIndex: "reportingManager", key: "reportingManager" },
    { title: "Employee Type", dataIndex: "employeeType", key: "employeeType" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={s === "active" ? "green" : "red"}>{s?.[0].toUpperCase() + s.slice(1)}</Tag>,
    },
    { title: "Shift Type", dataIndex: "shiftType", key: "shiftType" },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />}>View</Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>Edit</Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />}>Delete</Menu.Item>
            </Menu>
          }
        >
          <EllipsisOutlined style={{ fontSize: 18, cursor: "pointer", color: primaryColor }} rotate={90} />
        </Dropdown>
      ),
    },
  ];

  const columns = allColumns.filter((c) => visibleColumns.includes(c.key));

  return (
    <div className="bg-white p-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.title} className="flex flex-row items-center gap-3 shadow">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${s.color}`}>
              <UserOutlined className="text-white text-xl" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400">{s.title}</div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className={`text-xs ${s.percentClass}`}>{s.percent}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
        <h1 className="text-xl font-semibold">Employee</h1>
        <Space wrap>
          <Input.Search placeholder="Search name" allowClear onSearch={(val) => setSearchText(val)} style={{ width: 200 }} />
          <Popover
            content={
              <FiltersPopover
                onApply={(filters) => setFilterParams(filters)}
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
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
                        onChange={(chk) =>
                          setVisibleColumns((vs) => (chk ? [...vs, col.key] : vs.filter((k) => k !== col.key)))
                        }
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
            icon={viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />}
            onClick={() => setViewMode((m) => (m === "table" ? "card" : "table"))}
          />
        </Space>
      </div>

      {/* Table */}
      {viewMode === "table" && (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={employees}
            size="small"
            loading={loading}
            pagination={pagination}
            rowKey="key"
            scroll={{ x: "max-content" }}
            bordered
          />
        </div>
      )}

      {/* Add Modal */}
      <Modal
        title="Add Employee"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
          onFinish={(values) => {
            const newEmployee = { ...values, key: employees.length + 1, status: values.status || "active", profileImage };
            setEmployees((prev) => [...prev, newEmployee]);
            message.success("Employee added successfully!");
            form.resetFields();
            setProfileImage(null);
            setAddModalVisible(false);
          }}
        >
          <Form.Item label="Profile Picture">
            <div className="flex items-center gap-4">
              <div
                className="rounded-full flex items-center justify-center overflow-hidden bg-gray-100"
                style={{ width: 64, height: 64 }}
              >
                {profileImage ? (
                  <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <UserOutlined style={{ fontSize: 28, color: "#bfbfbf" }} />
                )}
              </div>

              <Upload
                beforeUpload={(file) => {
                  setProfileImage(URL.createObjectURL(file));
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
              </Upload>
            </div>
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="employeeCode" label="Employee Code" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="attendanceId" label="Attendance ID"rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="reportingManager" label="Reporting Manager" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="employeeType" label="Employee Type" rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                <Option value="permanent">Permanent</Option>
                <Option value="contract">Contract</Option>
                <Option value="intern">Intern</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item name="shiftType" label="Shift Type" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;
