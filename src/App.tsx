import { useEffect } from "react";
import { Box, Tab, Tabs, Avatar, Button } from "@mui/material";
import ServersSchedule from "./schedules/ServerSchedule";
import BussersSchedule from "./schedules/BussersSchedule";
import CooksSchedule from "./schedules/CooksSchedule";
import HomePage from "./schedules/HomePage";
import { auth } from "./userAuth/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useUserStore } from "./stores/useUserStore";
import AppFullCalendar from "./schedules/AppFullCalendar";


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

  // Remap currentTab to ensure it's always valid for the role (certain roles hides tabs and it causes issues)
  const mapCurrentTab = () => {
    if (role === "server" && currentTab > 1) return 1;
    if (role === "busser" && currentTab > 1) return 1;
    if (role === "cook" && currentTab > 1) return 1;
    if (role === "employee" && currentTab > 1) return 1;
    return currentTab;
  };

  const handleTabChange = (newValue: number) => {
    setCurrentTab(newValue); // Trying to get this to stay in zustand but not sure it's needed
  };

  useEffect(() => {
    // Ensure the currentTab is valid whenever role changes
    const validTab = mapCurrentTab();
    if (validTab !== currentTab) {
      setCurrentTab(validTab); // Remap to a valid tab
    }
  }, [role, currentTab, setCurrentTab]);

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
            setCurrentTab(1); // Set to Bussers schedule (remapped)
          } else if (userDoc.role === "cook") {
            setCurrentTab(1); // Set to Cooks schedule (remapped)
          } else if (userDoc.role === "employee") {
            setCurrentTab(1);
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
  
  
  const fetchUserRoleAndProfile = async (userId: string) => {
    try {
      let userDocRef = doc(db, "employees", userId);
      let userDocSnap = await getDoc(userDocRef);
  
      // If not found in employees, check in employers
      if (!userDocSnap.exists()) {
        userDocRef = doc(db, "employers", userId);
        userDocSnap = await getDoc(userDocRef);
      }
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return {
          role: userData.employeeType || userData.role || null,
          profilePic: userData.profilePic || null,
        };
      } else {
        console.log("No such document found in Firestore!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role and profile:", error);
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

  // Define the tabs based on role
  const renderTabs = () => {
    return (
      <Tabs
        value={mapCurrentTab()}
        onChange={(_, newValue) => handleTabChange(newValue)}
        aria-label="schedule tabs"
      >
        <Tab label="Home" />
        {role === "employer" && [
          <Tab label="Servers Schedule" key="servers-tab" />,
          <Tab label="Bussers Schedule" key="bussers-tab" />,
          <Tab label="Cooks Schedule" key="cooks-tab" />,
          <Tab label="Full Schedule" key="full-tab" />,
          

        ]}
        {role === "server" && <Tab label="Servers Schedule" />}
        {role === "busser" && <Tab label="Bussers Schedule" />}
        {role === "cook" && <Tab label="Cooks Schedule" />}
        {role === "employee" && <Tab label="Full Schedule" />}
      </Tabs>
    );
  };

  const renderTabContent = () => {
    switch (mapCurrentTab()) {
      case 0:
        return <HomePage setValue={setCurrentTab} />;
      case 1:
        if (role === "server" || role === "employer") {
          return <ServersSchedule />;
        }
        if (role === "busser") {
          return <BussersSchedule />;
        }
        if (role === "cook") {
          return <CooksSchedule />;
        }
        if (role === "employee") {
          return <AppFullCalendar />
        }
        break;
      case 2:
        if (role === "employer") {
          return <BussersSchedule />;
        }
        break;
      case 3:
        if (role === "employer") {
          return <CooksSchedule />;
        }
        break;
      default:
        return null;
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
            {/* Render the tabs based on role */}
            {renderTabs()}

            {/* Profile Avatar and Logout Button */}
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              {profilePic ? (
                <Avatar alt="Profile Picture" src={profilePic} sx={{ mr: 2 }} />
              ) : (
                <Avatar alt="No Profile Picture" sx={{ mr: 2 }}>
                  N/A
                </Avatar>
              )}
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Tabs Content */}
      <Box p={3}>{renderTabContent()}</Box>
    </div>
  );
}
