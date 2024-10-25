import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Paper,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  LinearProgress,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import { auth } from "../userAuth/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../userAuth/firebase";
import { useUserStore } from "../stores/useUserStore";
import EmployeeList from "../manager-dashboard/EmployeeManagement";
import EmployeeManagement from "../manager-dashboard/EmployeeManagement";

// I hate you typescript


export default function HomePage() {
  const db = getFirestore();
  const [isNewUser, setIsNewUser] = useState(true);
  const [step, setStep] = useState(0);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shiftsPerDay, setShiftsPerDay] = useState(1);
  const [shiftTimings, setShiftTimings] = useState([{ start: "", end: "" }]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    setCurrentTab,
    isLoggedIn,
    setIsLoggedIn,
    setRole,
    setProfilePic: setStoreProfilePic,
  } = useUserStore();

  interface UserInfo {
    email: string;
    password: string;
    role: string;
    name: string;
    employeeType: string;
    workType: string;
    availability: { [key: string]: string[] };
    excludedDays: string[];
    shiftDetails: any[];
  }

  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
    role: "",
    name: "",
    employeeType: "",
    workType: "",
    availability: {
      mon: ["morning", "afternoon", "evening"],
      tue: ["morning", "afternoon", "evening"],
      wed: ["morning", "afternoon", "evening"],
      thu: ["morning", "afternoon", "evening"],
      fri: ["morning", "afternoon", "evening"],
    },
    excludedDays: [],
    shiftDetails: [],
  });

  const steps = ["Enter Email & Password", "Select Role", "Fill Out Details"];

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Listen to Firebase Auth state, grab the role, and persist with zustand
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await fetchUserRoleAndProfile(user.uid);
        if (userDoc) {
          setRole(userDoc.role);
          setStoreProfilePic(userDoc.profilePic);
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [setIsLoggedIn, setRole, setStoreProfilePic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (day: string, shift: string) => {
    setUserInfo((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].includes(shift)
          ? prev.availability[day].filter((s) => s !== shift) // Deselect shift
          : [...prev.availability[day], shift], // Select shift
      },
    }));
  };

  const handleShiftCountChange = (e: SelectChangeEvent<number>) => {
    const count = parseInt(e.target.value as string);
    setShiftsPerDay(count);
    const updatedTimings = Array.from({ length: count }, (_, i) => ({
      start: shiftTimings[i]?.start || "",
      end: shiftTimings[i]?.end || "",
    }));
    setShiftTimings(updatedTimings);
  };

  const handleShiftTimingChange = (
    index: number,
    type: "start" | "end",
    value: string
  ) => {
    const updatedTimings = [...shiftTimings];
    updatedTimings[index][type] = value;
    setShiftTimings(updatedTimings);
  };

  const fetchUserRoleAndProfile = async (userId: string) => {
    try {
      // Query the 'employees' collection where the 'userId' field matches the authenticated user's UID
      const employeesQuery = collection(db, "employees");
      const employeeQuerySnapshot = await getDocs(
        query(employeesQuery, where("userId", "==", userId))
      );

      // Check if a matching employee document was found
      if (!employeeQuerySnapshot.empty) {
        const employeeDoc = employeeQuerySnapshot.docs[0].data();
        console.log("Employee document found: ", employeeDoc); // Log for debugging

        // Use the employeeType from Firestore instead of hardcoding the role
        return {
          role: employeeDoc.employeeType, // Get the actual employee type (server, busser, cook, etc.)
          profilePic: employeeDoc.profilePic || null,
        };
      }

      // If not found in 'employees', check 'employers' in the same way
      const employersQuery = collection(db, "employers");
      const employerQuerySnapshot = await getDocs(
        query(employersQuery, where("userId", "==", userId))
      );

      if (!employerQuerySnapshot.empty) {
        const employerDoc = employerQuerySnapshot.docs[0].data();
        console.log("Employer document found: ", employerDoc); // Log for debugging
        return {
          role: "employer", // Ensure that 'role' is returned as 'employer'
          profilePic: employerDoc.profilePic || null,
        };
      }

      console.log("No user document found for this user");
      return null;
    } catch (error) {
      console.error("Error fetching user role and profile picture:", error);
      return null;
    }
  };

  const handleSignUpOrSignIn = async () => {
    try {
      if (isNewUser) {
        const {
          email,
          password,
          role,
          availability,
          workType,
          name,
          employeeType,
          excludedDays,
        } = userInfo;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = userCredential.user.uid;

        const profilePicUrl = await uploadProfilePicToStorage(userId);

        if (role === "employee") {
          await addDoc(collection(db, "employees"), {
            userId,
            email,
            role,
            name,
            employeeType,
            availability,
            workType,
            profilePic: profilePicUrl || null,
          });
        } else {
          await addDoc(collection(db, "employers"), {
            userId,
            email,
            role,
            name,
            excludedDays,
            shiftsPerDay,
            shiftTimings,
            profilePic: profilePicUrl || null,
          });
        }

        setRole(role);
        setStoreProfilePic(profilePicUrl);
        setIsLoggedIn(true);
        setSuccessMessage("Sign-up successful!");
        handleScheduleUpdate(role);
      } else {
        const { email, password } = userInfo;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userDoc = await fetchUserRoleAndProfile(userCredential.user.uid);

        if (userDoc) {
          setRole(userDoc.role);
          setStoreProfilePic(userDoc.profilePic);
          setIsLoggedIn(true);
          setSuccessMessage("Login successful!");
          handleScheduleUpdate(userDoc.role);
        } else {
          setErrorMessage("No user document found for this user ID.");
        }
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error during sign-up or sign-in process:", error);
      setErrorMessage("Sign-in failed. Please check your credentials.");
      setOpenSnackbar(true);
    }
  };

  const handleScheduleUpdate = (userRole: string) => {
    if (userRole === "server") {
      setCurrentTab(2); // Adjust tab index as per your tab structure
    } else if (userRole === "busser") {
      setCurrentTab(2);
    } else if (userRole === "cook") {
      setCurrentTab(2);
    } else if (userRole === "employer") {
      setCurrentTab(2);
    }
  }

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file); // This stores the file locally in the component
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string); // This stores the preview URL for immediate feedback
      };
      reader.readAsDataURL(file); // Convert the image to a base64 URL for preview
    }
  };

  const uploadProfilePicToStorage = async (
    userId: string
  ): Promise<string | null> => {
    try {
      if (profilePic) {
        // Check if profilePic is set and is a File
        const storageRef = ref(storage, `profilePics/${userId}`);
        const uploadTask = uploadBytesResumable(storageRef, profilePic);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error("Error during upload:", error);
              reject(error);
            },
            async () => {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Profile picture uploaded, URL:", downloadUrl);
              resolve(downloadUrl); // Return the URL for the uploaded profile picture
            }
          );
        });
      } else {
        console.warn("No profile picture to upload");
        return null;
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return null;
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // marginTop: 20,
        // width: "full",
      }}
    >
      {isLoggedIn ? (
        <Paper
          elevation={3}
          sx={{ padding: 3, width: "full", marginBottom: 4 }}
        >

          <Typography variant="h6" gutterBottom>
            <EmployeeManagement />
          
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={3}
          sx={{ padding: 3, width: "500px", marginBottom: 4 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              gap: 1,
            }}
          >
            <Button
              variant={isNewUser ? "contained" : "outlined"}
              onClick={() => setIsNewUser(true)}
              fullWidth
            >
              New here? Sign up
            </Button>
            <Button
              variant={!isNewUser ? "contained" : "outlined"}
              onClick={() => setIsNewUser(false)}
              fullWidth
            >
              Already a user? Sign in
            </Button>
          </Box>

          {isNewUser ? (
            <Box>
              {step === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 4, mt: 2 }}>
                    Create an Account
                  </Typography>
                  <TextField
                    name="email"
                    label="Email"
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
              {step === 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 10,
                    mt: 10,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      padding: 2,
                      backgroundColor:
                        userInfo.role === "employee" ? "lightblue" : "white",
                      cursor: "pointer",
                      width: "45%",
                      textAlign: "center",
                      border:
                        userInfo.role === "employee"
                          ? "2px solid blue"
                          : "1px solid gray",
                    }}
                    onClick={() =>
                      setUserInfo({ ...userInfo, role: "employee" })
                    }
                  >
                    <Avatar
                      alt="Employee Avatar"
                      src={previewUrl || "./employee.jpg"}
                      sx={{ margin: "auto", width: 100, height: 100 }}
                    />
                    <Typography>Employee</Typography>
                  </Paper>

                  <Paper
                    elevation={3}
                    sx={{
                      padding: 2,
                      backgroundColor:
                        userInfo.role === "employer" ? "lightblue" : "white",
                      cursor: "pointer",
                      width: "45%",
                      textAlign: "center",
                      border:
                        userInfo.role === "employer"
                          ? "2px solid blue"
                          : "1px solid gray",
                    }}
                    onClick={() =>
                      setUserInfo({ ...userInfo, role: "employer" })
                    }
                  >
                    <Avatar
                      alt="Employer Avatar"
                      src="/employer.jpg"
                      sx={{ margin: "auto", width: 100, height: 100 }}
                    />
                    <Typography>Employer</Typography>
                  </Paper>
                </Box>
              )}
              {/* Employee Flow */}
              {step === 2 && userInfo.role === "employee" && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 4 }}>
                    Employee Details
                  </Typography>
                  <TextField
                    name="name"
                    label="Full Name"
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="employee-type-label">
                      Employee Type
                    </InputLabel>
                    <Select
                      labelId="employee-type-label"
                      name="employeeType"
                      value={userInfo.employeeType}
                      onChange={handleSelectChange}
                      label="Employee Type"
                    >
                      <MenuItem value="server">Server</MenuItem>
                      <MenuItem value="busser">Busser</MenuItem>
                      <MenuItem value="cook">Cook</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 4 }}>
                    Profile Picture
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      cursor: "pointer",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      alt="Click to Upload"
                      src={previewUrl || "./placeholder-avatar.jpg"}
                      sx={{ width: 100, height: 100 }}
                      onClick={() =>
                        document.getElementById("profilePicInput")?.click()
                      }
                    />
                    <input
                      accept="image/*"
                      id="profilePicInput"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleProfilePicUpload}
                    />
                  </Box>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ mb: 2 }}
                    />
                  )}

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="work-type-label">Work Type</InputLabel>
                    <Select
                      labelId="work-type-label"
                      name="workType"
                      value={userInfo.workType}
                      onChange={handleSelectChange}
                      label="Work Type"
                    >
                      <MenuItem value="full_time">Full-time</MenuItem>
                      <MenuItem value="part_time">Part-time</MenuItem>
                    </Select>
                  </FormControl>

                  <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 4 }}>
                    Availability
                  </Typography>
                  {["mon", "tue", "wed", "thu", "fri"].map((day) => (
                    <Box key={day}>
                      <Typography variant="subtitle1">
                        {day.toUpperCase()}
                      </Typography>
                      {["morning", "afternoon", "evening"].map((shift) => (
                        <Button
                          key={shift}
                          variant={
                            userInfo.availability[day].includes(shift)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleAvailabilityChange(day, shift)}
                          sx={{ mr: 1, mb: 1 }}
                        >
                          {shift}
                        </Button>
                      ))}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Employer Flow */}
              {step === 2 && userInfo.role === "employer" && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 4 }}>
                    Profile Picture
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      cursor: "pointer",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      alt="Click to Upload"
                      src={previewUrl || "./placeholder-avatar.jpg"}
                      sx={{ width: 100, height: 100 }}
                      onClick={() =>
                        document.getElementById("profilePicInput")?.click()
                      }
                    />
                    <input
                      accept="image/*"
                      id="profilePicInput"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleProfilePicUpload}
                    />
                  </Box>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ mb: 2 }}
                    />
                  )}
                  <Typography variant="h6" gutterBottom>
                    Days of Operation
                  </Typography>
                  {["mon", "tue", "wed", "thu", "fri"].map((day) => (
                    <Button
                      key={day}
                      variant={
                        userInfo.excludedDays.includes(day)
                          ? "outlined"
                          : "contained"
                      }
                      onClick={() => handleAvailabilityChange(day, "")}
                      sx={{ mr: 1, mb: 1 }}
                    >
                      {day.toUpperCase()}
                    </Button>
                  ))}

                  <Typography variant="h6" gutterBottom>
                    Shifts Per Day
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="shifts-per-day">Shifts per Day</InputLabel>
                    <Select
                      labelId="shifts-per-day"
                      value={shiftsPerDay}
                      onChange={handleShiftCountChange}
                      label="Shifts per Day"
                    >
                      {[1, 2, 3].map((shift) => (
                        <MenuItem key={shift} value={shift}>
                          {shift}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {shiftTimings.map((shift, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <TextField
                        label={`Shift ${index + 1} Start Time`}
                        type="time"
                        value={shift.start}
                        onChange={(e) =>
                          handleShiftTimingChange(
                            index,
                            "start",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                      <TextField
                        label={`Shift ${index + 1} End Time`}
                        type="time"
                        value={shift.end}
                        onChange={(e) =>
                          handleShiftTimingChange(index, "end", e.target.value)
                        }
                        fullWidth
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Stepper Controls */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 3,
                  mb: 7,
                }}
              >
                <Button disabled={step === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    step === steps.length - 1
                      ? handleSignUpOrSignIn
                      : handleNext
                  }
                >
                  {step === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>

              {/* Stepper Below */}
              <Stepper activeStep={step} sx={{ width: "100%", marginTop: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          ) : (
            <Box>
              {/* Login Form */}
              <Typography variant="h6" gutterBottom>
                Sign In
              </Typography>
              <TextField
                name="email"
                label="Email"
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSignUpOrSignIn}
                fullWidth
              >
                Sign In
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        {errorMessage ? (
          <Alert severity="error" onClose={handleCloseSnackbar}>
            {errorMessage}
          </Alert>
        ) : (
          <Alert severity="success" onClose={handleCloseSnackbar}>
            {successMessage}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}