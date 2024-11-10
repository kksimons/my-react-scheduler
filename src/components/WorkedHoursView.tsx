// components/WorkedHoursView.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../userAuth/firebase'; // Adjust import based on your file structure
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

interface WorkedHour {
    id: string;
    employeeId: string;
    date: any; // Keep as any or Firestore Timestamp type
    hoursWorked: number;
    totalWorkedHours?: number; // Optional total hours for the week
}

const WorkedHoursView = ({ role, employeeId }: { role: string; employeeId?: string }) => {
    const [workedHours, setWorkedHours] = useState<WorkedHour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkedHours = async () => {
            setLoading(true);
            try {
                let q;
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // Last two weeks

                if (role === 'employee' && employeeId) {
                    q = query(
                        collection(db, 'workedHours'),
                        where('employeeId', '==', employeeId),
                        where('date', '>=', twoWeeksAgo)
                    );
                } else if (role === 'employer') {
                    q = query(
                        collection(db, 'workedHours'),
                        where('date', '>=', twoWeeksAgo)
                    );
                }

                if (q) {
                    const querySnapshot = await getDocs(q);
                    const hoursList = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as WorkedHour[];

                    setWorkedHours(hoursList);
                } else {
                    setError('Invalid role or missing employee ID.');
                }
            } catch (error) {
                console.error('Error fetching worked hours:', error);
                setError('Failed to fetch worked hours.');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkedHours();
    }, [role, employeeId]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Worked Hours
            </Typography>
            <List>
                {workedHours.length > 0 ? (
                    workedHours.map(entry => (
                        <ListItem key={entry.id}>
                            <ListItemText
                                primary={`Date: ${entry.date.toDate ? entry.date.toDate().toLocaleDateString() : new Date(entry.date).toLocaleDateString()}`}
                                secondary={`Hours Worked: ${entry.hoursWorked}, Total Hours This Week: ${entry.totalWorkedHours || 0}`}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No worked hours recorded for the selected period.</Typography>
                )}
            </List>
        </Box>
    );
};

export default WorkedHoursView;