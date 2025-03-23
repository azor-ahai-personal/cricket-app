import React from 'react';
import './UserAvatar.css'; // Add styles for the avatar

const UserAvatar = ({ name }) => {
  // Get initials from the name
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="user-avatar">
      {initials}
      <span className="tooltip">{name}</span>
    </div>
  );
};

export default UserAvatar; 