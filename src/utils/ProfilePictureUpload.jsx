// import React from "react";
// import { Avatar, LinearProgress, Box } from "@mui/material";


// const ProfilePictureUpload = ({
//   profilePic,
//   previewUrl,
//   handleProfilePicUpload,
//   uploadProgress,
// }) => {

//   const uploadProfilePicToStorage = async (
//     userId => {
//     try {
//       if (profilePic) {
//         // Check if profilePic is set and is a File
//         const storageRef = ref(storage, `profilePics/${userId}`);
//         const uploadTask = uploadBytesResumable(storageRef, profilePic);

//         return new Promise((resolve, reject) => {
//           uploadTask.on(
//             "state_changed",
//             (snapshot) => {
//               const progress =
//                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//               setUploadProgress(progress);
//               console.log(`Upload is ${progress}% done`);
//             },
//             (error) => {
//               console.error("Error during upload:", error);
//               reject(error);
//             },
//             async () => {
//               const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
//               console.log("Profile picture uploaded, URL:", downloadUrl);
//               resolve(downloadUrl); // Return the URL for the uploaded profile picture
//             }
//           );
//         });
//       } else {
//         console.warn("No profile picture to upload");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error uploading profile picture:", error);
//       return null;
//     }
//   };


//   return (
//     <Box>
//       <Avatar
//         alt="Click to Upload"
//         src={previewUrl || "./placeholder-avatar.jpg"}
//         sx={{ width: 100, height: 100, cursor: "pointer" }}
//         onClick={() => document.getElementById("profilePicInput")?.click()}
//       />
//       <input
//         id="profilePicInput"
//         type="file"
//         accept="image/*"
//         style={{ display: "none" }}
//         onChange={handleProfilePicUpload}
//       />
//       {uploadProgress > 0 && uploadProgress < 100 && (
//         <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />
//       )}
//     </Box>
//   );
// };

// export default ProfilePictureUpload;

