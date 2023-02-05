export const ADD_CLAUSE = "ADD_CLAUSE";
export const REMOVE_CLAUSE = "REMOVE_CLAUSE";

export default function ClausesReducer(state: any, action: any) {
    switch (action.type) {
        case ADD_CLAUSE:
            return [...state, action.payload];
        case REMOVE_CLAUSE:
            return state.filter((clause: any) => clause !== action.payload);
        default:
            return state;
    }
};
