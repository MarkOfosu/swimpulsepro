'use client';

import React from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaChalkboardTeacher, FaClipboardList, FaCog } from 'react-icons/fa';
import styles from '../styles/sidebar.module.css';

const BottomNav: React.FC = () => {
  return (
    <div className="bottom-nav">
      <Link href="/" className="pure-menu-link">
        <FaHome className="icon" />
      </Link>
      <Link href="/dashboard" className="pure-menu-link">
        <FaChalkboardTeacher className="icon" />
      </Link>
      <Link href="/manage-swimmers" className="pure-menu-link">
        <FaUsers className="icon" />
      </Link>
      <Link href="/manage-coaches" className="pure-menu-link">
        <FaChalkboardTeacher className="icon" />
      </Link>
      <Link href="/workouts" className="pure-menu-link">
        <FaClipboardList className="icon" />
      </Link>
      <Link href="/settings" className="pure-menu-link">
        <FaCog className="icon" />
      </Link>
    </div>
  );
};

export default BottomNav;
