import React from "react";
import { Avatar, LinearProgress, Box } from "@mui/material";


const ProfilePictureUpload = ({
  profilePic,
  previewUrl,
  handleProfilePicUpload,
  uploadProgress,
}) => {
  return (
    <Box>
      <Avatar
        alt="Click to Upload"
        src={previewUrl || "./placeholder-avatar.jpg"}
        sx={{ width: 100, height: 100, cursor: "pointer" }}
        onClick={() => document.getElementById("profilePicInput")?.click()}
      />
      <input
        id="profilePicInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleProfilePicUpload}
      />
      {uploadProgress > 0 && uploadProgress < 100 && (
        <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />
      )}
    </Box>
  );
};

export default ProfilePictureUpload;
