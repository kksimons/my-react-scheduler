import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar variant="h6" sx={{display: "flex", justifyContent: "space-between"}}>
        <Typography>PowerShift</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/SignUp")}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};


export default Navigation;