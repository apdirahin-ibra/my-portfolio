import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;