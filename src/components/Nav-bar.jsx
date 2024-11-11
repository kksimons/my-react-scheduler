import { AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <AppBar>
      <Toolbar>
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