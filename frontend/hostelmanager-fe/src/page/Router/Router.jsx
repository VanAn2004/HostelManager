import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../Home/HomePage";
import LoginPage from "../Auth/LoginPage";
import RegisterPage from "../Auth/RegisterPage";
import ForgotPasswordPage from "../Auth/ForgotPasswordPage";
import ResetPasswordPage from "../Auth/ResetPasswordPage";
import AboutUsPage from "../Home/AboutUsPage";
import ContactPage from "../Home/ContactPage";
import AdminDashboard from "../Admin/AdminDashboard";
import RoomManagement from "../Admin/RoomManagement";
import UserManagement from "../Admin/UserManagement";
import OwnerDashBoard from "../Owner/OwnerDashboard";
import OwnerRoomManagement from "../Owner/Room/OwnerRoomDashboard";
import OwnerTenatDashboard from "../Owner/Tenants/OwnerTenantDashboard";
import OwnerContractDashboard from "../Owner/Contracts/OwnerContractDashboard";
import UtilityDashboard from "../Owner/Utility/UtilityManagementDashboard";
import InvoiceDashboard from "../Owner/Invoice/InvoiceDashboard";
import RoomListPage from "../Room/RoomListPage";
import RoomDetailPage from "../Room/RoomDetailPage";
import ProfilePage from "../Tenant/ProfilePage";
import RoomContractPage from "../Room/MyContract";
import NotFoundPage from "../Room/NotFoundPage";
import MyRoomPage from "../Room/MyRoom";
import RenewContractPage  from "../Room/RenewContract";


const Router = () => {
  return (
    <Routes>
    <Route path="/profile" element={<ProfilePage></ProfilePage>} />
      <Route path="/" element={<Navigate to="/home" />} />{" "}
      {/* Điều hướng mặc định */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />{" "}
      {/* Đặt lại mật khẩu */}
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/rooms" element={<RoomManagement />} />
      <Route path="/admin/users" element={<UserManagement />} />
      {/* Owner */}
      <Route path="/owner/dashboard" element={<OwnerDashBoard />} />
      <Route path="/owner/rooms" element={<OwnerRoomManagement />} />
      <Route path="/owner/tenants" element={<OwnerTenatDashboard />} />
      <Route path="/owner/contracts" element={<OwnerContractDashboard />} />
      <Route path="/owner/utilities" element={<UtilityDashboard />} />
      <Route path="/owner/invoices" element={<InvoiceDashboard />} />
      {/* Room List and Detail */}

      <Route path="/listRoom" element={<RoomListPage />} />
      <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
      <Route path="/MyContract" element={<RoomContractPage />} />
      <Route path="/MyRoom" element={<MyRoomPage />} />
      <Route path="/404" element={<NotFoundPage/>} />
      <Route path="/renew-contract" element={<RenewContractPage />} />
     
    </Routes>
  );
};

export default Router;
