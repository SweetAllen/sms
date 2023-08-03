import { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from '../../assets/logo.png'
import { useAuth } from "../../context/AuthContext";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  // const handleSubmit = async (e) => {
  //   const data = new FormData(event.currentTarget);
  useEffect(() => {
    // window.onbeforeunload = () => {
    //   sessionStorage.removeItem('isAuth');
    // }
    // Checking if user is not loggedIn
    if (!isLoggedIn) {
      navigate("/");
    } else {
      navigate("/dashboard");
      // navigate({
      
      //   pathname: "/viewst",
    
      //   search: createSearchParams ({
        
      //   id: "naveenkumar"
        
      //   }). toString()
        
      //   });
      sessionStorage.setItem('isAuth', 'true');

    }
  }, [navigate, isLoggedIn]);

  //   console.log(data.get("email"),)
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     await logIn(data.get("email"), data.get("password"));

  //     navigate("/Dashboard");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };
  const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
        setError("");
    try {
      await logIn(data.get("email"), data.get("password"))

      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        
           console.log(user.accessToken)
           if(user.accessToken!= null){
            setisLoggedIn(true)
            setToken(user.accessToken)
           }else{
            setisLoggedIn(false)

           }
        // navigate("/data");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
      });

     
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{  
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <div className="d-fle w-100px">
        <img src={logo} alt='' className="logo" >
              </img> 
        </div> */}
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{backgroundColor:'#EE1C24'}}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              {/* <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
