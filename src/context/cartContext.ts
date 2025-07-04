import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { Product } from "@/lib/api";

// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Cart state type
interface CartState {
  items: CartItem[];
}

// Actions
type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; items: CartItem[] };

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { product: action.product, quantity: action.quantity || 1 },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_CART":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

// Context
const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
    }
  | undefined
>(undefined);

// Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return React.createElement(
    CartContext.Provider,
    { value: { state, dispatch } },
    children
  );
};

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
