
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaChalkboardTeacher, FaClipboardList, FaCog, FaBars } from 'react-icons/fa';
// import styles from '../styles/sidebar.modules.css';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div id="menu" className={collapsed ? 'collapsed' : ''}>
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <Link href="/" className="pure-menu-heading">
        LOGO
      </Link>
      <Link href="/team" className="pure-menu-link">
        <FaHome className="icon" /> <span className="text">Team</span>
      </Link>
      <Link href="/coach" className="pure-menu-link">
        <FaChalkboardTeacher className="icon" /> <span className="text">Coach</span>
      </Link>
      <Link href="/settings" className="pure-menu-link">
        <FaCog className="icon" /> <span className="text">Settings</span>
      </Link>
    </div>
  );
};

export default Sidebar;