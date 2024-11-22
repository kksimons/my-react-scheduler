// Resources 
// CHATGPT
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { CssBaseline, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import theme from "@theme/theme"; // Assuming theme is defined elsewhere
import { useNavigate } from "react-router-dom";
import EditEmployerContact from "./EditEmployerContact";

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => { // async means it is allowing certain tasks to run concurrently 
            try {
                const contactsCollection = collection(db, "employers");
                const contactsSnapshot = await getDocs(contactsCollection);
                const contactList = contactsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setContacts(contactList);
            } catch (error) {
                setError("Error fetching contact data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, [db]);

    const handleEdit = (contactId) => {
        navigate(`/EditEmployerContact/${contactId}`);  // Navigate to EditEmployerContact page   
    };

    const handleViewProfile = (id) => {
        navigate(`/contactProfile/${id}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="contact-list-container">
                <Typography variant="h5" color="primary.dark" gutterBottom>
                    Contact List
                </Typography>

                {isLoading && <Typography>Loading contacts...</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                {!isLoading && !error && contacts.length === 0 && (
                    <Typography>No contacts found.</Typography>
                )}

                {!isLoading && !error && contacts.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.secondary.light }}>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>System Side</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contacts.map((contact, index) => (
                                    <TableRow
                                        key={contact.id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? 'transparent' : 'rgb(241, 238, 255)',
                                        }}
                                    >
                                        <TableCell>{contact.employer_fname}</TableCell>
                                        <TableCell>{contact.employer_lname}</TableCell>
                                        <TableCell>{contact.employer_email}</TableCell>
                                        <TableCell>{contact.employer_phone_number}</TableCell>
                                        <TableCell>{contact.employer_system}</TableCell>
                                        <TableCell>{contact.employer_position}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit Contact" arrow>
                                                <IconButton onClick={() => handleEdit(contact.id)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            {/* Doesnt have a corosponding page yet */}
                                            {/* <Tooltip title="View Profile" arrow>
                                                <IconButton onClick={() => handleViewProfile(contact.id)}>
                                                    <AccountBoxIcon />
                                                </IconButton>
                                            </Tooltip> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </ThemeProvider>
    );
};

export default ContactList;
