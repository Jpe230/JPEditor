import React from "react";

import { Box, styled, Typography } from "@mui/material";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: 1,
  display: "block",
  padding: theme.spacing(8),
  paddingTop: theme.spacing(15),
}));

const WelcomePage = () => {
  return (
    <StyledBox>
      <Typography variant="h2" gutterBottom component="div" color={"#FFFFFFCC"}>
        Jpeditor
      </Typography>
      <Typography variant="h6" gutterBottom component="div" color={"#FFFFFF99"}>
        The best I could do in less than 24 hours
      </Typography>
    </StyledBox>
  );
};

export default WelcomePage;
