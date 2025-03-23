import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Contests.css'; // Add styles for the modal and table
import apiService from '../utils/api';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  const fetchContests = async () => {
    try {
      const response = await apiService.getContests(); // Use your apiService to fetch contests
      setContests(response.contests); // Adjust based on your API response structure
    } catch (err) {
      setError('Failed to fetch contests');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContests();
  }, []);

  const handleRowClick = (contestId) => {
    navigate(`/contests/${contestId}`); // Navigate to the contest details page
  };

  const handleCreateContest = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createContest({ name, entry_fee: entryFee });
      console.log('Contest created:', response.data);
      setIsDialogOpen(false); // Close the dialog
      setName(''); // Reset form fields
      setEntryFee('');
      await fetchContests();
      // Optionally, refresh the contests list or update state
    } catch (err) {
      setError('Failed to create contest');
    }
  };

  const handleCopyPasskey = (passkey) => {
    navigator.clipboard.writeText(passkey)
      .then(() => {
        setShowPopup(true); // Show popup
        setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      })
      .catch(() => {
        setError('Failed to copy passkey.');
      });
  };

  const toggleDropdown = (contestId) => {
    setOpenDropdownId(openDropdownId === contestId ? null : contestId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="contests-container">
      {/* Popup */}
      {showPopup && (
        <div className="popup">
          Passkey copied to clipboard!
        </div>
      )}

      <div className="header">
        <h2>Contests</h2>
        <button className="create-contest-button" onClick={() => setIsDialogOpen(true)}>
          Create Contest
        </button>
      </div>

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Create Contest</h3>
            <form onSubmit={handleCreateContest}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Entry Fee</label>
                <input
                  type="number"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              <div className="form-actions">
                <button type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="contest-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Passkey</th>
            <th>Active</th>
            <th>Total Teams</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contests.map(contest => (
            <tr key={contest.id} className="contest-row">
              <td onClick={() => handleRowClick(contest.id)}>{contest.name}</td>
              <td onClick={() => handleRowClick(contest.id)}>{contest.passkey}</td>
              <td onClick={() => handleRowClick(contest.id)}>{contest.active ? "Yes" : "No"}</td>
              <td onClick={() => handleRowClick(contest.id)}>{contest.total_teams}</td>
              <td>
                <div className="actions-dropdown">
                  <button
                    className="actions-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(contest.id);
                    }}
                  >
                    &#8942; {/* Three dots icon */}
                  </button>
                  {openDropdownId === contest.id && (
                    <div className="dropdown-content">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPasskey(contest.passkey);
                          setOpenDropdownId(null); // Close dropdown after copying
                        }}
                      >
                        Copy Passkey
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contests; 