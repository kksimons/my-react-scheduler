import { useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ServersSchedule from "./schedules/ServersSchedule";
import BussersSchedule from "./schedules/BussersSchedule";
import CooksSchedule from "./schedules/CooksSchedule";
import HomePage from "./schedules/HomePage";
import { auth } from "./userAuth/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useUserStore } from "./stores/useUserStore";
import LandingPage from "./landingPage/LandingPage";

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
    if (!isLoggedIn) return currentTab;
    if (role === "server" && currentTab > 2) return 2; // Adjusted because LandingPage is now tab 0
    if (role === "busser" && currentTab > 2) return 2;
    if (role === "cook" && currentTab > 2) return 2;
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
            setCurrentTab(2); // Set to Servers schedule
          } else if (userDoc.role === "busser") {
            setCurrentTab(3); // Set to Bussers schedule (remapped)
          } else if (userDoc.role === "cook") {
            setCurrentTab(4); // Set to Cooks schedule (remapped)
          } else if (userDoc.role === "employer") {
            setCurrentTab(2); // Employers default to Servers schedule
          }
        }
        setIsLoggedIn(true);
      } else {
        // Reset everything on logout
        setRole(null);
        setProfilePic(null);
        setIsLoggedIn(false);
        setCurrentTab(0); // Reset to landing page tab on logout
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
      setCurrentTab(1); // Reset to Home tab after logout
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
        <Tab label="Landing Page" sx={{ display: "none" }} />
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
        return <LandingPage />;
      case 1:
        return <HomePage />;
      case 2:
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
      case 3:
        if (role === "employer") {
          return <BussersSchedule />;
        }
        break;
      case 4:
        if (role === "employer") {
          return <CooksSchedule />;
        }
        break;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header - Only show tabs if the user is logged in */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            "linear-gradient(97deg, rgba(233,104,255,1) 0%, rgba(69,91,235,1) 37%, rgba(34,24,167,1) 79%)",
          // borderColor: "divider",
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
      <Box>{renderTabContent()}</Box>
    </>
  );
}
