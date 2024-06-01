import { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { PartnerData } from '../types';

interface NewPartnerModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onPartnerAdded: (partner: PartnerData) => void;
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

const NewPartnerModal: React.FC<NewPartnerModalProps> = ({ isOpen, onRequestClose, onPartnerAdded }) => {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [repoPath, setRepoPath] = useState('');
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('userEmail');
    const password = localStorage.getItem('password');
    if (!userEmail || !password) return;

    if (!repoPath.startsWith("https://github.com/")) {
      setError('Invalid GitHub repository URL');
      return;
    }

    const partnerData = { name, logoUrl, description, repoPath, active };

    try {
      const response = await axios.post<PartnerData>('http://localhost:8080/api/partners', partnerData, {
        headers: {
          Authorization: `Basic ${btoa(`${userEmail}:${password}`)}`,
          'user-email': userEmail || '',
        },
      });

      if (response.status === 200) {
        console.log('Partner added successfully:', response.data);
        onPartnerAdded(response.data);
        // Clear input fields after successful addition
        setName('');
        setLogoUrl('');
        setDescription('');
        setRepoPath('');
        setActive(false);
        onRequestClose();
      } else {
        console.error('Error adding partner:', response.statusText);
        setError('Error adding partner. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error adding partner:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError('Invalid GitHub repository URL');
      } else {
        setError('Error adding partner. Please try again.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add New Partner"
    >
      <h2>Add New Partner</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddPartner}>
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
        <button type="submit">Add Partner</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default NewPartnerModal;
