import { useEffect } from "react";
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
  const db = getFirestore();
  const {
    currentTab,
    isLoggedIn,
    role,
    profilePic,
    setRole,
    setProfilePic,
    setIsLoggedIn,
    setCurrentTab,
  } = useUserStore();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue); // Persist the tab in Zustand store
  };

  useEffect(() => {
    // Listen for changes to the user's authentication state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await fetchUserRoleAndProfile(user.uid);
        if (userDoc) {
          setRole(userDoc.role);
          setProfilePic(userDoc.profilePic);

          // Automatically set currentTab based on role
          if (userDoc.role === "server") {
            setCurrentTab(1); // Set to Servers schedule
          } else if (userDoc.role === "busser") {
            setCurrentTab(2); // Set to Bussers schedule
          } else if (userDoc.role === "cook") {
            setCurrentTab(3); // Set to Cooks schedule
          } else if (userDoc.role === "employer") {
            setCurrentTab(1); // Employers default to Servers schedule
          }
        }
        setIsLoggedIn(true);
      } else {
        // Reset everything on logout
        setRole(null);
        setProfilePic(null);
        setIsLoggedIn(false);
        setCurrentTab(0); // Reset to Home tab on logout
      }
    });

    return () => unsubscribe();
  }, [setRole, setProfilePic, setIsLoggedIn, setCurrentTab]);

  // Fetch role and profile picture from either 'employees' or 'employers' collection
  const fetchUserRoleAndProfile = async (userId) => {
    try {
      let docRef = doc(db, "employees", userId);
      let docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
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
      await signOut(auth);
      setIsLoggedIn(false);
      setRole(null);
      setProfilePic(null);
      setCurrentTab(0); // Reset to Home tab after logout
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
              value={currentTab} // Directly use currentTab from Zustand store
              onChange={handleTabChange}
              aria-label="schedule tabs"
            >
              <Tab label="Home" />
              {role === "employer" && <Tab label="Servers Schedule" />}
              {role === "employer" && <Tab label="Bussers Schedule" />}
              {role === "employer" && <Tab label="Cooks Schedule" />}

              {/* Employees see only their own schedules */}
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
      {currentTab === 0 && (
        <Box p={3}>
          <HomePage setValue={setCurrentTab} />
        </Box>
      )}
      {currentTab === 1 && (role === "server" || role === "employer") && (
        <Box p={3}>
          <Typography variant="h5">Servers Schedule</Typography>
          <ServersSchedule />
        </Box>
      )}
      {currentTab === 2 && (role === "busser" || role === "employer") && (
        <Box p={3}>
          <Typography variant="h5">Bussers Schedule</Typography>
          <BussersSchedule />
        </Box>
      )}
      {currentTab === 3 && (role === "cook" || role === "employer") && (
        <Box p={3}>
          <Typography variant="h5">Cooks Schedule</Typography>
          <CooksSchedule />
        </Box>
      )}
    </div>
  );
}
