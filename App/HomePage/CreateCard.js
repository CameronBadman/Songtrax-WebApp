import React from 'react';
import { Link } from 'react-router-dom';

function CreateCard({ to }) {
  return (
      <div className="card create-card-center">
          <Link className="btn" to="/edit/new">Create Sample</Link>
      </div>
  );
}

export default CreateCard;

