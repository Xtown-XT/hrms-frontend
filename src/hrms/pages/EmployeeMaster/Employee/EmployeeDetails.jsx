
import React, { useState } from "react";
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
  Space,
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
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const { Option } = Select;

/* ---------------- Filters Popover ---------------- */
const FiltersPopover = ({ onApply }) => {
  const [filters, setFilters] = useState({});

  const fields = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  const onChange = (field, value) => setFilters((f) => ({ ...f, [field]: value }));

  return (
    <div style={{ padding: 10, width: 240 }}>
      {fields.map(({ key, label, options }) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <Select
            allowClear
            placeholder={`Select ${label}`}
            style={{ width: "100%" }}
            value={filters[key]}
            onChange={(val) => onChange(key, val)}
          >
            {options.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
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

/* ---------------- Main Employee Component ---------------- */
const Employee = () => {
  const primaryColor = "#7C3AED";
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  /* ---------- Handle Actions ---------- */
  const handleActionClick = (key, record) => {
    if (key === "view") {
      setSelectedEmployee(record);
      setModalVisible(true);
    } else if (key === "edit") {
      setIsEditing(true);
      setSelectedEmployee(record);
      setProfileImage(record.profileImage || null);
      form.setFieldsValue({
        first_name: record.first_name,
        last_name: record.last_name,
        employeeCode: record["employee code"],
        attendanceId: record["attendance id"],
        dateOfJoining: moment(record["date of joining"]),
        reportingManager: record["reporting manager"],
        employeeType: record["employee type"],
        shiftType: record["shift type"],
        status: record.status,
      });
      setAddEditModalVisible(true);
    } else if (key === "delete") {
      Modal.confirm({
        title: "Delete Employee",
        content: `Are you sure you want to delete ${record.first_name}?`,
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          setEmployees((prev) => prev.filter((e) => e.key !== record.key));
          message.success("Employee deleted successfully!");
        },
      });
    }
  };

  /* ---------- Profile Image Edit/Remove ---------- */
  const handleProfileChange = (file, record) => {
    const imageUrl = URL.createObjectURL(file);
    if (record) {
      setEmployees((prev) =>
        prev.map((e) => (e.key === record.key ? { ...e, profileImage: imageUrl } : e))
      );
    } else {
      setProfileImage(imageUrl);
    }
    message.success("Profile image updated!");
    return false;
  };

  const handleRemoveProfile = (record) => {
    if (record) {
      setEmployees((prev) =>
        prev.map((e) => (e.key === record.key ? { ...e, profileImage: null } : e))
      );
    } else {
      setProfileImage(null);
    }
    message.success("Profile image removed!");
  };

  /* ---------- Profile Edit/Delete Menu ---------- */
  const profileMenu = (record) => (
    <Menu>
      <Menu.Item key="edit">
        <Upload
          showUploadList={false}
          beforeUpload={(file) => handleProfileChange(file, record)}
        >
          <EditOutlined style={{ fontSize: 16, cursor: "pointer" }} />
        </Upload>
      </Menu.Item>
      <Menu.Item key="remove" danger onClick={() => handleRemoveProfile(record)}>
        <DeleteOutlined style={{ fontSize: 16, cursor: "pointer" }} />
      </Menu.Item>
    </Menu>
  );

  /* ---------- Columns ---------- */
  const columns = [
    {
      title: "S.No",
      key: "serial",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profile",
      render: (_, record) => (
        <Dropdown overlay={profileMenu(record)} trigger={["click"]}>
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
        </Dropdown>
      ),
    },
    {
      title: "Employee Code",
      dataIndex: "employee code",
      key: "employee code",
      render: (code, record) => (
        <span
          style={{
            color: primaryColor,
            cursor: "pointer",
            textDecoration: "underline",
          }}
onClick={() => navigate(`/hrms/pages/employee/${record.key}`, { state: { employee: record } })}
        >
          {code}
        </span>
      ),
    },
    { title: "Attendance Id", dataIndex: "attendance id", key: "attendance id" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Date Of Joining", dataIndex: "date of joining", key: "date of joining" },
    { title: "Reporting Manager", dataIndex: "reporting manager", key: "reporting manager" },
    { title: "Employee Type", dataIndex: "employee type", key: "employee type" },
    { title: "Shift Type", dataIndex: "shift type", key: "shift type" },
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
      render: (_, record) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleActionClick(key, record)}
            items={[
              { key: "view", label: "View", icon: <EyeOutlined /> },
              { key: "edit", label: "Edit", icon: <EditOutlined /> },
              { key: "delete", label: "Delete", icon: <DeleteOutlined /> },
            ]}
          />
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <EllipsisOutlined
              style={{
                fontSize: 20,
                cursor: "pointer",
                color: primaryColor,
              }}
              rotate={90}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  /* ---------- Save Add/Edit ---------- */
  const handleSaveEmployee = () => {
    form
      .validateFields()
      .then((values) => {
        const formatted = {
          ...values,
          "date of joining": values.dateOfJoining.format("YYYY-MM-DD"),
          key: isEditing ? selectedEmployee.key : Date.now(),
        };

        if (isEditing) {
          setEmployees((prev) =>
            prev.map((e) =>
              e.key === selectedEmployee.key
                ? { ...e, ...formatted, profileImage }
                : e
            )
          );
          message.success("Employee updated successfully!");
        } else {
          setEmployees((prev) => [
            ...prev,
            {
              ...formatted,
              first_name: values.first_name,
              last_name: values.last_name,
              "employee code": values.employeeCode,
              "attendance id": values.attendanceId,
              "reporting manager": values.reportingManager,
              "employee type": values.employeeType,
              "shift type": values.shiftType,
              status: values.status,
              profileImage,
            },
          ]);
          message.success("Employee added successfully!");
        }

        setAddEditModalVisible(false);
        setProfileImage(null);
        form.resetFields();
        setIsEditing(false);
      })
      .catch(() => {});
  };

  return (
    <div className="bg-white p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
        <h1 className="text-xl font-semibold text-purple-700">Employee</h1>
        <Space>
          <Input.Search placeholder="Search name" allowClear style={{ width: 200 }} />
          <Popover
            content={<FiltersPopover onApply={(filters) => console.log(filters)} />}
            trigger="click"
            placement="bottomLeft"
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Popover>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsEditing(false);
              setProfileImage(null);
              setAddEditModalVisible(true);
            }}
          >
            Add Employee
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Table columns={columns} dataSource={employees} size="small" pagination={false} bordered />

      {/* View Modal */}
      <Modal
        title="Employee Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={<Button onClick={() => setModalVisible(false)}>Close</Button>}
      >
        {selectedEmployee && (
          <div>
            <p>
              <b>Name:</b> {selectedEmployee.first_name} {selectedEmployee.last_name}
            </p>
            <p>
              <b>Employee Code:</b> {selectedEmployee["employee code"]}
            </p>
            <p>
              <b>Attendance ID:</b> {selectedEmployee["attendance id"]}
            </p>
            <p>
              <b>Date of Joining:</b> {selectedEmployee["date of joining"]}
            </p>
            <p>
              <b>Reporting Manager:</b> {selectedEmployee["reporting manager"]}
            </p>
            <p>
              <b>Status:</b> {selectedEmployee.status}
            </p>
          </div>
        )}
      </Modal>

      {/* Add / Edit Modal */}
      <Modal
        title={isEditing ? "Edit Employee" : "Add Employee"}
        open={addEditModalVisible}
        onCancel={() => setAddEditModalVisible(false)}
        onOk={handleSaveEmployee}
        okText={isEditing ? "Update" : "Save"}
      >
        <div style={{ textAlign: "center", marginBottom: 16, position: "relative" }}>
  <Avatar
    src={profileImage}
    icon={!profileImage && <UserOutlined />}
    size={80}
    style={{
      backgroundColor: "#EDE9FE",
      color: primaryColor,
      cursor: "pointer",
    }}
  />
  <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
    {/* Edit Icon */}
    <Upload
      showUploadList={false}
      beforeUpload={(file) => handleProfileChange(file)}
    >
      <EditOutlined
        style={{ fontSize: 20, cursor: "pointer" }}
        title="Edit Profile"
      />
    </Upload>

    {/* Delete Icon */}
    {profileImage && (
      <DeleteOutlined
        style={{ fontSize: 20, cursor: "pointer", color: "red" }}
        onClick={() => handleRemoveProfile()}
        title="Remove Profile"
      />
    )}
  </div>
</div>


        <Form form={form} layout="vertical">
          <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="employeeCode" label="Employee Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="attendanceId" label="Attendance ID">
            <Input />
          </Form.Item>
          <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="reportingManager" label="Reporting Manager">
            <Input />
          </Form.Item>
          <Form.Item name="employeeType" label="Employee Type">
            <Select>
              <Option value="Permanent">Permanent</Option>
              <Option value="Contract">Contract</Option>
              <Option value="Intern">Intern</Option>
            </Select>
          </Form.Item>
          <Form.Item name="shiftType" label="Shift Type">
            <Select>
              <Option value="Day">Day</Option>
              <Option value="Night">Night</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;

// import React, { useState } from "react";
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
//   Space,
//   Form,
//   DatePicker,
//   Upload,
//   Avatar,
// } from "antd";
// import {
//   FilterOutlined,
//   EllipsisOutlined,
//   PlusOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   UploadOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import moment from "moment";
// const { Option } = Select;

// /* ---------------- Filters Popover ---------------- */
// const FiltersPopover = ({ onApply }) => {
//   const [filters, setFilters] = useState({});
//   const fields = [
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
//           <Select
//             allowClear
//             placeholder={`Select ${label}`}
//             style={{ width: "100%" }}
//             value={filters[key]}
//             onChange={(val) => onChange(key, val)}
//           >
//             {options.map((o) => (
//               <Option key={o.value} value={o.value}>
//                 {o.label}
//               </Option>
//             ))}
//           </Select>
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

// /* ---------------- Main Employee Component ---------------- */
// const Employee = () => {
//   const primaryColor = "#7C3AED";
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [profileImage, setProfileImage] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [addEditModalVisible, setAddEditModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();

//   /* ---------- Handle Actions ---------- */
//   const handleActionClick = (key, record) => {
//     if (key === "view") {
//       setSelectedEmployee(record);
//       setModalVisible(true);
//     } else if (key === "edit") {
//       setIsEditing(true);
//       setSelectedEmployee(record);
//       setProfileImage(record.profileImage || null);
//       form.setFieldsValue({
//         first_name: record.first_name,
//         last_name: record.last_name,
//         employeeCode: record["employee code"],
//         attendanceId: record["attendance id"],
//         dateOfJoining: moment(record["date of joining"]),
//         reportingManager: record["reporting manager"],
//         employeeType: record["employee type"],
//         shiftType: record["shift type"],
//         status: record.status,
//         // New personal fields
//         employeeId: record.employeeId,
//         dob: record.dob ? moment(record.dob) : null,
//         gender: record.gender,
//         maritalStatus: record.maritalStatus,
//         bloodGroup: record.bloodGroup,
//         nationality: record.nationality,
//       });
//       setAddEditModalVisible(true);
//     } else if (key === "delete") {
//       Modal.confirm({
//         title: "Delete Employee",
//         content: `Are you sure you want to delete ${record.first_name}?`,
//         okText: "Yes",
//         cancelText: "No",
//         onOk: () => {
//           setEmployees((prev) => prev.filter((e) => e.key !== record.key));
//           message.success("Employee deleted successfully!");
//         },
//       });
//     }
//   };

//   /* ---------- Profile Image Edit/Remove ---------- */
//   const handleProfileChange = (file, record) => {
//     const imageUrl = URL.createObjectURL(file);
//     if (record) {
//       setEmployees((prev) =>
//         prev.map((e) => (e.key === record.key ? { ...e, profileImage: imageUrl } : e))
//       );
//     } else {
//       setProfileImage(imageUrl);
//     }
//     message.success("Profile image updated!");
//     return false;
//   };

//   const handleRemoveProfile = (record) => {
//     if (record) {
//       setEmployees((prev) =>
//         prev.map((e) => (e.key === record.key ? { ...e, profileImage: null } : e))
//       );
//     } else {
//       setProfileImage(null);
//     }
//     message.success("Profile image removed!");
//   };

//   /* ---------- Profile Edit/Delete Icons Menu ---------- */
//   const profileMenu = (record) => (
//     <Menu>
//       <Menu.Item key="edit" style={{ textAlign: "center" }}>
//         <Upload
//           showUploadList={false}
//           beforeUpload={(file) => handleProfileChange(file, record)}
//         >
//           <EditOutlined style={{ fontSize: 18, cursor: "pointer" }} />
//         </Upload>
//       </Menu.Item>
//       <Menu.Item
//         key="remove"
//         danger
//         style={{ textAlign: "center" }}
//         onClick={() => handleRemoveProfile(record)}
//       >
//         <DeleteOutlined style={{ fontSize: 18, cursor: "pointer" }} />
//       </Menu.Item>
//     </Menu>
//   );

//   /* ---------- Columns ---------- */
//   const columns = [
//     {
//       title: "S.No",
//       key: "serial",
//       render: (_, __, i) => i + 1,
//     },
//     {
//       title: "Profile",
//       dataIndex: "profileImage",
//       key: "profile",
//       render: (_, record) => (
//         <Dropdown overlay={profileMenu(record)} trigger={["click"]}>
//           <Avatar
//             src={record.profileImage}
//             icon={!record.profileImage && <UserOutlined />}
//             style={{
//               backgroundColor: "#EDE9FE",
//               color: primaryColor,
//               cursor: "pointer",
//             }}
//             size={40}
//           />
//         </Dropdown>
//       ),
//     },
//     {
//       title: "Employee Code",
//       dataIndex: "employee code",
//       key: "employee code",
//       render: (code, record) => (
//         <span
//           style={{
//             color: primaryColor,
//             cursor: "pointer",
//             textDecoration: "underline",
//           }}
//           onClick={() => navigate(`/employee/${record.key}`)}
//         >
//           {code}
//         </span>
//       ),
//     },
//     { title: "Attendance Id", dataIndex: "attendance id", key: "attendance id" },
//     { title: "First Name", dataIndex: "first_name", key: "first_name" },
//     { title: "Last Name", dataIndex: "last_name", key: "last_name" },
//     { title: "Date Of Joining", dataIndex: "date of joining", key: "date of joining" },
//     { title: "Reporting Manager", dataIndex: "reporting manager", key: "reporting manager" },
//     { title: "Employee Type", dataIndex: "employee type", key: "employee type" },
//     { title: "Shift Type", dataIndex: "shift type", key: "shift type" },
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
//       render: (_, record) => {
//         const menu = (
//           <Menu
//             onClick={({ key }) => handleActionClick(key, record)}
//             items={[
//               { key: "view", label: "View", icon: <EyeOutlined /> },
//               { key: "edit", label: "Edit", icon: <EditOutlined /> },
//               { key: "delete", label: "Delete", icon: <DeleteOutlined /> },
//             ]}
//           />
//         );

//         return (
//           <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
//             <EllipsisOutlined
//               style={{
//                 fontSize: 20,
//                 cursor: "pointer",
//                 color: primaryColor,
//               }}
//               rotate={90}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </Dropdown>
//         );
//       },
//     },
//   ];

//   /* ---------- Save Add/Edit ---------- */
//   const handleSaveEmployee = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         const formatted = {
//           ...values,
//           "date of joining": values.dateOfJoining.format("YYYY-MM-DD"),
//           dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
//           key: isEditing ? selectedEmployee.key : Date.now(),
//         };

//         if (isEditing) {
//           setEmployees((prev) =>
//             prev.map((e) =>
//               e.key === selectedEmployee.key
//                 ? { ...e, ...formatted, profileImage }
//                 : e
//             )
//           );
//           message.success("Employee updated successfully!");
//         } else {
//           setEmployees((prev) => [
//             ...prev,
//             {
//               ...formatted,
//               first_name: values.first_name,
//               last_name: values.last_name,
//               "employee code": values.employeeCode,
//               "attendance id": values.attendanceId,
//               "reporting manager": values.reportingManager,
//               "employee type": values.employeeType,
//               "shift type": values.shiftType,
//               status: values.status,
//               profileImage,
//             },
//           ]);
//           message.success("Employee added successfully!");
//         }

//         setAddEditModalVisible(false);
//         setProfileImage(null);
//         form.resetFields();
//         setIsEditing(false);
//       })
//       .catch(() => {});
//   };

//   return (
//     <div className="bg-white p-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
//         <h1 className="text-xl font-semibold text-purple-700">Employee</h1>
//         <Space>
//           <Input.Search placeholder="Search name" allowClear style={{ width: 200 }} />
//           <Popover
//             content={<FiltersPopover onApply={(filters) => console.log(filters)} />}
//             trigger="click"
//             placement="bottomLeft"
//           >
//             <Button icon={<FilterOutlined />}>Filters</Button>
//           </Popover>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => {
//               form.resetFields();
//               setIsEditing(false);
//               setProfileImage(null);
//               setAddEditModalVisible(true);
//             }}
//           >
//             Add Employee
//           </Button>
//         </Space>
//       </div>

//       {/* Table */}
//       <Table columns={columns} dataSource={employees} size="small" pagination={false} bordered />

//       {/* View Modal */}
//       <Modal
//         title="Employee Details"
//         open={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={<Button onClick={() => setModalVisible(false)}>Close</Button>}
//       >
//         {selectedEmployee && (
//           <div>
//             <p>
//               <b>Name:</b> {selectedEmployee.first_name} {selectedEmployee.last_name}
//             </p>
//             <p>
//               <b>Employee Code:</b> {selectedEmployee["employee code"]}
//             </p>
//             <p>
//               <b>Attendance ID:</b> {selectedEmployee["attendance id"]}
//             </p>
//             <p>
//               <b>Date of Joining:</b> {selectedEmployee["date of joining"]}
//             </p>
//             <p>
//               <b>D.O.B:</b> {selectedEmployee.dob}
//             </p>
//             <p>
//               <b>Gender:</b> {selectedEmployee.gender}
//             </p>
//             <p>
//               <b>Marital Status:</b> {selectedEmployee.maritalStatus}
//             </p>
//             <p>
//               <b>Blood Group:</b> {selectedEmployee.bloodGroup}
//             </p>
//             <p>
//               <b>Nationality:</b> {selectedEmployee.nationality}
//             </p>
//             <p>
//               <b>Status:</b> {selectedEmployee.status}
//             </p>
//           </div>
//         )}
//       </Modal>

//       {/* Add / Edit Modal */}
//       <Modal
//         title={isEditing ? "Edit Employee" : "Add Employee"}
//         open={addEditModalVisible}
//         onCancel={() => setAddEditModalVisible(false)}
//         onOk={handleSaveEmployee}
//         okText={isEditing ? "Update" : "Save"}
//       >
//         {/* Profile Avatar + Icons */}
//         <div style={{ textAlign: "center", marginBottom: 16, position: "relative" }}>
//           <Avatar
//             src={profileImage}
//             icon={!profileImage && <UserOutlined />}
//             size={80}
//             style={{
//               backgroundColor: "#EDE9FE",
//               color: primaryColor,
//               cursor: "pointer",
//             }}
//           />
//           <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
//             {/* Edit Icon */}
//             <Upload
//               showUploadList={false}
//               beforeUpload={(file) => handleProfileChange(file)}
//             >
//               <EditOutlined
//                 style={{ fontSize: 20, cursor: "pointer" }}
//                 title="Edit Profile"
//               />
//             </Upload>

//             {/* Delete Icon */}
//             {profileImage && (
//               <DeleteOutlined
//                 style={{ fontSize: 20, cursor: "pointer", color: "red" }}
//                 onClick={() => handleRemoveProfile()}
//                 title="Remove Profile"
//               />
//             )}
//           </div>
//         </div>

//         {/* Employee Form */}
//         <Form form={form} layout="vertical">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <Form.Item
//               name="employeeId"
//               label="Employee Id"
//               rules={[{ required: true, message: "Please enter Employee ID" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="attendanceId"
//               label="Attendance ID"
//               rules={[{ required: true, message: "Please enter Attendance ID" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="firstName"
//               label="First Name"
//               rules={[{ required: true, message: "Please enter First Name" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="lastName"
//               label="Last Name"
//               rules={[{ required: true, message: "Please enter Last Name" }]}
//             >
//               <Input />
//             </Form.Item>
//           </div>

//           {/* Existing Fields */}
//           <Form.Item name="employeeCode" label="Employee Code" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item name="reportingManager" label="Reporting Manager">
//             <Input />
//           </Form.Item>
//           <Form.Item name="employeeType" label="Employee Type">
//             <Select>
//               <Option value="Permanent">Permanent</Option>
//               <Option value="Contract">Contract</Option>
//               <Option value="Intern">Intern</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="shiftType" label="Shift Type">
//             <Select>
//               <Option value="Day">Day</Option>
//               <Option value="Night">Night</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="status" label="Status">
//             <Select>
//               <Option value="active">Active</Option>
//               <Option value="inactive">Inactive</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
// export default Employee;
