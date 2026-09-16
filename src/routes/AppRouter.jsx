import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ProductsPage from "../pages/public/ProductsPage";
import TankDetailsPage from "../pages/public/TankDetailsPage";
import ContactPage from "../pages/public/ContactPage";

import LoginPage from "../pages/admin/LoginPage";
import DashboardPage from "../pages/admin/DashboardPage";

import ProtectedRoute from "./ProtectedRoute";
import TankManagementPage from "../pages/admin/TankManagementPage";
import ContactInformationPage from "../pages/admin/ContactInformationPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================
            PUBLIC WEBSITE
        ================================================= */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />

          <Route path="/products" element={<ProductsPage />} />

          <Route path="/products/:tankId" element={<TankDetailsPage />} />

          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route path="/kentankd/login" element={<LoginPage />} />

        {/* =================================================
            PROTECTED ADMIN
        ================================================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/kentankd/dashboard" element={<DashboardPage />} />
            <Route path="/kentankd/tanks" element={<TankManagementPage />} />
            <Route
              path="/kentankd/contact"
              element={<ContactInformationPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
