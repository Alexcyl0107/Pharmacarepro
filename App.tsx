import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Prescriptions from './pages/Prescriptions';
import AIAssistant from './components/AIAssistant';
import Clients from './pages/Clients';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import { 
  INITIAL_MEDICINES, 
  INITIAL_PRESCRIPTIONS, 
  MOCK_SALES_HISTORY, 
  INITIAL_CLIENTS, 
  INITIAL_SUPPLIERS,
  INITIAL_SETTINGS 
} from './constants';
import { Medicine, CartItem, Sale, Client, Supplier, Prescription, PharmacySettings, PrescriptionStatus } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // -- Global State --
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES_HISTORY);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [settings, setSettings] = useState<PharmacySettings>(INITIAL_SETTINGS);

  // -- Handlers: Inventory --
  const handleAddMedicine = (med: Medicine) => {
    setMedicines(prev => [...prev, med]);
  };

  const handleUpdateMedicine = (updatedMed: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  // -- Handlers: POS (Sales) --
  const handleCompleteSale = (items: CartItem[], total: number, paymentMethod: any) => {
    // 1. Create Sale Record
    const newSale: Sale = {
      id: `s${Date.now()}`,
      date: new Date().toISOString(),
      items: items,
      total: total,
      tax: 0,
      discount: 0,
      paymentMethod: paymentMethod,
      cashierId: 'current-user'
    };
    setSales(prev => [...prev, newSale]);

    // 2. Update Stock
    const newMedicines = medicines.map(med => {
      const soldItem = items.find(i => i.id === med.id);
      if (soldItem) {
        return { ...med, stock: Math.max(0, med.stock - soldItem.quantity) };
      }
      return med;
    });
    setMedicines(newMedicines);

    // 3. Update Client History if needed (skipped for simple demo, usually link sale to client)
  };

  // -- Handlers: Clients --
  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  // -- Handlers: Prescriptions --
  const handleAddPrescription = (prescription: Prescription) => {
    setPrescriptions(prev => [prescription, ...prev]);
  };

  const handleUpdatePrescriptionStatus = (id: string, status: PrescriptionStatus) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  // -- Handlers: Suppliers --
  const handleAddSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };

  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden">
          {currentPage === 'dashboard' && (
            <Dashboard 
              medicines={medicines} 
              sales={sales} 
              prescriptions={prescriptions}
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}
          
          {currentPage === 'inventory' && (
            <Inventory 
              medicines={medicines} 
              onAddMedicine={handleAddMedicine}
              onUpdateMedicine={handleUpdateMedicine}
              onDeleteMedicine={handleDeleteMedicine}
            />
          )}

          {currentPage === 'pos' && (
            <POS 
              medicines={medicines} 
              onCompleteSale={handleCompleteSale}
            />
          )}

          {currentPage === 'prescriptions' && (
            <Prescriptions 
              prescriptions={prescriptions}
              onAddPrescription={handleAddPrescription}
              onUpdateStatus={handleUpdatePrescriptionStatus}
            />
          )}

          {currentPage === 'clients' && (
            <Clients 
              clients={clients}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
            />
          )}

          {currentPage === 'suppliers' && (
            <Suppliers 
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
            />
          )}

          {currentPage === 'reports' && (
            <AIAssistant medicines={medicines} sales={sales} />
          )}

          {currentPage === 'settings' && (
            <Settings settings={settings} onUpdateSettings={setSettings} />
          )}
        </main>
      </div>
    </Router>
  );
};

export default App;