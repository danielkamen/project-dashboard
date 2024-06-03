import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PartnerTile from './PartnerTile';
import { PartnerData } from '../types';
import NewPartnerModal from './NewPartnerModal';
import EditPartnerModal from './EditPartnerModal';

const Dashboard: React.FC = () => {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerData | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [secondsSinceLastSync, setSecondsSinceLastSync] = useState<number>(0);
  const navigate = useNavigate();

  const fetchPartners = useCallback(async (userEmail: string, password: string) => {
    try {
      const authorizationHeader = `Basic ${btoa(`${userEmail}:${password}`)}`;
      const response = await axios.get<PartnerData[]>('http://localhost:8080/api/partners', {
        headers: {
          Authorization: authorizationHeader,
        },
      });
      setPartners(response.data);
      const now = new Date().toISOString();
      setLastSynced(now);
      setSecondsSinceLastSync(0);
    } catch (error: unknown) {
      console.error('Error fetching partners:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          navigate('/login');
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const password = localStorage.getItem('password');
    if (!userEmail || !password) {
      navigate('/login');
      return;
    }
    fetchPartners(userEmail, password);
    const interval = setInterval(() => {
      fetchPartners(userEmail, password);
    }, 15000); // Sync every 15 seconds

    return () => clearInterval(interval);
  }, [navigate, fetchPartners]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSinceLastSync(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDeletePartner = async (id: number) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const password = localStorage.getItem('password');
      if (!userEmail || !password) return;

      await axios.delete(`http://localhost:8080/api/partners/${id}`, {
        headers: {
          Authorization: `Basic ${btoa(`${userEmail}:${password}`)}`,
        },
      });
      setPartners(partners.filter((partner) => partner.id !== id));
      setSecondsSinceLastSync(0);
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const handleEditPartner = (partner: PartnerData) => {
    setSelectedPartner(partner);
    setEditModalIsOpen(true);
  };

  const handlePartnerAdded = (partner: PartnerData) => {
    setPartners([...partners, partner]);
  };

  const handlePartnerUpdated = (updatedPartner: PartnerData) => {
    setPartners(partners.map((partner) => (partner.id === updatedPartner.id ? updatedPartner : partner)));
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditModalIsOpen(false);
    setSelectedPartner(null);
  };

  const formatTimeSinceLastSync = (seconds: number) => {
    const remainingSeconds = seconds % 60;
    return `${remainingSeconds}s ago`;
  };

  return (
    <div id="main-content">
      <div className="sync-info">
        Last Synced: {lastSynced ? formatTimeSinceLastSync(secondsSinceLastSync) : 'Never'}
        <button onClick={() => {
          const userEmail = localStorage.getItem('userEmail');
          const password = localStorage.getItem('password');
          if (userEmail && password) {
            fetchPartners(userEmail, password);
          }
        }}>Manual Sync</button>
      </div>
      <button onClick={() => setModalIsOpen(true)}>Add New Partner</button>
      <div id="main-partners-grid">
        {partners.map((partner) => (
          <PartnerTile key={partner.id} partnerData={partner} onDelete={handleDeletePartner} onEdit={handleEditPartner} />
        ))}
      </div>
      <NewPartnerModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onPartnerAdded={handlePartnerAdded}
      />
      {selectedPartner && (
        <EditPartnerModal
          isOpen={editModalIsOpen}
          onRequestClose={closeModal}
          partnerData={selectedPartner}
          onPartnerUpdated={handlePartnerUpdated}
          refetchPartners={() => fetchPartners(localStorage.getItem('userEmail') || '', localStorage.getItem('password') || '')} // Pass refetch function
        />
      )}
    </div>
  );
};

export default Dashboard;
