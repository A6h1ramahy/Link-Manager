import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { linksAPI, groupsAPI } from '../services/api';
import GroupSidebar from '../components/GroupSidebar';
import LinkCard from '../components/LinkCard';
import AddLinkModal from '../components/AddLinkModal';
import SemanticSearch from '../components/SemanticSearch';
import KnowledgeGraph from '../components/KnowledgeGraph';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [links, setLinks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' | 'graph'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedGroup]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [linksRes, groupsRes] = await Promise.all([
        linksAPI.getAll({ group: selectedGroup }),
        groupsAPI.getAll(),
      ]);
      
      setLinks(linksRes.data.data);
      setGroups(groupsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (url, groupId, name) => {
    try {
      await linksAPI.create({ url, group: groupId, name });
      fetchData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add link:', error);
      throw error;
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await linksAPI.delete(id);
      setLinks((prev) => prev.filter((link) => link._id !== id));
    } catch (error) {
      console.error('Failed to delete link:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchData();
      return;
    }

    try {
      const response = await linksAPI.search(query);
      setLinks(response.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="dashboard">
      <GroupSidebar
        groups={groups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
        onRefresh={fetchData}
      />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>
              <span className="logo-icon">🔗</span>
              Link Saver
            </h1>
          </div>

          <div className="header-right">
            <button onClick={toggleTheme} className="btn-icon" title="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <div className="user-menu">
              <span>{user?.name}</span>
              <button onClick={logout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-controls">
          <SemanticSearch onSearch={handleSearch} />

          <div className="controls-right">
            <div className="view-switcher">
              <button
                className={`btn-icon ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                title="Grid view"
              >
                ▦
              </button>
              <button
                className={`btn-icon ${view === 'graph' ? 'active' : ''}`}
                onClick={() => setView('graph')}
                title="Graph view"
              >
                ◉
              </button>
            </div>

            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              <span>+</span> Add Link
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your links...</p>
            </div>
          ) : view === 'grid' ? (
            <div className="links-grid">
              {links.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No links yet</h3>
                  <p>Start saving your favorite links with AI-powered organization</p>
                  <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                    Add Your First Link
                  </button>
                </div>
              ) : (
                links.map((link) => (
                  <LinkCard
                    key={link._id}
                    link={link}
                    onDelete={handleDeleteLink}
                    onRefresh={fetchData}
                  />
                ))
              )}
            </div>
          ) : (
            <KnowledgeGraph links={links} />
          )}
        </div>
      </div>

      {showAddModal && (
        <AddLinkModal
          groups={groups}
          onAdd={handleAddLink}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
