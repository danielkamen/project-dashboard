import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { PartnerData } from '../types';

interface EditPartnerModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  partnerData: PartnerData;
  onPartnerUpdated: (updatedPartner: PartnerData) => void;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const EditPartnerModal: React.FC<EditPartnerModalProps> = ({ isOpen, onRequestClose, partnerData, onPartnerUpdated }) => {
  const [name, setName] = useState(partnerData.name);
  const [logoUrl, setLogoUrl] = useState(partnerData.logoUrl);
  const [description, setDescription] = useState(partnerData.description);
  const [repoPath, setRepoPath] = useState(partnerData.repoPath);
  const [active, setActive] = useState(partnerData.active);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(partnerData.name);
    setLogoUrl(partnerData.logoUrl);
    setDescription(partnerData.description);
    setRepoPath(partnerData.repoPath);
    setActive(partnerData.active);
  }, [partnerData]);

  const handleUpdatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('userEmail');
    const password = localStorage.getItem('password');
    if (!userEmail || !password) return;

    if (!repoPath.startsWith("https://github.com/")) {
      setError('Invalid GitHub repository URL');
      return;
    }

    const updatedPartnerData = { ...partnerData, name, logoUrl, description, repoPath, active };

    console.log('Sending updated partner data:', updatedPartnerData);

    try {
      const response = await axios.put<PartnerData>(`http://localhost:8080/api/partners/${partnerData.id}`, updatedPartnerData, {
        headers: {
          Authorization: `Basic ${btoa(`${userEmail}:${password}`)}`,
          'user-email': userEmail || '',
        },
      });

      if (response.status === 200) {
        console.log('Partner updated successfully:', response.data);
        onPartnerUpdated(response.data);
        onRequestClose();
      } else {
        console.error('Error updating partner:', response.statusText);
        setError('Error updating partner. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error updating partner:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError('Invalid GitHub repository URL');
      } else {
        setError('Error updating partner. Please try again.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Edit Partner"
    >
      <h2>Edit Partner</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdatePartner}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter organization name"
          />
        </div>
        <div>
          <label>Logo URL:</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Enter logo URL"
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label>Repo Path:</label>
          <input
            type="text"
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
            placeholder="Enter repo path"
          />
        </div>
        <div>
          <label>Active:</label>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </div>
        <button type="submit">Update Partner</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default EditPartnerModal;
