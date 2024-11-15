
import React from "react";
import { useState } from "react";
// import Logo from "./assets/logo.png";
// import { HiOutlineBars3 } from 'react-icons/hi';
import {
    Box, 
    Drawer,
    List,
    ListItem,
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Link,
} from "@mui/material"; 

import HomeIcon from '@mui/icons-material/Home';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MenuIcon from '@mui/icons-material/Menu';
import EmailIcon from '@mui/icons-material/Email';
import SellIcon from '@mui/icons-material/Sell'; 
import logo from '../assets/logo-transparent.png';

//This is the component for the Nav Bar on the top ONLY 
const Navbar = () => {

    const [openMenu, setOpenMenu] = useState(false);

    const menuOptions = [
        {
            text: "Home",
            icon: <HomeIcon sx={{color:"#2613f3"}}/>, 
        }, 
        {
            text: "Our Customer",
            icon: <SentimentSatisfiedAltIcon sx={{color:"#f7a441"}} />, 
        },
        {
            text: "Contact Us",
            icon: <EmailIcon sx={{color:"#8090ff"}}/>, 
        },
        {
            text: "Pricing",
            icon: <SellIcon sx={{color:"#ee6f59"}}/>, 
        },
    ];

    return (
        <nav>
            <div className="nav-logo-container">
                {/* link to homepage when clicked */}
                <img src={logo} alt="Powershift's logo" 
                style={{ width: '200px', height: 'auto' }}
                />

            </div>

            <div className="navbar-links-container">
                <a href="/">Home</a>
                <a href="">Our Customers</a>
                <a href="">Contact Us</a>
                <a href="/PricingPage">Pricing</a>
                {/* <a><Link to='/Home' >Home</Link></a>
                <a><Link to='#' >Our Customer</Link></a>
                <a><Link to='/#' >Contact Us</Link></a>
                <a><Link to=' /PricingPage' >Pricing</Link></a> */}
            </div>

            {/* outline bar */}
            <div className="navbar-menu-container">
                <MenuIcon onClick={() => setOpenMenu(true)} />
            </div>

            <Drawer open={openMenu} onClose={() => setOpenMenu(false)}
                anchor="right"
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => setOpenMenu(false)} // close menu when clicked outside
                    onKeyDown={() => setOpenMenu(false)} // close menu when esc key is pressed 
                >
                    <List>
                        {menuOptions.map((item) => (

                            // disable padding to remove the space between the list items
                            <ListItem key={item.text} disablePadding> 
                                <ListItemButton>
                                    
                                    {/* display icon, text of list */}
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />

                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </nav>
    );

};
export default Navbar;