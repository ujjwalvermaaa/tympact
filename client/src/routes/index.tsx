import React from "react";
import { createBrowserRouter, RouterProvider, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Verify from "../pages/Verify";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Marketplace from "../pages/Marketplace";
import PostTask from "../pages/PostTask";
import MyTrades from "../pages/MyTrades";
import LifeLedger from "../pages/LifeLedger";
import Missions from "../pages/Missions";
import Leaderboard from "../pages/Leaderboard";
import Rewards from "../pages/Rewards";
import NFTs from "../pages/NFTs";
import Community from "../pages/Community";
import FocusJournal from "../pages/FocusJournal";
import Trust from "../pages/Trust";
import Settings from "../pages/Settings";
import Admin from "../pages/Admin";
import ApiDocs from "../pages/ApiDocs";
import NotFound from "../pages/NotFound";
import About from "../pages/About";
import TimeWallet from "../pages/TimeWallet";
import Notifications from "../pages/Notifications";
import Browse from "../pages/Browse";
import SubmitTask from "../pages/SubmitTask";
import Feedback from "../pages/Feedback";
import VoiceInput from "../pages/VoiceInput";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import { ProtectedRoute } from "../components/ProtectedRoute";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedOutlet: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        <Outlet />
      </div>
    </AnimatePresence>
  );
};

const router = createBrowserRouter([
  {
    element: <AnimatedOutlet />,
    children: [
        { path: "/", element: <PageWrapper><LandingPage /></PageWrapper> },
        { path: "/login", element: <PageWrapper><Login /></PageWrapper> },
        { path: "/register", element: <PageWrapper><Register /></PageWrapper> },
        { path: "/verify", element: <PageWrapper><Verify /></PageWrapper> },
        { path: "/about", element: <PageWrapper><About /></PageWrapper> },
        { path: "/community", element: <PageWrapper><Community /></PageWrapper> },
        { path: "/api-docs", element: <PageWrapper><ApiDocs /></PageWrapper> },
        { path: "/contact", element: <PageWrapper><Contact /></PageWrapper> },
        { path: "/faq", element: <PageWrapper><FAQ /></PageWrapper> },
        { path: "/dashboard", element: <ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute> },
        { path: "/profile", element: <ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute> },
        { path: "/marketplace", element: <ProtectedRoute><PageWrapper><Marketplace /></PageWrapper></ProtectedRoute> },
        { path: "/post-task", element: <ProtectedRoute><PageWrapper><PostTask /></PageWrapper></ProtectedRoute> },
        { path: "/my-trades", element: <ProtectedRoute><PageWrapper><MyTrades /></PageWrapper></ProtectedRoute> },
        { path: "/life-ledger", element: <ProtectedRoute><PageWrapper><LifeLedger /></PageWrapper></ProtectedRoute> },
        { path: "/missions", element: <ProtectedRoute><PageWrapper><Missions /></PageWrapper></ProtectedRoute> },
        { path: "/time-wallet", element: <ProtectedRoute><PageWrapper><TimeWallet /></PageWrapper></ProtectedRoute> },
        { path: "/leaderboard", element: <ProtectedRoute><PageWrapper><Leaderboard /></PageWrapper></ProtectedRoute> },
        { path: "/rewards", element: <ProtectedRoute><PageWrapper><Rewards /></PageWrapper></ProtectedRoute> },
        { path: "/nfts", element: <ProtectedRoute><PageWrapper><NFTs /></PageWrapper></ProtectedRoute> },
        { path: "/focus-journal", element: <ProtectedRoute><PageWrapper><FocusJournal /></PageWrapper></ProtectedRoute> },
        { path: "/trust", element: <ProtectedRoute><PageWrapper><Trust /></PageWrapper></ProtectedRoute> },
        { path: "/settings", element: <ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute> },
        { path: "/admin", element: <ProtectedRoute><PageWrapper><Admin /></PageWrapper></ProtectedRoute> },
        { path: "/notifications", element: <ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute> },
        { path: "/browse", element: <ProtectedRoute><PageWrapper><Browse /></PageWrapper></ProtectedRoute> },
        { path: "/submit-task", element: <ProtectedRoute><PageWrapper><SubmitTask /></PageWrapper></ProtectedRoute> },
        { path: "/feedback", element: <ProtectedRoute><PageWrapper><Feedback /></PageWrapper></ProtectedRoute> },
        { path: "/voice-input", element: <ProtectedRoute><PageWrapper><VoiceInput /></PageWrapper></ProtectedRoute> },
        { path: "*", element: <PageWrapper><NotFound /></PageWrapper> }
    ]
  }
]);

const AppRoutes: React.FC = () => <RouterProvider router={router} />;

export default AppRoutes; 