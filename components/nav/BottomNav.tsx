'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaChalkboardTeacher, FaClipboardList, FaCog } from 'react-icons/fa';

const BottomNav: React.FC = () => {
  const [userRole, setUserRole] = useState('coach'); // This should be dynamically set based on the logged-in user
  const isAdmin = true; // This should be dynamically set based on the logged-in user

  return (
    <div className="bottom-nav">
      <Link href="/" className="pure-menu-link">
        <FaHome className="icon" />
      </Link>
      {userRole === 'coach' ? (
        <>
          <Link href="/user/coach/dashboard" className="pure-menu-link">
            <FaChalkboardTeacher className="icon" />
          </Link>
          {isAdmin && (
            <Link href="/user/team/teamOverview" className="pure-menu-link">
              <FaUsers className="icon" />
            </Link>
          )}
        </>
      ) : userRole === 'swimmer' ? (
        <Link href="/user/swimmer/dashboard" className="pure-menu-link">
          <FaUsers className="icon" />
        </Link>
      ) : (
        <Link href="/" className="pure-menu-link">
          <FaHome className="icon" />
        </Link>
      )}
    </div>
  );
};

export default BottomNav;
