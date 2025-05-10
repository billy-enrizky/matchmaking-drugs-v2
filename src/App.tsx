import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AccountSetup } from './pages/AccountSetup';
import { RequestDrugs } from './pages/RequestDrugs';
import { ProvideDrugs } from './pages/ProvideDrugs';
import { RequestorDashboard } from './pages/RequestorDashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { Messaging } from './pages/Messaging';
import { SubmissionStatus } from './pages/SubmissionStatus';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="account-setup" element={<AccountSetup />} />
          <Route path="request-drugs" element={<RequestDrugs />} />
          <Route path="provide-drugs" element={<ProvideDrugs />} />
          <Route path="requester-dashboard" element={<RequestorDashboard />} />
          <Route path="provider-dashboard" element={<ProviderDashboard />} />
          <Route path="messaging/:matchId" element={<Messaging />} />
          <Route path="submission-status/:type" element={<SubmissionStatus />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;