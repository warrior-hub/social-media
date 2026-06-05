import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],      
  selectedUser:null,
   prevChatUsers:null
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

   addMessage: (state, action) => {
  if (!Array.isArray(state.messages)) {
    state.messages = []; 
  }
  state.messages.push(action.payload);
},

  setPrevChatUsers:(state,action)=>{
      state.prevChatUsers=action.payload
    },

    setSelectedUser:(state,action)=>{
      state.selectedUser=action.payload
    }
  },
});

export const {
  setMessages,
  addMessage,
 setPrevChatUsers,
  setSelectedUser
} = messageSlice.actions;

export default messageSlice.reducer;