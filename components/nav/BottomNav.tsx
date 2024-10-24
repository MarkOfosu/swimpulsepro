'use client';

import React from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

interface BottomNavProps {
  userRole: 'coach' | 'swimmer';
  isAdmin: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ userRole, isAdmin }) => {
  return (
    <div className="bottom-nav">
      <Link href="/" className="pure-menu-link">
        <FaHome className="icon" />
      </Link>
      {userRole === 'coach' ? (
        <>
          <Link href="/user/coach/swimGroup" className="pure-menu-link">
            <FaChalkboardTeacher className="icon" />
          </Link>
          {/* {isAdmin && (
            <Link href="/user/team/teamOverview" className="pure-menu-link">
              <FaUsers className="icon" />
            </Link>
          )} */}
        </>
      ) : userRole === 'swimmer' ? (
        <Link href="/user/swimmer/dashboard" className="pure-menu-link">
          <FaUsers className="icon" />
        </Link>
      ) : null}
    </div>
  );
};

export default BottomNav;