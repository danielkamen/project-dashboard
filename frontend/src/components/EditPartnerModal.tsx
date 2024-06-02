import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { PartnerData } from '../types';

interface EditPartnerModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  partnerData: PartnerData;
  onPartnerUpdated: (updatedPartner: PartnerData) => void;
  refetchPartners: () => void;
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

const EditPartnerModal: React.FC<EditPartnerModalProps> = ({ isOpen, onRequestClose, partnerData, refetchPartners }) => {
  const [name, setName] = useState(partnerData.name);
  const [logoUrl, setLogoUrl] = useState(partnerData.logoUrl);
  const [description, setDescription] = useState(partnerData.description);
  const [repoPath, setRepoPath] = useState(partnerData.repoPath);
  const [active, setActive] = useState(partnerData.active);
  const [error, setError] = useState<string | null>(null);
  const [isWorkingOnProject, setIsWorkingOnProject] = useState(false);

  useEffect(() => {
    setName(partnerData.name);
    setLogoUrl(partnerData.logoUrl);
    setDescription(partnerData.description);
    setRepoPath(partnerData.repoPath);
    setActive(partnerData.active);
    const userEmail = localStorage.getItem('userEmail');
    setIsWorkingOnProject(partnerData.usersWorkingOnProject.includes(userEmail || ''));
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

    try {
      const response = await axios.put<PartnerData>(`http://localhost:8080/api/partners/${partnerData.id}`, updatedPartnerData, {
        headers: {
          Authorization: `Basic ${btoa(`${userEmail}:${password}`)}`,
          'user-email': userEmail || '',
        },
      });

      if (response.status === 200) {
        if (isWorkingOnProject) {
          await axios.post(`http://localhost:8080/api/partners/addUserToProject`, null, {
            params: { projectId: partnerData.id, email: userEmail },
            headers: {
              Authorization: `Basic ${btoa(`${userEmail}:${password}`)}`,
            },
          });
        } else {
          await axios.post(`http://localhost:8080/api/partners/removeUserFromProject`, null, {
            params: { projectId: partnerData.id, email: userEmail },
            headers: {
              Authorization: `Basic ${btoa(`${userEmail}:${password}`)}`,
            },
          });
        }
        onRequestClose();
        refetchPartners();
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
        <div>
          <label>I'm working on this project:</label>
          <input
            type="checkbox"
            checked={isWorkingOnProject}
            onChange={(e) => setIsWorkingOnProject(e.target.checked)}
          />
        </div>
        <button type="submit">Update Partner</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default EditPartnerModal;
