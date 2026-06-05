import { createSlice } from "@reduxjs/toolkit";

const reelSlice = createSlice({
  name: "reel",
  initialState: {
    reelData: []
  },
  reducers: {
    setReelData: (state, action) => {
      state.reelData = action.payload
    },
    updateReel: (state, action) => {
  const { reelId, likes, comments } = action.payload;

  state.reelData = state.reelData.map((reel) =>
    reel._id === reelId
      ? {
          ...reel,
          ...(likes !== undefined && { likes }),
          ...(comments !== undefined && { comments }),
        }
      : reel
  );
},
  }
})

export const { setReelData,updateReel } = reelSlice.actions
export default reelSlice.reducer