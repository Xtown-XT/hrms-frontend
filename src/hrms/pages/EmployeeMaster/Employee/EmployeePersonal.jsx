import React from "react";
import {
    Card,
    Form,
    Input,
    DatePicker,
    Select,
    Checkbox,
    Button,
    message,
    Upload,
    Collapse ,
} from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;

const Employeepersonal = () => {
    const [form] = Form.useForm();

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // Format dates
            const dateFields = [
                "joiningDate",
                "dob",
                "educationStartDate",
                "educationEndDate",
                "experienceStartDate",
                "experienceEndDate",
                "assetIssuedDate",
                "assetReturnDate",
            ];
            dateFields.forEach((field) => {
                if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
            });

            message.success("Employee data saved!");
            console.log("Saved values:", values);
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };

    const handlePinCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        form.setFieldsValue({ pinCode: value });
    };

    const uploadProps = (fieldName) => ({
        beforeUpload: (file) => {
            const isAllowed =
                file.type === "application/pdf" || file.type.startsWith("image/");
            if (!isAllowed) {
                message.error("Only PDF or image files are allowed!");
                return Upload.LIST_IGNORE;
            }
            form.setFieldsValue({ [fieldName]: file });
            return false;
        },
        showUploadList: false,
    });

    const renderUploadedFile = (fieldName) => {
        const file = form.getFieldValue(fieldName);
        if (!file) return null;
        const url = typeof file === "string" ? file : URL.createObjectURL(file);
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 block mt-2"
            >
                View Uploaded File
            </a>
        );
    };

    return (
        <div className="p-4 bg-gray-50">
            <Form form={form} layout="vertical">
                {/* GRID: TWO CARDS PER ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PERSONAL INFORMATION */}
                  <Card title="Personal Information" bordered>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: "Please enter Employee ID" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="attendanceId"
              label="Attendance ID"
              rules={[{ required: true, message: "Please enter Attendance ID" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter First Name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter Last Name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select Date of Birth" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select Gender" }]}
            >
              <Select placeholder="Select">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="maritalStatus"
              label="Marital Status"
              rules={[{ required: true, message: "Please select Marital Status" }]}
            >
              <Select placeholder="Select">
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="bloodGroup"
              label="Blood Group"
              rules={[{ required: true, message: "Please enter Blood Group" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="nationality"
              label="Nationality"
              rules={[{ required: true, message: "Please enter Nationality" }]}
            >
              <Input />
            </Form.Item>
          </div>
     
    </Card>
{/* CONTACT DETAILS */}
<Card title="Contact Details"bordered>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
        <Form.Item
          name="permanentAddress"
          label="Permanent Address"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="sameAsPermanent" valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              if (e.target.checked) {
                form.setFieldsValue({
                  currentAddress: form.getFieldValue("permanentAddress"),
                });
              } else {
                form.setFieldsValue({ currentAddress: "" });
              }
            }}
          >
            Same as Permanent
          </Checkbox>
        </Form.Item>

        <Form.Item
          name="currentAddress"
          label="Current Address"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="pinCode"
          label="Pin Code"
          rules={[{ required: true }]}
        >
          <Input
            maxLength={6}
            onChange={async (e) => {
              const value = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ pinCode: value });

              if (value.length === 6) {
                try {
                  // Fetch city & state from API
                  const response = await fetch(
                    `https://api.postalpincode.in/pincode/${value}`
                  );
                  const data = await response.json();
                  if (
                    data[0].Status === "Success" &&
                    data[0].PostOffice &&
                    data[0].PostOffice.length > 0
                  ) {
                    const postOffice = data[0].PostOffice[0];
                    form.setFieldsValue({
                      city: postOffice.District,
                      state: postOffice.State,
                    });
                  } else {
                    form.setFieldsValue({ city: "", state: "" });
                    message.error("Invalid Pin Code or data not found");
                  }
                } catch (error) {
                  console.error(error);
                  message.error("Failed to fetch City/State");
                }
              } else {
                form.setFieldsValue({ city: "", state: "" });
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="mobileNumber"
          label="Mobile Number"
          rules={[
            { required: true, message: "Please enter Mobile Number" },
            { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
          ]}
        >
          <Input
            addonBefore="+91"
            maxLength={10}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
          />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
      </div>
</Card>
{/* EMERGENCY DETAILS */}
<Card title="Emergency Contact Details" bordered>
  <Form.List name="emergencyContacts" initialValue={[{}]}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...rest }) => (
          <div
            key={key}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4 rounded-lg bg-gray-50 relative p-4"
          >
            {/* Remove Icon (top-right corner) */}
            <Button
              type="text"
              danger
              icon={<MinusCircleOutlined />}
              onClick={() => remove(name)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            />

            <Form.Item
              {...rest}
              name={[name, "contactName"]}
              label="Name"
              rules={[{ required: true, message: "Please enter Name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...rest}
              name={[name, "relationship"]}
              label="Relationship"
              rules={[{ required: true, message: "Please enter Relationship" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...rest}
              name={[name, "phoneNumber"]}
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter Phone Number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number",
                },
              ]}
            >
              <Input
                addonBefore="+91"
                maxLength={10}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
              />
            </Form.Item>

            <Form.Item
              {...rest}
              name={[name, "address"]}
              label="Address"
              rules={[{ required: true, message: "Please enter Address" }]}
            >
              <Input.TextArea rows={1} />
            </Form.Item>
          </div>
        ))}

        {/* Add new contact icon only */}
        <div className="flex justify-center mt-2">
          <PlusOutlined
            onClick={() => add()}
            style={{
              fontSize: 22,
              color: "#7C3AED",
              cursor: "pointer",
               
                position: "absolute",
                top: 8,
                right: 8,
              }}
           
          />
        </div>
      </>
    )}
  </Form.List>
</Card>

                    {/* JOB DETAILS */}
                    <Card title="Job Details"bordered>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                            <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="manager" label="Reporting Manager" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="employeeType" label="Employee Type" rules={[{ required: true }]}>
                                <Select placeholder="Select Type">
                                    <Option value="full-time">Full-time</Option>
                                    <Option value="part-time">Part-time</Option>
                                    <Option value="intern">Intern</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="joiningDate" label="Date of Joining" rules={[{ required: true }]}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="shift" label="Shift" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </div>
                    </Card>

                    {/* GOVERNMENT DETAILS */}
                    <Card title="Government Details" bordered>
                         
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                            <Form.Item
                                name="aadhaar"
                                label="Aadhaar No"
                                rules={[{ required: true, message: "Please enter Aadhaar Number" }]}
                            >
                                <Input
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault(); // ❌ Block letters/symbols
                                        }
                                    }}
                                />
                            </Form.Item>

                            <Form.Item name="panNumber" label="PAN Number" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="pf"
                                label="Provident Fund (PF) / ESI / SSN"
                                rules={[{ required: true, message: "Please enter PF/ESI/SSN Number" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="tax"
                                label="Tax Category / TDS Information"
                                rules={[{ required: true, message: "Please enter Tax/TDS Information" }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </Card>

                    {/* BANK DETAILS */}
                    <Card title="Bank Details" bordered>
                      
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="account no"
                            label="Account No"
                            rules={[{ required: true, message: "Please enter Account No" }]}
                        >
                            <Input
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault(); // ❌ Block letters/symbols
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item name="ifscCode" label="IFSC Code" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="branchName" label="Branch Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        </div>
                    </Card>

                    {/* EDUCATION DETAILS */}
                    <Card title="Education Details" bordered>
                         
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        <Form.Item name="qualification" label="Qualification" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="specialization"
                            label="Specialization"
                            rules={[{ required: true, message: "Please enter your Specialization" }]}
                        >
                            <Input placeholder="e.g. Computer Science, Marketing" />
                        </Form.Item>
                        <Form.Item
                            name="university"
                            label="University / Board"
                            rules={[{ required: true, message: "Please enter your University / Board" }]}
                        >
                            <Input placeholder="e.g. Anna University, CBSE" />
                        </Form.Item>

                        <Form.Item name="institution" label="Institution" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="educationStartDate" label="Start Date">
                            <DatePicker picker="month" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="educationEndDate" label="End Date">
                            <DatePicker picker="month" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                            name="percentage"
                            label="Percentage / GPA / CGPA"
                            rules={[{ required: true, message: "Please enter your Percentage / GPA / CGPA" }]}
                        >
                            <Input placeholder="e.g. 85% or 8.5 CGPA" />
                        </Form.Item>
                        <Form.Item
                            name="additionalCourses"
                            label="Additional Courses (if any)"
                            rules={[{ required: true, message: "Please enter Additional Courses or write N/A" }]}
                        >
                            <Input.TextArea rows={2} placeholder="e.g. Data Science, Cloud Computing" />
                        </Form.Item>
                        </div>
                    </Card>

                    {/* EXPERIENCE DETAILS */}
                    <Card title="Experience Details" bordered>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="expDesignation" label="Designation" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: "Please enter your Department" }]}
                        >
                            <Input placeholder="e.g. IT, HR, Finance" />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: "Please enter your Work Location" }]}
                        >
                            <Input placeholder="e.g. Chennai, Bangalore" />
                        </Form.Item>
                        <Form.Item name="experienceStartDate" label="Start Date">
                            <DatePicker picker="month" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="experienceEndDate" label="End Date">
                            <DatePicker picker="month" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                            name="achievements"
                            label="Key Achievements / Responsibilities"
                            rules={[{ required: true, message: "Please enter your Key Achievements / Responsibilities" }]}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder=""
                            />
                        </Form.Item>
                        </div>
                    </Card>

                    {/* PAYROLL DETAILS */}
                    <Card title='Payroll Details" 'bordered>
                         
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        <Form.Item name="basicSalary" label="Basic Salary" rules={[{ required: true }]}>
                            <Input prefix="₹" />
                        </Form.Item>
                        <Form.Item
                   name="allowanceType"
                 label="Allowances"
                  rules={[{ required: true, message: "Please select an allowance type" }]}
                   >
                    <Select placeholder="Select Allowance Type">
                  <Option value="hra">HRA (House Rent Allowance)</Option>
                  <Option value="da">DA (Dearness Allowance)</Option>
                <Option value="medical">Medical Allowance</Option>
                 <Option value="conveyance">Conveyance Allowance</Option>
                       </Select>
                           </Form.Item>
                        <Form.Item name="bonus/incentives" label="Bonus/Incentives">
                            <Input />
                        </Form.Item>
                       <Form.Item
  name="deductions"
  label="Deductions"
  rules={[{ required: true, message: "Please select or enter a deduction" }]}
