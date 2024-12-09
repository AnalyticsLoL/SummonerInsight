import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summonerInfo: null,
  matchHistory: null,
};

const summonerSlice = createSlice({
  name: 'summoner',
  initialState,
  reducers: {
    setSummonerData(state, action) {
      state.summonerInfo = action.payload.summonerInfo;
      state.matchHistory = action.payload.matchHistory;
    },
    clearSummonerData(state) {
      state.summonerInfo = null;
      state.matchHistory = null;
    },
  },
});

export const { setSummonerData, clearSummonerData } = summonerSlice.actions;

export default summonerSlice.reducer;