import { createSelector } from "reselect";

const initialState = {
  user: null,
};

// Reducer

export default function reducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_USER:
      return { ...state, user: payload };
    default:
      return state;
  }
}

// Actions

const actionPrefix = "codetalk/user/";

const SET_USER = `${actionPrefix}SET_USER}`;

export const setUser = user => ({
  type: SET_USER,
  payload: user,
});

// Selectors

const selectUser = state => state.user.user;

export const getUser = createSelector(
  selectUser,
  user => user
);
