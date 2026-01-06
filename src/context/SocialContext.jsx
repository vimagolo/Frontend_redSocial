import { createContext, useReducer } from "react";

export const SocialContext = createContext();

const initialState = {
    followers: 0,
    following: 0,
    publications: 0
};

const socialReducer = (state, action) => {
    switch (action.type) {
        case "SET_COUNTS":
            return {
                ...state,
                ...action.payload
            };

        case "INCREMENT_PUBLICATIONS":
            return {
                ...state,
                publications: state.publications + 1
            };

        case "DECREMENT_PUBLICATIONS":
            return {
                ...state,
                publications: state.publications - 1
            };

        case "FOLLOW":
            return {
                ...state,
                following: state.following + 1
            };

        case "UNFOLLOW":
            return {
                ...state,
                following: state.following - 1
            };

        default:
            return state;
    }
};

export const SocialProvider = ({ children }) => {
    const [state, dispatch] = useReducer(socialReducer, initialState);

    return (
        <SocialContext.Provider value={{ state, dispatch }}>
            {children}
        </SocialContext.Provider>
    );
};