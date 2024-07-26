
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaUsers, FaChalkboardTeacher, FaClipboardList, FaCog, FaBars } from 'react-icons/fa';
// import styles from '../styles/sidebar.modules.css';
import logo from '../public/image/logo.png';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div id="menu" className={collapsed ? 'collapsed' : ''}>
      <Link href="/" className="logo">
        <Image src={logo} alt="SwimPulsePro Logo" />
      </Link>
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
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
