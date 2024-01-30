import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Avatar, Button, Stack, InputAdornment, TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom"
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons, debounceSearch, debounceTimeout }) => {
  const history = useHistory();

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("balance");
      history.push("/");
      window.location.reload();
    } catch (error) {
      console.log('-----> Error removing login details to local storage');

    }
  }

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
          </Button>
      </Box>
    );
  }
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children ?
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ width: "50vw" }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
        : null}
      {localStorage.getItem("username") ?
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src="avatar.png" alt={localStorage.getItem("username") || "profile"} />
          <p className="username-text">{localStorage.getItem("username")}</p>
          <Button
            variant="contained"
            onClick={logout}>
            LOGOUT</Button>
        </Stack> :
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="text"
            onClick={() => history.push("/login")}>
            LOGIN</Button>
          <Button
            variant="contained"
            onClick={() => history.push("/register")}>
            REGISTER</Button>
        </Stack>}
    </Box>
  )
};

export default Header;
