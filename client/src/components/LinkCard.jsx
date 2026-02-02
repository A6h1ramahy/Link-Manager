import { useState } from 'react';
import './LinkCard.css';

const LinkCard = ({ link, onDelete, onRefresh }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      await onDelete(link._id);
    }
  };

  const handleOpenLink = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="link-card card">
      {link.isProcessing && (
        <div className="processing-badge">
          <div className="spinner-small"></div>
          <span>Processing...</span>
        </div>
      )}

      {link.ogImage && (
        <div className="link-preview" onClick={handleOpenLink}>
          <img src={link.ogImage} alt={link.title} loading="lazy" />
          <div className="preview-overlay">
            <span>Open Link →</span>
          </div>
        </div>
      )}

      <div className="link-content">
        <div className="link-header">
          <div className="link-favicon">
            {link.favicon ? (
              <img src={link.favicon} alt="" width="16" height="16" />
            ) : (
              <span>🔗</span>
            )}
          </div>
          <div className="link-domain">{link.domain}</div>
        </div>

        <h3 className="link-title" onClick={handleOpenLink}>
          {link.customName || link.title}
        </h3>

        {link.description && (
          <p className="link-description">
            {link.description}
          </p>
        )}

        {link.group && (
          <div className="link-group">
            <span style={{ color: link.group.color }}>{link.group.icon}</span>
            {link.group.name}
          </div>
        )}
      </div>

      <div className="link-actions">
        <button onClick={handleOpenLink} className="btn-icon-sm" title="Open link">
          🔗
        </button>
        <button onClick={handleDelete} className="btn-icon-sm btn-danger" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
