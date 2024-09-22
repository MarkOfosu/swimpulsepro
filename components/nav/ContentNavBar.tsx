import React from 'react';
import '../styles/ContentNavBar.module.css'

interface ContentNavBarProps {
    links: { href: string; label: string }[];
}

const ContentNavBar: React.FC<ContentNavBarProps> = ({ links }) => {
    return (
        <nav className="content-navbar">
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link.href}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ContentNavBar;
