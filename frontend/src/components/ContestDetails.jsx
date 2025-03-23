import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../utils/api';

const ContestDetails = () => {
  const { id } = useParams(); // Get the contest ID from the URL
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await apiService.getContest(id); // Call the show EP
        setContest(response); // Set the contest details
      } catch (err) {
        setError('Failed to fetch contest details');
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="contest-details">
      <h2>{contest.name}</h2>
      <p><strong>Passkey:</strong> {contest.passkey}</p>
      <p><strong>Status:</strong> {contest.status}</p>
      <p><strong>Total Teams:</strong> {contest.total_teams}</p>
      <p><strong>Start Time:</strong> {new Date(contest.start_time).toLocaleString()}</p>
      <p><strong>End Time:</strong> {new Date(contest.end_time).toLocaleString()}</p>
    </div>
  );
};

export default ContestDetails; 