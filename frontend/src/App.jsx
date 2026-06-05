import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import ProtectedRoute from "./pages/ProtectedRoute";
import useGetSuggestedUsers from "./hooks/getSuggestedUsers";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload"
import getAllPost from "./hooks/getAllPost";
import useGetCurrentUser from "./hooks/useLoadUser";
import Reels from "./pages/Reels";
import useGetAllReels from "./hooks/getAllReels";
import useGetAllStories from "./hooks/useGetAllStories";
import StoryPage from "./pages/StoryPage";
import MessagePage from "./pages/MessagePage";
import ChatScreen from "./components/ChatScreen";
import { useDispatch, useSelector } from "react-redux";
import {io} from "socket.io-client"
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import usePrevUserChat from "./hooks/getPrevUsersChat";
import Search from "./pages/Search";
import useGetAllNotifications from "./hooks/getAllNotifications";
import Notifications from "./pages/Notifications";
import { addNotification } from "./redux/userSlice";
import SERVER_URL from "./config";
const App = () => {
  useGetSuggestedUsers();
  useGetCurrentUser();
  useGetAllNotifications();
  getAllPost();
  useGetAllReels();
  useGetAllStories()
  usePrevUserChat();
  const {userData} =useSelector(state=>state.user)
  const {socket} =useSelector(state=>state.socket)
  const dispatch =useDispatch();

useEffect(() => {
  if (userData) {
    const socketIo = io(SERVER_URL, {
      query: {
        userId: userData._id,
      },
    });
     dispatch(setSocket(socketIo));
    socketIo.on("getOnlineUsers", (users) => {
       console.log("users aa gaye:", users);
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socketIo.close();
      dispatch(setSocket(null)); 
    };
  } else {
    if (socket) {
      socket.close();
    }
    dispatch(setSocket(null));
  }
}, [userData]);

 useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      dispatch(addNotification(data));
    };
     socket.off("newNotification");
    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [socket, dispatch]);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

      

        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
          <Route path="/upload" element={<Upload/>} />


        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editprofile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

         <Route
          path="/reels"
          element={
            <ProtectedRoute>
             <Reels/>
            </ProtectedRoute>
          }
        />

         <Route
          path="/story/:userName"
          element={
            <ProtectedRoute>
             <StoryPage/>
            </ProtectedRoute>
          }
        />

         <Route
          path="/message"
          element={
            <ProtectedRoute>
             <MessagePage/>
            </ProtectedRoute>
          }
        />

          <Route
          path="/chatscreen"
          element={
            <ProtectedRoute>
             <ChatScreen/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
             <Search/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/notifications"
          element={
            <ProtectedRoute>
             <Notifications/>
            </ProtectedRoute>
          }
        />

        <Route path="/profile/:userName" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
