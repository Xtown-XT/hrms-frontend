import { Routes, Route } from 'react-router-dom';
import Branch from "./pages/Branch";
import Company from "./pages/Company";
import DivisionPage from "./pages/DivisionMaster";
import Department from "./pages/Department";
import { BankOutlined, BranchesOutlined, ShareAltOutlined, ApartmentOutlined } from "@ant-design/icons";
export const companyMenuItems = [
  {
    icon: <BankOutlined />,
    key: "/company/pages/company",
    label: "Company",
  },
  {
    icon: <BranchesOutlined />,
    key: "/company/pages/branch",
    label: "Branch",
  },
  {
    icon: <ApartmentOutlined />,
    key: "/company/pages/department",
    label: "Department",
  },
  {
    icon: <ShareAltOutlined />,
    key: "company/pages/division",
    label: "Division",
  },
];

const CompanyRoutes = () => {
  return (
    <Routes>
      <Route path="pages/company" element={<Company />} />
      <Route path="pages/branch" element={<Branch />} />
      <Route path="pages/department" element={<Department />} />
      <Route path="pages/division" element={<DivisionPage />} />
    </Routes>
  );
};

export default CompanyRoutes;
