import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import storySlice from "./storySlice";
import reelSlice from "./reelSlice";
import messageSlice from "./messageSlice"; 
import socketSlice from './socketSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    reel: reelSlice,
    story: storySlice,
    message: messageSlice, 
    socket:socketSlice,
  },
});