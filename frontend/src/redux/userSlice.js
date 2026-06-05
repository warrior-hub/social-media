import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUsers: null,
    profileData: null,
    following: [],
    searchData: null,
    notificationData: null
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    setNotificationData: (state, action) => {
      state.notificationData = action.payload;
    },

    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },

    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },

    setFollowing: (state, action) => {
      state.following = action.payload || [];
    },
    markAllAsRead: (state) => {
      if (state.notificationData) {
        state.notificationData = state.notificationData.map((noti) => ({
          ...noti,
          isRead: true,
        }));
      }
    },
    

    addNotification: (state, action) => {
      if (!state.notificationData) {
        state.notificationData = [];
      }
      state.notificationData.unshift(action.payload);
    },

    toggleFollow: (state, action) => {
      const targetUserId = action.payload?.toString();

      if (!state.following) state.following = [];

      const exists = state.following.some(
        (id) => id.toString() === targetUserId
      );

      if (exists) {
        state.following = state.following.filter(
          (id) => id.toString() !== targetUserId
        );
      } else {
        state.following.push(targetUserId);
      }
    },

    updateUserFollowing: (state, action) => {
      const targetUserId = action.payload;

      if (!state.userData.following) return;

      const exists = state.userData.following.some(
        (u) => u._id === targetUserId
      );

      if (exists) {
        state.userData.following = state.userData.following.filter(
          (u) => u._id !== targetUserId
        );
      } else {
        state.userData.following.push({ _id: targetUserId });
      }
    },
  },
});

export const {
  setUserData,
  setSuggestedUsers,
  setProfileData,
  toggleFollow,
  setSearchData,
  setFollowing,
  setNotificationData,
  markAllAsRead,
  addNotification,
  updateUserFollowing
} = userSlice.actions;

export default userSlice.reducer;