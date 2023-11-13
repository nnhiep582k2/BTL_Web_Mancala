import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
const LayoutDashboard = () => {
    return (
        <div>
            <Nav></Nav>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default LayoutDashboard;
