import React from 'react';
import { PartnerData } from '../types';
import { formatDate } from '../utils/dateUtils';

interface PartnerTileProps {
  partnerData: PartnerData;
  onDelete: (id: number) => void;
  onEdit: (partner: PartnerData) => void;
}

const PartnerTile: React.FC<PartnerTileProps> = ({ partnerData, onDelete, onEdit }) => {
  const handleDeleteClick = () => {
    onDelete(partnerData.id);
  };

  const handleEditClick = () => {
    onEdit(partnerData);
  };

  return (
    <div className="partner-tile">
      <img className="partner-thumbnail" src={partnerData.logoUrl || ''} alt={partnerData.name} />
      <hr />
      <div className="partner-info">
        <h3>{partnerData.name}</h3>
        <p>{partnerData.description}</p>
        <p>Repo: {partnerData.repoPath}</p>
        <p>Last Updated: {partnerData.lastUpdated ? formatDate(partnerData.lastUpdated) : 'N/A'}</p>
        <p>Updated By: {partnerData.updatedBy}</p>
        <p>Active: {partnerData.active ? 'Yes' : 'No'}</p>
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </div>
    </div>
  );
};

export default PartnerTile;
