"use client";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full m-auto">
      <Paper
        elevation={6}
        sx={{ backgroundColor: "#252330", color: "white", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        className="text-center lg:w-[35%] min-h-56 p-4 relative"
      >
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold">Welcome to OtakuHub</h3>
          <p className="text-lg mb-10 mt-2">
            Your go-to site for anime recommendations!
          </p>
          <div className="flex justify-around items-center absolute lg:w-[70%] right-auto -bottom-5 space-x-4">
            <Button
              variant="contained"
              href="/signup"
              className="text-[#F5F9F8] hover:bg-[#252330] px-7 py-2 shadow-xl w-[150px] min-h-16"
              sx={{ backgroundColor: "#595168", borderRadius: "50px" }}
              endIcon={<NavigateNextIcon />}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              href="/login"
              className="text-[#F5F9F8] hover:bg-[#252330] px-4 py-2 shadow-xl w-[150px] min-h-16"
              sx={{ backgroundColor: "#595168", borderRadius: "50px" }}
              endIcon={<NavigateNextIcon />}
            >
              Login
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
