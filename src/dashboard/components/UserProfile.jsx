// // import React, { useEffect, useState } from "react";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { useAuth } from "@userAuth/contexts/AuthContext";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Avatar,
//   Grid,
//   Button,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState, useEffect } from "react";

// const UserProfile = ({ employeeId, navigate }) => {
//   const { user } = useAuth(); // Get the current user from the AuthContext
//   const [userData, setUserData] = useState(null); // State to store the user data
//   const [role, setRole] = useState(""); // 'employees' or 'employers'
//   const [loading, setLoading] = useState(true); // Loading state

//   const db = getFirestore(); // Get the Firestore instance

//   let uid; // Determine the user ID
//   if (employeeId) {
//     uid = employeeId;
//   } else if (user) {
//     uid = user.uid;
//   } else {
//     uid = null;
//   }

//   // Fetch user data from Firestore
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!uid) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const employeeDocRef = doc(db, "employees", uid);
//         const employerDocRef = doc(db, "employers", uid);

//         const employeeDocSnap = await getDoc(employeeDocRef);
//         if (employeeDocSnap.exists()) {
//           const data = employeeDocSnap.data();
//           setUserData(data);
//           setRole("employees");
//         } else {
//           const employerDocSnap = await getDoc(employerDocRef);
//           if (employerDocSnap.exists()) {
//             const data = employerDocSnap.data();
//             setUserData(data);
//             setRole("employers");
//           } else {
//             toast.error("User not found.");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         toast.error("Failed to fetch user data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [uid, db]);

//   // Loading animation when fetching data
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!userData) {
//     return <Typography variant="h6">User data not found.</Typography>;
//   }

//   // Combine first and last name for full name
//   const firstName = userData.employee_fname || userData.employer_fname || "";
//   const lastName = userData.employee_lname || userData.employer_lname || "";
//   const fullName = `${firstName} ${lastName}`.trim();

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       p={4}
//       mt={4}
//       sx={{
//         backgroundColor: "background.paper",
//         borderRadius: 2,
//         boxShadow: 3,
//         maxWidth: 600,
//         margin: "0 auto",
//       }}
//     >
//       <Avatar
//         src={userData.photoURL}
//         alt={fullName}
//         sx={{ width: 150, height: 150, mb: 2 }}
//       />
//       <Typography variant="h4" gutterBottom color="primary">
//         {fullName}
//       </Typography>
//       <Typography variant="subtitle1" gutterBottom color="textSecondary">
//         {userData.employee_type || userData.employer_position}
//       </Typography>

//       <Box mt={3} width="100%">
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} sm={6}>
//             <Typography variant="h6">Email:</Typography>
//             <Typography variant="body1">
//               {userData.employee_email || userData.employer_email}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="h6">Phone Number:</Typography>
//             <Typography variant="body1">
//               {userData.employee_phone_number || userData.employer_phone_number}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="h6">Date of Birth:</Typography>
//             <Typography variant="body1">
//               {userData.employee_dob || userData.employer_dob}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="h6">System Side:</Typography>
//             <Typography variant="body1">
//               {userData.employee_system_side || userData.employer_system_side}
//             </Typography>
//           </Grid>
//           {role === "employees" && (
//             <Grid item xs={12} sm={6}>
//               <Typography variant="h6">Position:</Typography>
//               <Typography variant="body1">{userData.employee_position}</Typography>
//             </Grid>
//           )}
//         </Grid>

//         {/* Back Button */}
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={() => navigate("/employeeManagement/employeeList")}
//           sx={{ mt: 3 }}
//         >
//           Back to Employee List
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default UserProfile;
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@userAuth/contexts/AuthContext";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Grid,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePicture from "./ProfilePicture"; // Ensure this path is correct

