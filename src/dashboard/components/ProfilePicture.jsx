import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { auth } from "@userAuth/firebase"; 
import { Button, Box, Typography, CircularProgress } from "@mui/material";
// import db from "@userAuth/firebase"; 
// import storage from "@userAuth/firebase";
// import user from "@userAuth/firebase";
import { toast } from "react-toastify";


const ProfilePicture = ({ role }) => {
    const [selectedFile, setSelectedFile] = useState(null); 
    const [uploading, setUploading] = useState(false);
    const [photoURL, setPhotoURL] = useState("");  //state to store the photo URL 

    const db = getFirestore();  
    const storage = getStorage();
    const user = auth.currentUser; 

    if (!user) {
        return toast.error("User not found. Please sign in or create a new account.");
    }

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]); //set the selected file to the first file in the array
        }
    };

    //handle upload file 
    const handleUpload = async () => {
        if(!selectedFile) {
            return toast.error("Please select a file to upload.");
        }

        //set uploading to true
        setUploading(true); //allow the user to see that the file is being uploaded 
        try {
            const storageRef = ref(storage, '${role}/${user.uid}/profile.jpg'); //create a reference to the storage location
            await uploadBytes(storageRef, selectedFile); //upload the file to the storage location 
            const url = await getDownloadURL(storageRef); //get the download URL of the file 
            setPhotoURL(url); //set the photo URL to the URL of the uploaded file 

            const userDoc = role === "employees" ? "employees" : "employers"; 
            
            await updateDoc(doc( //update doc, since it's already defined in the EmployeeRegristration.jsx file

                db, userDoc, user.uid), 
            { photoURL: url }
            ); //update the user document with the photo URL 

            alert("Profile picture uploaded successfully.");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file. Please try again.");
        } finally {
            setUploading(false); //set uploading to false because the file has been uploaded
            setSelectedFile(null); //set selected file to null because the file has been uploaded
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Typography variant="h6">Upload Profile Picture</Typography>
        {photoURL && (
          <Box mt={2}>
            <img
              src={photoURL}
              alt="Profile"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
          </Box>
        )}
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="profile-pic-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="profile-pic-upload">
          <Button variant="contained" component="span" sx={{ mt: 2 }}>
            Choose File
          </Button>
        </label>
        {selectedFile && (
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body1">{selectedFile.name}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              sx={{ ml: 2 }}
              disabled={uploading}
            >
              {uploading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </Box>
        )}
      </Box>

    );
};
export default ProfilePicture;