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
  const [showRules, setShowRules] = useState(true); // State for rules visibility

  // Get the currentUser from the Redux store
  const currentUser = useSelector((state) => state.auth.currentUser);

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
        const response = await apiService.activateContest(contestId);
        await fetchContests(); // Refresh the contests list
      } catch (err) {
        setError('Failed to update contest status');
      }
    }
  };

  const toggleDropdown = (contestId) => {
    setOpenDropdownId(openDropdownId === contestId ? null : contestId);
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const navigateToHome = () => {
    navigate('/');
  }

  // console.log({contests});
  return (
    <div className="contests-container-contests">
      {showPopup && (
        <div className="popup-contests">
          Passkey copied to clipboard!
        </div>
      )}
      <div className="header-contests">
        <div className="save-publish-buttons-contests">
          <button
            className="home-button-contests"
            onClick={() => navigateToHome()} // Navigate to the home page
          >
            Home
          </button>
        </div>
        <h2>Contests</h2>
        <div className="save-publish-buttons-contests">
          <button 
            className="save-button-contests"
            onClick={() => setIsDialogOpen(true)}
          >
            Create Contest
          </button>
          <button 
            onClick={() => setIsJoinDialogOpen(true)}
            className="save-button-contests"
          >
            Join Contest
          </button>
        </div>
      </div>

      {/* Contest Rules Section */}
      <div className="rules-container-contests">
        <div className="rules-header-contests" onClick={toggleRules}>
          <div className="rules-title-contests">
            <span role="img" aria-label="info">ℹ️</span> Contest Rules
          </div>
          <div className={`rules-icon-contests ${showRules ? 'rules-icon-rotated-contests' : ''}`}>
            ▼
          </div>
        </div>
        {showRules && (
          <div className="rules-content-contests">
            <ol className="rules-list-contests">
              <li><strong>Create contests</strong> with a custom name and entry fee to compete with friends</li>
              <li><strong>Join multiple contests</strong> to increase your chances of winning and fun</li>
              <li><strong>Payment handling:</strong> Currently self-managed between participants (in-app payments coming soon!)</li>
              <li><strong>Invite friends</strong> by sharing the contest passkey — just click the three dots (⋮) and select "Copy Passkey"</li>
              <li><strong>Activate your contest</strong> once all participants have joined to start tracking points after each match</li>
              <li><strong>Track your progress</strong> by clicking on any contest to view live scores and standings</li>
            </ol>
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="dialog-overlay-contests">
          <div className="dialog-box-contests">
            <h3>Create Contest</h3>
            <form onSubmit={handleCreateContest}>
              <div className="form-group-contests">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-contests">
                <label>Entry Fee</label>
                <input
                  type="number"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-contests">{error}</p>}
              <div className="form-actions-contests">
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
        <div className="dialog-overlay-contests">
          <div className="dialog-box-contests">
            <h3>Join Contest</h3>
            <form onSubmit={handleJoinContest}>
              <div className="form-group-contests">
                <label>Passkey</label>
                <input
                  type="text"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-contests">{error}</p>}
              <div className="form-actions-contests">
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
      <table className="contest-table-contests">
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
            <tr key={contest.id} className="contest-row-contests">
              <td onClick={() => handleRowClick(contest.id)}>{contest.name}</td>
              <td onClick={() => handleRowClick(contest.id)}>{contest.passkey}</td>
              <td onClick={() => handleRowClick(contest.id)}>
                <UserAvatar name={contest.contest_owner.name} />
              </td>
              <td onClick={() => handleRowClick(contest.id)}>{contest.active ? "Yes" : "No"}</td>
              <td onClick={() => handleRowClick(contest.id)}>{contest.total_teams}</td>
              <td>
                <div className="actions-dropdown-contests">
                  <button
                    className="actions-button-contests"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(contest.id);
                    }}
                  >
                    &#8942; {/* Three dots icon */}
                  </button>
                  {openDropdownId === contest.id && (
                    <div className="dropdown-content-contests">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPasskey(contest.passkey);
                          setOpenDropdownId(null); // Close dropdown after copying
                        }}
                      >
                        Copy Passkey
                      </button>
                      {!contest.active && currentUser?.id === contest?.owner?.id && (
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