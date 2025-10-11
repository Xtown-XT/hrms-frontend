// // 
// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Row,
//   Col,
//   Button,
//   TimePicker,
//   Switch,
//   message,
//   DatePicker,
// } from "antd";

// import { useNavigate, useLocation } from "react-router-dom";
// import dayjs from "dayjs";

// import { shiftService } from "../../services/shift";

// const Shiftform = () => {
//   const [form] = Form.useForm();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const [messageApi, contextHolder] = message.useMessage();
//   const location = useLocation();

//   const { isEdit = false, initialValues = {} } = location.state || {};

//   useEffect(() => {
//     if (isEdit && initialValues && Object.keys(initialValues).length) {
//       form.setFieldsValue({
//         employee_id: initialValues.employee_id, // changed from shift
//         shift_type: initialValues.shift_type,
//         start_time: initialValues.start_time
//           ? dayjs(initialValues.start_time, "HH:mm:ss")
//           : null,
//         end_time: initialValues.end_time
//           ? dayjs(initialValues.end_time, "HH:mm:ss")
//           : null,
//         min_in_time: initialValues.min_in_time
//           ? dayjs(initialValues.min_in_time, "HH:mm:ss")
//           : null,
//         max_out_time: initialValues.max_out_time
//           ? dayjs(initialValues.max_out_time, "HH:mm:ss")
//           : null,
//         break_start_time: initialValues.break_start_time
//           ? dayjs(initialValues.break_start_time, "HH:mm:ss")
//           : null,
//         break_end_time: initialValues.break_end_time
//           ? dayjs(initialValues.break_end_time, "HH:mm:ss")
//           : null,
//         total_hours: initialValues.total_hours,
//         is_night_shift: initialValues.is_night_shift || false,
//         status: initialValues.status?.toLowerCase() || "inactive",
//       });
//     }
//   }, [isEdit, initialValues, form]);

//   const handleFormSubmit = async (values) => {
//     setIsSubmitting(true);

//     const formatTime = (time) => (time ? dayjs(time).format("HH:mm:ss") : null);

//     const data = {
//       employee_id: values.employee_id, // changed from shift
//       shift_type: values.shift_type,
//       start_time: formatTime(values.start_time),
//       end_time: formatTime(values.end_time),
//       min_in_time: formatTime(values.min_in_time),
//       max_out_time: formatTime(values.max_out_time),
//       break_start_time: formatTime(values.break_start_time),
//       break_end_time: formatTime(values.break_end_time),
//       total_hours: values.total_hours,
//       is_night_shift: values.is_night_shift || false,
//       status: isEdit ? values.status?.toLowerCase() || "inactive" : "active",
//     };

//     try {
//       if (isEdit) {
//         await shiftService.updateShift(initialValues.id, data);
//         messageApi.success("Shift updated successfully");
//       } else {
//         await shiftService.createShift(data);
//         messageApi.success("Shift created successfully");
//       }

//       form.resetFields();

//       navigate("/hrms/pages/shift", {
//         state: {
//           message: isEdit
//             ? "Shift updated successfully"
//             : "Shift created successfully",
//         },
//       });
//     } catch (error) {
//       messageApi.error("Operation failed");
//       console.error("Shift operation failed:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       {contextHolder}

//       <div className="p-6 max-w-6xl mx-auto rounded">
//         <h2 className="text-xl font-semibold mb-4">
//           {isEdit ? "Edit Shift" : "Add Shift"}
//         </h2>

//         <Form
//           layout="vertical"
//           form={form}
//           onFinish={handleFormSubmit}
//           initialValues={{ status: "active", is_night_shift: false }}
//         >
//           <Row gutter={[16, 16]}>
//             {/* Employee ID field */}
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="employee_id"
//                 label="Employee ID"
//                 rules={[{ required: true, message: "Please enter Employee ID" }]}
//               >
//                 <Input placeholder="Enter Emp ID" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="Department"
//                 label="Department"
//                 rules={[{ required: true, message: "Please enter Department" }]}
//               >
//                 <Input placeholder="Enter Department" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="Designation"
//                 label="Designation"
//                 rules={[{ required: true, message: "Please select Designation" }]}
//               >
//                 <Input placeholder="Enter Designation" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="Shift Name"
//                 label="Shift Name"
//                 rules={[{ required: true, message: "Please select Shift Name" }]}
//               >
//                 <Input placeholder="Enter Sift Name" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12}>
//               <Form.Item name="Shift timing" label="Shift Timing">
//                 <TimePicker format="HH:mm:ss" className="w-full" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12}>
//               <Form.Item name="start date" label="Start Date">
//                <DatePicker className="w-full" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12}>
//               <Form.Item name="end date" label="End Date">
//                 <DatePicker className="w-full" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="Assignment type"
//                 label="Assignment Type"
//                 rules={[{ required: true, message: "Please select Assignment Type" }]}
//               >
//                 <Select placeholder="Select Assignment Type">
//                         <Option value="permanent">Permanent</Option>
//                         <Option value="temporary">Temporary</Option>
//                       </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="is_night_shift"
//                 label="Night Shift"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>

//             {isEdit && (
//               <Col xs={24} sm={12}>
//                 <Form.Item
//                   name="status"
//                   label="Status"
//                   rules={[{ required: true, message: "Please select status" }]}
//                 >
//                   <Select placeholder="Select status">
//                     <Select.Option value="active">Active</Select.Option>
//                     <Select.Option value="inactive">Inactive</Select.Option>
//                   </Select>
//                 </Form.Item>
//               </Col>
//             )}
//           </Row>

//           <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
//             <Button
//               danger
//               onClick={() => navigate("/hrms/pages/shift")}
//               className="w-full sm:w-auto"
//             >
//               Cancel
//             </Button>

//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={isSubmitting}
//               className="w-full sm:w-auto"
//             >
//               Submit
//             </Button>
//           </div>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default Shiftform;


