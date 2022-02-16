import React from "react";

import {
  Drawer,
  styled,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import FileCopyIcon from "@mui/icons-material/FileCopy";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 240;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    overflowX: "hidden",
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7),
    },
  },
}));

const MDrawer = () => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <StyledDrawer variant="permanent">
      <List>
        <ListItem button onClick={toggleDrawer}>
          <ListItemIcon>
            <FileCopyIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button onClick={toggleDrawer}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default MDrawer;
