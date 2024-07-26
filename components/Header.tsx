import React from 'react';

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <h2>{description}</h2>
    </div>
  );
}

export default Header;
