import React from 'react';
import AdminPanel from './components/AdminPanel';
import PortfolioSite from './components/PortfolioSite';

export default function App() {
  return window.location.pathname.startsWith('/admin') ? <AdminPanel /> : <PortfolioSite />;
}
