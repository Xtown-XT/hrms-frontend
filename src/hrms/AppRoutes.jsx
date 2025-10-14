import { Routes, Route } from "react-router-dom";
import RoleMaster from "./pages/Rolemaster/RoleMasters";
import HrmsDashboard from "./pages/Dashboard";
import AttendanceMaster from "./pages/AttendanceMaster/AttendanceMaster";
import Shift from "./pages/ShiftMaster/Shift";
import Shiftform from "./pages/ShiftMaster/Shiftform";
import Employee from "./pages/EmployeeMaster/Employee/Employee.jsx";
import EmployeeForm from "./pages/EmployeeMaster/Employee/Employeeform";
import EmployeeDetails from "./pages/EmployeeMaster/Employee/EmployeeDetails";
import Department from "./pages/EmployeeMaster/Department/Department.jsx";
import Designation from "./pages/EmployeeMaster/Designation/Designation.jsx";
import EmployeePersonal from "./pages/EmployeeMaster/Employee/EmployeePersonal.jsx";


export const hrmsMenuItems = [
  {
    icon: <></>, // replace with icon if needed
    key: "employee",
    label: "Employee",
    children: [
      { key: "/hrms/pages/employee", label: "Employee List" },
      { key: "/hrms/pages/employeedetails", label: "Employee Details" },
      { key: "/hrms/pages/Department", label: "Department" },
      { key: "/hrms/pages/Designation", label: "Designation" },
    ],
  },
  { icon: <></>, key: "/hrms/pages/rolemaster", label: "Role Master" },
  { icon: <></>, key: "/hrms/pages/shift", label: "Shift" },
  { icon: <></>, key: "/hrms/pages/attendance", label: "Attendance" },
];

const HRMSRoutes = () => {
  return (
    <Routes>
      <Route path="pages/employee" element={<Employee />} />
      <Route path="pages/employee/:id" element={<EmployeePersonal />} /> {/* Personal page */}
      <Route path="pages/create" element={<EmployeeForm />} />
      <Route path="pages/employeedetails" element={<EmployeeDetails />} />
      <Route path="pages/Department" element={<Department />} />
      <Route path="pages/Designation" element={<Designation />} />
      <Route path="pages/dashboard" element={<HrmsDashboard />} />
      <Route path="pages/attendance" element={<AttendanceMaster />} />
      <Route path="pages/shift" element={<Shift />} />
      <Route path="pages/createshift" element={<Shiftform />} />
      <Route path="pages/rolemaster" element={<RoleMaster />} />
    </Routes>
  );
};

export default HRMSRoutes;
