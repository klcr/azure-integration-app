import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <NavLink 
              to={ROUTES.HOME}
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Home
            </NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink 
              to={ROUTES.DASHBOARD}
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Dashboard
            </NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink 
              to={ROUTES.SHAREPOINT}
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              SharePoint
            </NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink 
              to={ROUTES.DATAVERSE}
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Dataverse
            </NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink 
              to={ROUTES.OUTLOOK}
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Outlook
            </NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink 
              to={ROUTES.SETTINGS}
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
