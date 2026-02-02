import { useState } from 'react';
import { groupsAPI } from '../services/api';
import './GroupSidebar.css';

const GroupSidebar = ({ groups, selectedGroup, onSelectGroup, onRefresh, isOpen, onClose }) => {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('📁');
  const [newGroupColor, setNewGroupColor] = useState('#6366f1');

  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await groupsAPI.create({
        name: newGroupName,
        icon: newGroupIcon,
        color: newGroupColor,
      });
      
      setNewGroupName('');
      setNewGroupIcon('📁');
      setNewGroupColor('#6366f1');
      setShowAddGroup(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleDeleteGroup = async (e, groupId, groupName) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${groupName}"? Links in this group will become uncollected.`)) {
      try {
        await groupsAPI.delete(groupId);
        if (selectedGroup === groupId) {
          onSelectGroup('all');
        }
        onRefresh();
      } catch (error) {
        console.error('Failed to delete group:', error);
      }
    }
  };

  const iconOptions = ['📁', '💼', '🎯', '📚', '🎨', '💡', '🚀', '⭐', '🔥', '💻'];
  const colorOptions = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`group-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Collections</h2>
        <button
          onClick={() => setShowAddGroup(!showAddGroup)}
          className="btn-icon-sm"
          title="Add collection"
        >
          +
        </button>
      </div>

      {showAddGroup && (
        <div className="add-group-form glass-card">
          <form onSubmit={handleAddGroup}>
            <div className="icon-picker">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${newGroupIcon === icon ? 'active' : ''}`}
                  onClick={() => setNewGroupIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="color-picker">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${newGroupColor === color ? 'active' : ''}`}
                  style={{ background: color }}
                  onClick={() => setNewGroupColor(color)}
                />
              ))}
            </div>

            <input
              type="text"
              className="input"
              placeholder="Collection name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              maxLength={30}
            />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-sm">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowAddGroup(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <nav className="group-list">
        <button
          className={`group-item ${selectedGroup === 'all' ? 'active' : ''}`}
          onClick={() => onSelectGroup('all')}
        >
          <span className="group-icon">📂</span>
          <span className="group-name">All Links</span>
        </button>

        {groups.map((group) => (
          <button
            key={group._id}
            className={`group-item ${selectedGroup === group._id ? 'active' : ''}`}
            onClick={() => onSelectGroup(group._id)}
          >
            <span className="group-icon" style={{ color: group.color }}>
              {group.icon}
            </span>
            <span className="group-name">{group.name}</span>
            <div className="group-actions">
              {group.linkCount > 0 && (
                <span className="group-count">{group.linkCount}</span>
              )}
              <button
                className="btn-delete-group"
                onClick={(e) => handleDeleteGroup(e, group._id, group.name)}
                title="Delete group"
              >
                ✕
              </button>
            </div>
          </button>
        ))}
      </nav>
    </aside>
    </>
  );
};

export default GroupSidebar;
