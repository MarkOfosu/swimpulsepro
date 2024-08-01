
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaUsers, FaChalkboardTeacher, FaClipboardList, FaCog, FaBars } from 'react-icons/fa';
// import styles from '../styles/sidebar.modules.css';
import logo from '../../public/image/logo.png';
import { useRouter } from 'next/navigation'; 

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('coach'); // This should be dynamically set based on the logged-in user's role
  const isAdmin = 'true'

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
      <Link href="/" className="pure-menu-link"> 
        <FaHome className="icon" /> <span className="text">Home</span>
      </Link>
      {userRole === 'coach' ? (
        <>
          <Link href="/coach/dashboard" className="pure-menu-link">
            <FaChalkboardTeacher className="icon" /> <span className="text">Coach Dashboard</span>
          </Link>
          {isAdmin && (
            <>
              <hr style={{ width: '80%', borderColor: '#fff', margin: '10px auto' }} />
              <Link href="/team/teamOverview" className="pure-menu-link">
                <FaUsers className="icon" /> <span className="text">Team Dashboard</span>
              </Link>
            </>
          )}
        </>
      ) :  userRole === 'swimmer' ? (
        <Link href="/swimmer/dashboard" className="pure-menu-link">
          <FaUsers className="icon" /> <span className="text">Swimmer Dashboard</span>
        </Link>
      ) : (
        <Link href="/" className="pure-menu-link">
          <FaHome className="icon" /> <span className="text">Home</span>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
