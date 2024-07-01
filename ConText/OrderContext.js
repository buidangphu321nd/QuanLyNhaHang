import React, { createContext, useReducer, useContext } from 'react';
import generateID from "../Component/generateID";

// Define the initial state
const initialState = {};

// Create the context
const OrderContext = createContext();

// Define action types
const ADD_ORDER_ITEM = 'ADD_ORDER_ITEM';
const REMOVE_ORDER_ITEM = 'REMOVE_ORDER_ITEM';
const CLEAR_ORDER = 'CLEAR_ORDER';

// Define a reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case ADD_ORDER_ITEM:
      const { tableId, dish, quantity, note } = action.payload;
      const existingOrder = state[tableId] || {};

      if (Object.keys(existingOrder).length === 0) {
        // Nếu bàn chưa có món nào, thêm món mới vào bình thường
        return {
          ...state,
          [tableId]: {
            [dish.dishId]: {
              ...dish,
              quantity,
              note,
            },
          },
        };
      } else {
        // Nếu đã có món, tạo key mới để thêm như một bản ghi mới
        const newDishKey = `${dish.dishId}-${generateID()}`;
        return {
          ...state,
          [tableId]: {
            ...existingOrder,
            [newDishKey]: {
              ...dish,
              quantity,
              note,
            },
          },
        };
      }

    case REMOVE_ORDER_ITEM:
      const { tableId: removeTableId, dishId } = action.payload;
      const newTableOrder = { ...state[removeTableId] };
      delete newTableOrder[dishId];
      return {
        ...state,
        [removeTableId]: newTableOrder,
      };

    case CLEAR_ORDER:
      const { tableId: clearTableId } = action.payload;
      const newState = { ...state };
      delete newState[clearTableId];
      return newState;

    default:
      return state;
  }
};

// Create a provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ orders: state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};

// Create a custom hook to use the order context
export const useOrder = () => {
  return useContext(OrderContext);
};
