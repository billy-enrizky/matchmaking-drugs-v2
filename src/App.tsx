import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AccountSetup } from './pages/AccountSetup';
import { Login } from './pages/Login';
import { RequestDrugs } from './pages/RequestDrugs';
import { ProvideDrugs } from './pages/ProvideDrugs';
import { RequestorDashboard } from './pages/RequestorDashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { Messaging } from './pages/Messaging';
import { SubmissionStatus } from './pages/SubmissionStatus';
import { NotFound } from './pages/NotFound';
import { AuthCheck } from './components/AuthCheck';
import { useAuthStore } from './stores/authStore';

// Authentication wrapper component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="account-setup" element={<AccountSetup />} />
          <Route path="login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="request-drugs" element={
            <ProtectedRoute element={<RequestDrugs />} />
          } />
          <Route path="provide-drugs" element={
            <ProtectedRoute element={<ProvideDrugs />} />
          } />
          <Route path="requester-dashboard" element={
            <ProtectedRoute element={<RequestorDashboard />} />
          } />
          <Route path="provider-dashboard" element={
            <ProtectedRoute element={<ProviderDashboard />} />
          } />
          <Route path="messaging/:matchId" element={
            <ProtectedRoute element={<Messaging />} />
          } />
          <Route path="submission-status/:type" element={
            <ProtectedRoute element={<SubmissionStatus />} />
          } />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;