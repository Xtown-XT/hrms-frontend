// EmployeeForm.jsx

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Space,
  DatePicker,
  message,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { employeeService } from "../../services/employeeservice";
import { companyService } from "../../../company/services/CompanyServices";
import { divisionService } from "../../../company/services/divisionService";
import { departmentService } from "../../../company/services/departmentService";
import { branchServices } from "../../../company/services/CompanyServices";
import { addressServices } from "../../../company/services/AddressServices";
import { roleService } from "../../../hrms/services/Role";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const EmployeeForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [designations, setDesignations] = useState([]);

  const navigate = useNavigate();
  const { state } = useLocation();
  const isEdit = state?.isEdit || false;
  const employeeId = state?.initialValues?.id;
  const pageTitle = isEdit ? "Edit Employee" : "Add Employee";

  // Fetch dropdown lists: company, division, department, branch, country
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [
          companyRes,
          divisionRes,
          departmentRes,
          branchRes,
          countryRes,
        ] = await Promise.all([
          companyService.getCompany(),
          divisionService.getAllDivisions(),
          departmentService.getAllDepartments(),
          branchServices.getBranch(),
          addressServices.getCountry(),
        ]);

        // COMPANY
        let companyList = [];
        if (Array.isArray(companyRes.data?.data?.companies)) {
          companyList = companyRes.data.data.companies;
        } else if (Array.isArray(companyRes.data?.data)) {
          companyList = companyRes.data.data;
        } else if (Array.isArray(companyRes.data)) {
          companyList = companyRes.data;
        }
        setCompanies(companyList);

        // DIVISION
        let divisionList = [];
        if (Array.isArray(divisionRes.data?.divisions)) {
          divisionList = divisionRes.data.divisions;
        } else if (Array.isArray(divisionRes.data)) {
          divisionList = divisionRes.data;
        }
        setDivisions(divisionList);

        // DEPARTMENT
        let departmentList = [];
        if (Array.isArray(departmentRes.data?.departments)) {
          departmentList = departmentRes.data.departments;
        } else if (Array.isArray(departmentRes.data)) {
          departmentList = departmentRes.data;
        }
        setDepartments(departmentList);

        // BRANCH
        let branchList = [];
        if (Array.isArray(branchRes.data?.data?.branches)) {
          branchList = branchRes.data.data.branches;
        } else if (Array.isArray(branchRes.data?.branches)) {
          branchList = branchRes.data.branches;
        } else if (Array.isArray(branchRes.data?.data)) {
          branchList = branchRes.data.data;
        } else if (Array.isArray(branchRes.data)) {
          branchList = branchRes.data;
        }
        setBranches(branchList);

        // COUNTRY
        let countryList = [];
        if (Array.isArray(countryRes.data?.data)) {
          countryList = countryRes.data.data;
        } else if (Array.isArray(countryRes.data)) {
          countryList = countryRes.data;
        }
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        message.error("Failed to fetch dropdown data");
      }
    };

    fetchMasters();
  }, []);

  // Fetch designations
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await roleService.getroleAll();
        let designationList = [];
        if (Array.isArray(response.data?.data)) {
          designationList = response.data.data;
        } else if (Array.isArray(response.data)) {
          designationList = response.data;
        }
        setDesignations(designationList);
      } catch (error) {
        console.error("Error fetching designations:", error);
        message.error("Failed to fetch designations");
      }
    };

    fetchDesignations();
  }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && employeeId) {
      const fetchEmployee = async () => {
        try {
          const response = await employeeService.getEmployeeById(employeeId);
          if (response.success && response.data) {
            const emp = response.data;

            const formValues = {
              employee_code: emp.employee_code,
              first_name: emp.first_name,
              last_name: emp.last_name,
              email: emp.email,
              phone: emp.phone?.replace("+91", ""),
              dob: emp.date_of_birth ? moment(emp.date_of_birth) : null,
              date_of_joining: emp.date_of_joining
                ? moment(emp.date_of_joining)
                : null,
              address_line1: emp.address_line1,
              address_line2: emp.address_line2,
              country: emp.country,
              state: emp.state,
              city: emp.city,
              pincode: emp.pincode?.toString(),
              // companyId: emp.company_id,
              divisionId: emp.division_id,
              departmentId: emp.department_id,
              branchId: emp.branch_id,
              designation_id: emp.designation_id,
              status: emp.status || "active",
            };

            form.setFieldsValue(formValues);

            // Pre‐load states & cities
            if (emp.country) {
              await fetchStates(emp.country);
            }
            if (emp.state) {
              await fetchCities(emp.state);
            }
          } else {
            throw new Error("Failed to fetch employee data");
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
          message.error("Failed to load employee data");
        }
      };

      fetchEmployee();
    }
  }, [form, isEdit, employeeId]);

  // Fetch states by country ID
  const fetchStates = async (countryId) => {
    try {
      const response = await addressServices.getState(countryId);
      let stateList = [];
      if (Array.isArray(response.data?.data)) {
        stateList = response.data.data;
      } else if (Array.isArray(response.data)) {
        stateList = response.data;
      }
      setStates(stateList);
    } catch (error) {
      console.error("Error fetching states:", error);
      message.error("Failed to fetch states");
      setStates([]);
    }
  };

  // Fetch cities by state ID
  const fetchCities = async (stateId) => {
    try {
      const response = await addressServices.getCity(stateId);
      let cityList = [];
      if (Array.isArray(response.data?.data)) {
        cityList = response.data.data;
      } else if (Array.isArray(response.data)) {
        cityList = response.data;
      }
      setCities(cityList);
    } catch (error) {
      console.error("Error fetching cities:", error);
      message.error("Failed to fetch cities");
      setCities([]);
    }
  };

  const handleCountryChange = async (countryId) => {
    form.setFieldsValue({ state: undefined, city: undefined });
    setStates([]);
    setCities([]);
    if (countryId) {
      await fetchStates(countryId);
    }
  };

  const handleStateChange = async (stateId) => {
    form.setFieldsValue({ city: undefined });
    setCities([]);
    if (stateId) {
      await fetchCities(stateId);
    }
  };

  // CREATE logic (unchanged)
  const handleCreate = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        employee_code: values.employee_code,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: `+91${values.phone}`,
        date_of_birth: values.dob ? moment(values.dob).toISOString() : undefined,
        date_of_joining: values.date_of_joining
          ? moment(values.date_of_joining).toISOString()
          : undefined,
        address_line1: values.address_line1,
        address_line2: values.address_line2,
        country: Number(values.country),
        state: Number(values.state),
        city: Number(values.city),
        pincode: Number(values.pincode),
        company_id: Number(values.companyId),
        division_id: Number(values.divisionId),
        department_id: Number(values.departmentId),
        branch_id: Number(values.branchId),
        designation_id: Number(values.designation_id),
        status: values.status?.toLowerCase() || "active",
        is_active: values.status?.toLowerCase() === "active",
      };

      console.log(">>> CREATE PAYLOAD:", payload);
      const response = await employeeService.createEmployee(payload);

      if (response.success) {
        message.success("Employee created successfully");
        navigate("/hrms/pages/employee");
      } else {
        throw new Error(response.error || "API returned failure");
      }
    } catch (error) {
      console.error("Create submission error:", error);
      message.error(error.message || "Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT logic: build full payload and call updateEmployee
  const handleEdit = async (values) => {
    if (!employeeId) {
      message.error("No Employee ID provided for update");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        employee_code: values.employee_code,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: `+91${values.phone}`,
        date_of_birth: values.dob ? moment(values.dob).toISOString() : undefined,
        date_of_joining: values.date_of_joining
          ? moment(values.date_of_joining).toISOString()
          : undefined,
        address_line1: values.address_line1,
        address_line2: values.address_line2,
        country: Number(values.country),
        state: Number(values.state),
        city: Number(values.city),
        pincode: Number(values.pincode),
        company_id: Number(values.companyId),
        division_id: Number(values.divisionId),
        department_id: Number(values.departmentId),
        branch_id: Number(values.branchId),
        designation_id: Number(values.designation_id),
        status: values.status?.toLowerCase() || "active",
        is_active: values.status?.toLowerCase() === "active",
      };

      console.log(">>> EDIT PAYLOAD:", payload);
      const response = await employeeService.updateEmployee(employeeId, payload);

      if (response.success) {
        message.success("Employee updated successfully");
        navigate("/hrms/pages/employee");
      } else {
        throw new Error(response.error || "API returned failure");
      }
    } catch (error) {
      console.error("Edit submission error:", error);
      message.error(error.message || "Failed to update employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  // onFinish decides.CREATE vs. EDIT
  const handleSubmit = async (values) => {
    if (isEdit) {
      await handleEdit(values);
    } else {
      await handleCreate(values);
    }
  };

  return (
    <div className="max-w-8xl mx-auto rounded">
      <h2 className="text-xl font-semibold mb-4">{pageTitle}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: "active" }}
      >
        <Row gutter={16}>
          {/* Employee Code */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="employee_code"
              label="Employee Code"
              rules={[{ required: true, message: "Please enter employee code" }]}
            >
              <Input placeholder="Employee Code" allowClear />
            </Form.Item>
          </Col>

          {/* First Name */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="First Name" allowClear />
            </Form.Item>
          </Col>

          {/* Last Name */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Last Name" allowClear />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="Email" allowClear />
            </Form.Item>
          </Col>

          {/* Phone */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: "Please enter a phone number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              ]}
            >
              <Input addonBefore="+91" maxLength={10} />
            </Form.Item>
          </Col>

          {/* Date of Birth */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select DOB" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* Date of Joining */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="date_of_joining"
              label="Date of Joining"
              rules={[{ required: true, message: "Please select date of joining" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* Designation */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="designation_id"
              label="Designation"
              rules={[{ required: true, message: "Please select designation" }]}
            >
              <Select placeholder="Select designation" showSearch allowClear>
                {designations.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Address Line 1 */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="address_line1"
              label="Address Line 1"
              rules={[{ required: true, message: "Please enter address line 1" }]}
            >
              <TextArea placeholder="Address Line 1" autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Col>

          {/* Address Line 2 */}
          <Col xs={24} sm={8}>
            <Form.Item name="address_line2" label="Address Line 2">
              <TextArea placeholder="Address Line 2" autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Col>

          {/* Country */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please select country" }]}
            >
              <Select
                placeholder="Select country"
                allowClear
                showSearch
                optionFilterProp="children"
                onChange={handleCountryChange}
              >
                {countries.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* State */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select state" }]}
            >
              <Select
                placeholder="Select state"
                allowClear
                showSearch
                optionFilterProp="children"
                onChange={handleStateChange}
              >
                {states.map((s) => (
                  <Option key={s.id} value={s.id}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* City */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please select city" }]}
            >
              <Select placeholder="Select city" allowClear showSearch optionFilterProp="children">
                {cities.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Pincode */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[
                { required: true, message: "Please enter pincode" },
                {
                  pattern: /^\d{6}$/,
                  message: "Please enter a valid 6-digit pincode",
                },
              ]}
            >
              <Input placeholder="Pincode" maxLength={6} allowClear />
            </Form.Item>
          </Col>

          {/* Company */}
          {/* <Col xs={24} sm={8}>
            <Form.Item
              name="companyId"
              label="Company"
              rules={[{ required: true, message: "Please select company" }]}
            >
              <Select placeholder="Select company" showSearch allowClear>
                {companies.map((comp) => (
                  <Option key={comp.id} value={comp.id}>
                    {comp.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}

          {/* Division */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="divisionId"
              label="Division"
              rules={[{ required: true, message: "Please select division" }]}
            >
              <Select placeholder="Select division" showSearch allowClear>
                {divisions.map((div) => (
                  <Option key={div.id} value={div.id}>
                    {div.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Department */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="departmentId"
              label="Department"
              rules={[{ required: true, message: "Please select department" }]}
            >
              <Select placeholder="Select department" showSearch allowClear>
                {departments.map((dep) => (
                  <Option key={dep.id} value={dep.id}>
                    {dep.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Branch */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="branchId"
              label="Branch"
              rules={[{ required: true, message: "Please select branch" }]}
            >
              <Select placeholder="Select branch" showSearch allowClear>
                {branches.map((b) => (
                  <Option key={b.id} value={b.id}>
                    {b.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Status */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select
                placeholder="Select status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="flex justify-end mt-6">
          <Space>
            <Button danger onClick={() => navigate("/hrms/pages/employee")}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                ? "Update Employee"
                : "Add Employee"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployeeForm;
