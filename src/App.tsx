import React, { useState, useEffect } from "react";
import { Box, Tab, Tabs, Avatar, Button } from "@mui/material";
import ServersSchedule from "./schedules/ServersSchedule";
import BussersSchedule from "./schedules/BussersSchedule";
import CooksSchedule from "./schedules/CooksSchedule";
import HomePage from "./schedules/HomePage";
import { auth } from "./userAuth/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useUserStore } from "./stores/useUserStore";

// 1. Create function called App() 
export default function App() {

  //2. create const to store the firebase database value that include all the currentTab thingy 
  // Note: db = database 
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
  } = useUserStore(); //put all those things in useUserStore()

  //3. We want to user to pick role ( Manager or Employee), so we create selected role state 
  const [selectedRole, setSelectedRole] = useState<string | null>(null); // New state for role selection

  // 4. Remap currentTab to ensure it's always valid for the role (certain roles hide tabs and cause issues)
  const mapCurrentTab = () => {
    if (role === "server" && currentTab > 1) return 1;
    if (role === "busser" && currentTab > 1) return 1;
    if (role === "cook" && currentTab > 1) return 1;
    return currentTab;
  };

  // 5. Because we have tab, we have to create a function to handle tab change 
  const handleTabChange = (newValue: number) => {
    setCurrentTab(newValue); // Trying to get this to stay in zustand but not sure it's needed
  };

  //6. handle role selection, para role will take string as value. User select role and will be save in zustand state 
  const handleRoleSelection = (role: string) => {
    setSelectedRole(role); // Set selected role state
    setRole(role); // Set role in zustand state
  };


  //7. Put everything together we have: setSelectedRole, mapCurrentTab, handleTabChange, handleRoleSelection

  //8. Map change depends on user role 
  useEffect(() => {
    // Ensure the currentTab is valid whenever role changes
    const validTab = mapCurrentTab();
    if (validTab !== currentTab) {
      setCurrentTab(validTab); // Remap to a valid tab
    }
  }, [role, currentTab, setCurrentTab]); 

  //9. Listen for changes to the user's authentication state 
  // omg im in my dum era 
  useEffect(() => {
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

  // Fetch role and profile picture from Firestore
  const fetchUserRoleAndProfile = async (userId: string) => {
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
        ]}
        {role === "server" && <Tab label="Servers Schedule" />}
        {role === "busser" && <Tab label="Bussers Schedule" />}
        {role === "cook" && <Tab label="Cooks Schedule" />}
      </Tabs>
    );
  };

  const renderTabContent = () => {
    switch (mapCurrentTab()) {
      case 0:
        return <HomePage/>;
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

  // Check if a role has been selected; if not, display role selection landing page
  if (!selectedRole) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Welcome to PowerShift</h1>
        <p>Please select your role:</p>
        <Button 
          variant="contained" 
          onClick={() => handleRoleSelection('employer')} 
          style={{ margin: '10px', padding: '10px 20px' }}
        >
          Manager
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleRoleSelection('server')} 
          style={{ margin: '10px', padding: '10px 20px' }}
        >
          Employee
        </Button>
      </div>
    );
  }

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