>
  <Select
    mode="tags"
    style={{ width: "100%" }}
    placeholder="Select or type a other deduction"
  >
    <Option value="pf">Provident Fund (PF)</Option>
    <Option value="tax">Tax</Option>
    <Option value="insurance">Insurance</Option>
    <Option value="loan">Loan</Option>
  </Select>
</Form.Item>
                        <Form.Item name="net salary" label="Net Salary">
                            <Input />
                        </Form.Item>
                        </div>
                    </Card>

                    {/* DOCUMENT UPLOAD */}
                    <Card title="Document Verification Upload" bordered>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                        <Form.Item label="Resume">
                            <Upload {...uploadProps("resumeUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Resume/CV</Button>
                            </Upload>
                            {renderUploadedFile("resumeUpload")}
                        </Form.Item>
                        <Form.Item label="Aadhar">
                            <Upload {...uploadProps("offerLetterUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Aadhar</Button>
                            </Upload>
                            {renderUploadedFile("offerLetterUpload")}
                        </Form.Item>
                        <Form.Item label="PAN">
                            <Upload {...uploadProps("idProofUpload")}>
                                <Button icon={<UploadOutlined />}>Upload PAN</Button>
                            </Upload>
                            {renderUploadedFile("idProofUpload")}
                        </Form.Item>
                         
                        <Form.Item label="Degree Certificate">
                            <Upload {...uploadProps("DegreeUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Degree</Button>
                            </Upload>
                            {renderUploadedFile("DegreeUpload")}
                        </Form.Item>
                        <Form.Item label="Marksheet">
                            <Upload {...uploadProps("MarksheetUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Marksheet</Button>
                            </Upload>
                            {renderUploadedFile("MarksheetUpload")}
                        </Form.Item>
                        <Form.Item label="Document Upload">
                            <Upload {...uploadProps("RelievingUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Relieving Letter</Button>
                            </Upload>
                            {renderUploadedFile("RelievingUpload")}
                        </Form.Item>
                        <Form.Item label="Experience Letter">
                            <Upload {...uploadProps("Experience LetterUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Experience Letter</Button>
                            </Upload>
                            {renderUploadedFile("Experience LetterUpload")}
                        </Form.Item>
                        <Form.Item label="Offer Letter">
                            <Upload {...uploadProps("Offer Letter Upload")}>
                                <Button icon={<UploadOutlined />}>Upload Offer Letter</Button>
                            </Upload>
                            {renderUploadedFile("Offer LetterUpload")}
                        </Form.Item>
                        <Form.Item label="Passport">
                            <Upload {...uploadProps("idProofUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Passport</Button>
                            </Upload>
                            {renderUploadedFile("idProofUpload")}
                        </Form.Item>
                        <Form.Item label="Driving License">
                            <Upload {...uploadProps("idProofUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Driving License</Button>
                            </Upload>
                            {renderUploadedFile("idProofUpload")}
                        </Form.Item>
                        <Form.Item label="Address Proof">
                            <Upload {...uploadProps("idProofUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Address Proof</Button>
                            </Upload>
                            {renderUploadedFile("idProofUpload")}
                        </Form.Item>
                        <Form.Item label="Bank Proof">
                            <Upload {...uploadProps("idProofUpload")}>
                                <Button icon={<UploadOutlined />}>Upload Bank Proof</Button>
                            </Upload>
                            {renderUploadedFile("idProofUpload")}
                        </Form.Item>
                        </div>
                    </Card>

                    {/* ASSETS DETAILS */}
                    <Card title="Assets Details" bordered>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">

                        <Form.Item name="assetType" label="Employee ID" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="assetType" label="Asset Type" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="assetId" label="Model" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="assetIssuedDate" label="Issued Date">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="assetReturnDate" label="Return Date">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                        </div>
                    </Card>
                </div>

                {/* SAVE BUTTON */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button onClick={() => form.resetFields()}>Cancel</Button>
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Employeepersonal;
