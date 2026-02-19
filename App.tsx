import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { EntryForm } from './components/EntryForm';
import { EntryList } from './components/EntryList';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { User, OvertimeEntry } from './types';
import { mockService } from './services/mockService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [entries, setEntries] = useState<OvertimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminTargetUser, setAdminTargetUser] = useState<User | null>(null);

  // Fetch entries helper
  const fetchEntries = async (targetUserId?: string) => {
    const uid = targetUserId || currentUser?.id;
    if (!uid) return;
    
    setIsLoading(true);
    try {
      const data = await mockService.getEntries(uid);
      setEntries(data);
    } catch (error) {
      console.error("Failed to load entries", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load initial data or reload when current user changes
  useEffect(() => {
    if (currentUser) {
      // Always load current user's data initially
      fetchEntries(currentUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEntries([]);
    setAdminTargetUser(null);
  };

  const handleEntrySuccess = () => {
    fetchEntries(currentUser?.id);
    setCurrentView('dashboard');
  };

  const handleChangeView = (view: string) => {
    setCurrentView(view);
    // Reset to current user's entries when leaving admin-history
    if (view !== 'admin-history') {
      setAdminTargetUser(null);
      fetchEntries(currentUser?.id);
    }
  };

  // Admin specific handler
  const handleAdminViewHistory = (targetUser: User) => {
    setAdminTargetUser(targetUser);
    setCurrentView('admin-history');
    fetchEntries(targetUser.id);
  };

  // Render content based on view state
  const renderContent = () => {
    if (isLoading && !entries.length) return <div className="flex justify-center p-10">Loading...</div>;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard entries={entries} user={currentUser!} />;
      case 'new-entry':
        return <EntryForm 
          userId={currentUser!.id} 
          onSuccess={handleEntrySuccess} 
          onCancel={() => handleChangeView('dashboard')} 
        />;
      case 'history':
        return <EntryList entries={entries} username={currentUser!.fullName} />;
      case 'profile':
        return <Profile user={currentUser!} onUpdate={setCurrentUser} />;
      case 'admin':
        return <AdminPanel onViewHistory={handleAdminViewHistory} />;
      case 'admin-history':
        return (
          <EntryList 
            entries={entries} 
            username={adminTargetUser?.fullName || 'User'} 
            onBack={() => handleChangeView('admin')}
            title={`History: ${adminTargetUser?.fullName}`}
            isAdminView={true}
          />
        );
      default:
        return <Dashboard entries={entries} user={currentUser!} />;
    }
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      currentView={currentView} 
      onChangeView={handleChangeView}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
