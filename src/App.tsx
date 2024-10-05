import { useState, useEffect } from "react";
import { Box, Tab, Tabs, Typography, Avatar, Button } from "@mui/material";
import ServersSchedule from "./schedules/ServersSchedule";
import BussersSchedule from "./schedules/BussersSchedule";
import CooksSchedule from "./schedules/CooksSchedule";
import HomePage from "./schedules/HomePage";
import { auth } from "./userAuth/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useUserStore } from "./stores/useUserStore";

export default function App() {
  const [value, setValue] = useState(0);

  const db = getFirestore();
  const { isLoggedIn, role, profilePic, setRole, setProfilePic, setIsLoggedIn } = useUserStore();

  useEffect(() => {
    // Listen for changes to the user's authentication state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await fetchUserRoleAndProfile(user.uid);
        if (userDoc) {
          setRole(userDoc.role);
          setProfilePic(userDoc.profilePic);
        }
        setIsLoggedIn(true);
      } else {
        setRole(null);
        setProfilePic(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [setRole, setProfilePic, setIsLoggedIn]);

  // Fetch role and profile picture from either 'employees' or 'employers' collection
  const fetchUserRoleAndProfile = async (userId: string) => {
    try {
      // Check 'employees' collection first
      let docRef = doc(db, "employees", userId);
      let docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // If not found in 'employees', check 'employers'
        docRef = doc(db, "employers", userId);
        docSnap = await getDoc(docRef);
      }

      if (docSnap.exists()) {
        const userData = docSnap.data();
        return {
          role: userData.employeeType || userData.role || null,
          profilePic: userData.profilePic || null,
        };
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role and profile picture:", error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      setIsLoggedIn(false); // Reset Zustand store states
      setRole(null);
      setProfilePic(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      {/* Header - Only show tabs if the user is logged in */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {isLoggedIn && (
          <>
            {/* Tabs */}
            <Tabs
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
              aria-label="schedule tabs"
            >
              <Tab label="Home" />
              {role === "manager" && <Tab label="Servers Schedule" />}
              {role === "manager" && <Tab label="Bussers Schedule" />}
              {role === "manager" && <Tab label="Cooks Schedule" />}
              {role === "server" && <Tab label="Servers Schedule" />}
              {role === "busser" && <Tab label="Bussers Schedule" />}
              {role === "cook" && <Tab label="Cooks Schedule" />}
            </Tabs>

            {/* Profile Avatar and Logout Button */}
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              {profilePic && (
                <Avatar alt="Profile Picture" src={profilePic} sx={{ mr: 2 }} />
              )}
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Tabs Content */}
      {value === 0 && (
        <Box p={3}>
          <Typography variant="h5">Home</Typography>
          <HomePage />
        </Box>
      )}
      {value === 1 && role === "server" && (
        <Box p={3}>
          <Typography variant="h5">Servers Schedule</Typography>
          <ServersSchedule />
        </Box>
      )}
      {value === 2 && role === "busser" && (
        <Box p={3}>
          <Typography variant="h5">Bussers Schedule</Typography>
          <BussersSchedule />
        </Box>
      )}
      {value === 3 && role === "cook" && (
        <Box p={3}>
          <Typography variant="h5">Cooks Schedule</Typography>
          <CooksSchedule />
        </Box>
      )}

      {/* Manager's View */}
      {role === "manager" && value === 1 && (
        <Box p={3}>
          <Typography variant="h5">Servers Schedule</Typography>
          <ServersSchedule />
        </Box>
      )}
      {role === "manager" && value === 2 && (
        <Box p={3}>
          <Typography variant="h5">Bussers Schedule</Typography>
          <BussersSchedule />
        </Box>
      )}
      {role === "manager" && value === 3 && (
        <Box p={3}>
          <Typography variant="h5">Cooks Schedule</Typography>
          <CooksSchedule />
        </Box>
      )}
    </div>
  );
}
