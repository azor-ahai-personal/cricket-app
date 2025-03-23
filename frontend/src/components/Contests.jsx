import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useSelector } from 'react-redux'; // Import useSelector
import './Contests.css'; // Add styles for the modal and table
import apiService from '../utils/api';
import UserAvatar from './UserAvatar'; // Import the UserAvatar component

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false); // State for join dialog
  const [name, setName] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [passkey, setPasskey] = useState(''); // State for passkey input
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  // Get the currentUser from the Redux store
  const currentUser = useSelector((state) => state.auth.currentUser);
  console.log(currentUser);

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
      setIsDialogOpen(false); // Close the dialog
      setName(''); // Reset form fields
      setEntryFee('');
      await fetchContests();
      // Optionally, refresh the contests list or update state
    } catch (err) {
      setError('Failed to create contest');
    }
  };

  const handleJoinContest = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.joinContest({ passkey });
      setIsJoinDialogOpen(false);
      setPasskey('');
      await fetchContests(); // Refresh the contests list
    } catch (err) {
      setError('Failed to join contest');
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

  const handleUpdateStatus = async (contestId) => {
    if (window.confirm('Do you really want to activate the contest?')) {
      try {
        const response = await apiService.updateContest(contestId, { active: true });
        await fetchContests(); // Refresh the contests list
      } catch (err) {
        setError('Failed to update contest status');
      }
    }
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
        <button
          className="home-button2"
          onClick={() => navigate('/')} // Navigate to the home page
        >
          Home
        </button>
        <h2>Contests</h2>
        <div className="buttons-container">
          <button className="action-button" onClick={() => setIsDialogOpen(true)}>
            Create Contest
          </button>
          <button className="action-button join-contest-button" onClick={() => setIsJoinDialogOpen(true)}>
            Join Contest
          </button>
        </div>
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

      {/* Join Contest Dialog */}
      {isJoinDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Join Contest</h3>
            <form onSubmit={handleJoinContest}>
              <div className="form-group">
                <label>Passkey</label>
                <input
                  type="text"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              <div className="form-actions">
                <button type="button" onClick={() => setIsJoinDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Join</button>
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
            <th>Owner</th>
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
              <td onClick={() => handleRowClick(contest.id)}>
                <UserAvatar name={contest.owner.name} />
              </td>
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
                      {!contest.active && currentUser?.id === contest.owner.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(contest.id);
                            setOpenDropdownId(null); // Close dropdown after updating
                          }}
                        >
                          Update Status
                        </button>
                      )}
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