const UserProfile = ({ employeeId, viewerId, navigate }) => {
  const { user } = useAuth(); // Get the current user from the AuthContext
  const [userData, setUserData] = useState(null); // State to store the user data
  const [role, setRole] = useState(""); // 'employees' or 'employers'
  const [loading, setLoading] = useState(true); // Loading state

  // Edit user profile state
  const [editMode, setEditMode] = useState(false); // State to store the edit mode
  const [editData, setEditData] = useState(null); // State to store the edited data
  const [formErrors, setFormErrors] = useState({}); // State to store form errors
  const [canEdit, setCanEdit] = useState(false); // Permission to edit

  const db = getFirestore(); // Get the Firestore instance

  let uid; // Declare a variable to store the user ID
  if (employeeId) {
    uid = employeeId;
  } else if (user) {
    uid = user.uid;
  } else {
    uid = null;
  }

 // Fetch user data from Firestore
 useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
  
      try {
        const employeeDocRef = doc(db, "employees", uid);
        const employerDocRef = doc(db, "employers", uid);
  
        const employeeDocSnap = await getDoc(employeeDocRef);
        if (employeeDocSnap.exists()) {
          const data = employeeDocSnap.data();
          setUserData(data);
          setRole("employees");
  
          // Allow editing if the current user is viewing their own profile
          setCanEdit(user && user.uid === uid);
        } else {
          const employerDocSnap = await getDoc(employerDocRef);
          if (employerDocSnap.exists()) {
            const data = employerDocSnap.data();
            setUserData(data);
            setRole("employers");
  
            // Allow editing if the current user is viewing their own profile
            setCanEdit(user && user.uid === uid);
          } else {
            toast.error("User not found.");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [uid, db, user]);
  
  

  const handleEditToggle = () => {
    setEditMode((prev) => !prev); // Toggle the edit mode
    setEditData(userData); // Set the edit data to the user data
  };

  // Handle save edit
  const handleEditChange = (e) => {
    setEditData({
      ...editData, // Spread the existing edit data
      [e.target.name]: e.target.value, // Update the specific field
    });
  };

  const validateEditForm = () => {
    const errors = {}; // Declare errors object
    const phoneRegex = /^\d{10,15}$/;
    const nameRegex = /^[a-zA-Z]+$/;
    const dob = new Date(editData.employee_dob || editData.employer_dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 13 || age > 120) {
      errors.dob = "Employee must be at least 13 years old and at most 120 years old";
      toast.error("Employee must be at least 13 years old and at most 120 years old");
    }

    if (
      !phoneRegex.test(editData.employee_phone_number || editData.employer_phone_number)
    ) {
      errors.phoneNumber =
        "Phone number must be between 10 and 15 digits long and contain only numbers";
      toast.error("Phone number must be between 10 and 15 digits long and contain only numbers");
    }

    if (!nameRegex.test(editData.employee_fname || editData.employer_fname)) {
      errors.firstName = "First name must contain only letters";
      toast.error("First name must contain only letters");
    }

    if (!nameRegex.test(editData.employee_lname || editData.employer_lname)) {
      errors.lastName = "Last name must contain only letters";
      toast.error("Last name must contain only letters");
    }

    if (!editData.employee_system_side && !editData.employer_system_side) {
      errors.systemSide = "System Side is required";
      toast.error("System Side is required");
    }

    if (!editData.employee_position && !editData.employer_position) {
      errors.position = "Position is required";
      toast.error("Position is required");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    try {
      const userDoc = role === "employees" ? "employees" : "employers";
      await updateDoc(doc(db, userDoc, uid), {
        ...editData,
      });

      setUserData(editData);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  // Loading animation when load is true
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return <Typography variant="h6">User data not found.</Typography>;
  }

  // Combine first and last name for full name
  const firstName = userData.employee_fname || userData.employer_fname || "";
  const lastName = userData.employee_lname || userData.employer_lname || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
      mt={4}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <Avatar
        src={userData.photoURL || "/default-avatar.png"}
        alt={fullName}
        sx={{ width: 150, height: 150, mb: 2 }}
      />
    {canEdit && (
    <Button
        variant="outlined"
        component="label"
        sx={{ mt: 2 }}
    >
        Choose File
        <input
        type="file"
        hidden
        onChange={(e) => handleProfilePictureUpload(e.target.files[0])} // Add upload logic
        />
    </Button>
    )}

      <Typography variant="h4" gutterBottom color="primary">
        {fullName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        {userData.employee_type || userData.employer_position}
      </Typography>

      {/* Profile Picture Upload */}
      <ProfilePicture
        role={role}
        uid={uid}
        canEdit={user && user.uid === uid} // Only allow editing if viewing own profile
      />

      <Box mt={3} width="100%" maxWidth="600px">
        {userData && !editMode ? (
          <>
            {/* Display user data */}
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Email:</Typography>
                <Typography variant="body1">
                  {userData.employee_email || userData.employer_email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Phone Number:</Typography>
                <Typography variant="body1">
                  {userData.employee_phone_number || userData.employer_phone_number}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Date of Birth:</Typography>
                <Typography variant="body1">
                  {userData.employee_dob || userData.employer_dob}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">System Side:</Typography>
                <Typography variant="body1">
                  {userData.employee_system_side || userData.employer_system_side}
                </Typography>
              </Grid>
              {role === "employees" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Position:</Typography>
                    <Typography variant="body1">
                      {userData.employee_position}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Availability:</Typography>
                    <Typography variant="body1">
                      {userData.availability
                        ? Object.entries(userData.availability)
                            .map(
                              ([day, options]) => `${day}: ${options.join(", ")}`
                            )
                            .join("; ")
                        : "Not set"}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>

            {/* Edit Profile Button */}
            {canEdit}
          </>
        ) : editMode && userData ? (
          <>
            {/* Edit Form */}
            <form onSubmit={handleEditSubmit}>
              <Grid container spacing={2} justifyContent="center">
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!formErrors.firstName}>
                    <FormLabel>First Name:</FormLabel>
                    <TextField
                      name="employee_fname"
                      value={editData.employee_fname || ""}
                      onChange={handleEditChange}
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                      required
                      disabled={!canEdit}
                    />
                  </FormControl>
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!formErrors.lastName}>
                    <FormLabel>Last Name:</FormLabel>
                    <TextField
                      name="employee_lname"
                      value={editData.employee_lname || ""}
                      onChange={handleEditChange}
                      error={!!formErrors.lastName}
                      helperText={formErrors.lastName}
                      required
                      disabled={!canEdit}
                    />
                  </FormControl>
                </Grid>

                {/* Date of Birth */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!formErrors.dob}>
                    <FormLabel>Date of Birth:</FormLabel>
                    <TextField
                      name="employee_dob"
                      type="date"
                      value={editData.employee_dob || ""}
                      onChange={handleEditChange}
                      error={!!formErrors.dob}
                      helperText={formErrors.dob}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={!canEdit}
                    />
                  </FormControl>
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!formErrors.phoneNumber}>
                    <FormLabel>Phone Number:</FormLabel>
                    <TextField
                      name="employee_phone_number"
                      value={editData.employee_phone_number || ""}
                      onChange={handleEditChange}
                      error={!!formErrors.phoneNumber}
                      helperText={formErrors.phoneNumber}
                      required
                      disabled={!canEdit}
                    />
                  </FormControl>
                </Grid>

                {/* System Side */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!formErrors.systemSide}>
                    <FormLabel>System Side</FormLabel>
                    <Select
                      name="employee_system_side"
                      value={editData.employee_system_side || ""}
                      onChange={handleEditChange}
                      required
                      disabled={!canEdit}
                    >
                      <MenuItem value="" disabled>
                        Select System Side
                      </MenuItem>
                      <MenuItem value="Kitchen Side">Kitchen Side</MenuItem>
                      <MenuItem value="Dining Side">Dining Side</MenuItem>
                    </Select>
                    {formErrors.systemSide && (
                      <FormHelperText>{formErrors.systemSide}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Position */}
                {editData.employee_system_side && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.position}>
                      <FormLabel>Position</FormLabel>
                      <Select
                        name="employee_position"
                        value={editData.employee_position || ""}
                        onChange={handleEditChange}
                        required
                        disabled={!canEdit}
                      >
                        <MenuItem value="" disabled>
                          Select Position
                        </MenuItem>
                        {editData.employee_system_side === "Kitchen Side" && (
                          <MenuItem value="Cook">Cook</MenuItem>
                        )}
                        {editData.employee_system_side === "Dining Side" && (
                          <>
                            <MenuItem value="Server">Server</MenuItem>
                            <MenuItem value="Busser">Busser</MenuItem>
                          </>
                        )}
                      </Select>
                      {formErrors.position && (
                        <FormHelperText>{formErrors.position}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              {canEdit && (
                <Box mt={3} display="flex" justifyContent="space-between">
                  <Button variant="contained" color="primary" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                </Box>
              )}
            </form>
          </>
        ) : null}
      </Box>

      {/* Back Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate('/employeeManagement/employeeList')}
        sx={{ mt: 2 }}
      >
        Back to Employee List
      </Button>
    </Box>
  );
};

export default UserProfile;
