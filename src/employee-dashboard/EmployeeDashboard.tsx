// components/EmployeeDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
// import { useUserStore } from '../stores/useUserStore'; // Adjust path as necessary
import WorkedHoursView from '../components/WorkedHoursView';
import {create} from 'zustand';

// Define a User interface to type-check role and employeeId
interface User {
    role: 'employee'; // Define roles
    employeeId: string; // Employee ID should be a string
}

// Create Zustand store
const useUserStore = create<{
    role: User['role'];
    employeeId?: string; // Optional if not all users have an employee ID
}>(() => ({
    role: 'employee', // Default value for demonstration
    employeeId: '13', // Example ID, replace with actual logic for fetching user ID
}));

const EmployeeDashboard: React.FC = () => {
    const { role, employeeId } = useUserStore(); // Get role and employeeId from Zustand store

    if (!role || !employeeId) {
        return <div>Error: User role or employee ID is not defined.</div>;
    }

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <nav>
                {/* Navigation links can be added here */}
                <Link to="/employee/worked-hours">View Worked Hours</Link>
            </nav>
            {/* Render WorkedHoursView with the correct props */}
            <WorkedHoursView role={role} employeeId={employeeId} />
            {/* Other employee-specific content can be added here */}
        </div>
    );
};

export default EmployeeDashboard;