import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { Product, MerchantStore } from "@/lib/api";

// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Merchant cart group type
export interface MerchantCartGroup {
  merchantStore: MerchantStore;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
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
  | { type: "CLEAR_MERCHANT_CART"; merchantStoreId: string }
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
    case "CLEAR_MERCHANT_CART":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.product.merchantStoreId !== action.merchantStoreId
        ),
      };
    case "SET_CART":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

// Helper functions
export const calculateMerchantTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export const groupCartByMerchant = (items: CartItem[]): MerchantCartGroup[] => {
  const groups = new Map<string, MerchantCartGroup>();

  items.forEach((item) => {
    const merchantStoreId = item.product.merchantStoreId;

    if (!merchantStoreId || !item.product.merchantStore) return;

    const merchantStore = item.product.merchantStore;

    if (!groups.has(merchantStoreId)) {
      groups.set(merchantStoreId, {
        merchantStore,
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      });
    }

    groups.get(merchantStoreId)!.items.push(item);
  });

  return Array.from(groups.values()).map((group) => ({
    ...group,
    ...calculateMerchantTotals(group.items),
  }));
};

// Context
const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
      merchantGroups: MerchantCartGroup[];
      totalItems: number;
      totalMerchants: number;
    }
  | undefined
>(undefined);

// Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const merchantGroups = groupCartByMerchant(state.items);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalMerchants = merchantGroups.length;

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        merchantGroups,
        totalItems,
        totalMerchants,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
