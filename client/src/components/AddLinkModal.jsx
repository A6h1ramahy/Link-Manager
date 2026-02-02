import { useState } from 'react';
import './AddLinkModal.css';

const AddLinkModal = ({ groups, onAdd, onClose }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      await onAdd(url, selectedGroup || null, name);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add link');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Link</h2>
          <button onClick={onClose} className="btn-close">
            ✕
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              className="input"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name (optional)</label>
            <input
              type="text"
              id="name"
              className="input"
              placeholder="e.g. My Favorite Design Tool"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="group">Collection (optional)</label>
            <select
              id="group"
              className="input"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">No collection</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.icon} {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Adding...
                </>
              ) : (
                'Add Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;
