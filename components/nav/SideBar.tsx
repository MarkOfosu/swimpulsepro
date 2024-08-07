'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaUsers, FaChalkboardTeacher, FaBars } from 'react-icons/fa';
import logo from '../../public/image/logo.png';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('coach'); // This should be dynamically set based on the logged-in user's role
  const isAdmin = true;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setCollapsed(e.matches);
    };

    if (mediaQuery.matches) {
      setCollapsed(true);
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const storedCollapseState = localStorage.getItem('sidebar-collapsed');
    if (storedCollapseState !== null) {
      setCollapsed(JSON.parse(storedCollapseState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

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
      ) : userRole === 'swimmer' ? (
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