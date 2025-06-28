/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { store } from "@/app/store/store";
import { initializeAuth } from "@/app/store/slices/authSlice";
import { initializeCart } from "@/app/store/slices/cartSlice";

function HydrateAuth({ children }: { children: any }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    console.log("Providers: Starting initialization");

    // Initialize auth (checks for token, doesn't load user data from storage)
    store.dispatch(initializeAuth());

    // Initialize cart
    store.dispatch(initializeCart());

    setIsHydrated(true);
    console.log("Providers: Initialization complete");
  }, []);

  // Prevent hydration mismatch by suppressing warnings during initial render
  return (
    <div suppressHydrationWarning>
      {isHydrated ? children : <div>Loading...</div>}
    </div>
  );
}

// Error boundary component
class AuthErrorBoundary extends React.Component<
  { children: any },
  { hasError: boolean }
> {
  constructor(props: { children: any }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.log("Auth Error Boundary caught error:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Auth Error Boundary error details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          Something went wrong with authentication. Please refresh the page.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Providers({ children }: { children: any }) {
  return (
    <Provider store={store}>
      <AuthErrorBoundary>
        <HydrateAuth>{children}</HydrateAuth>
      </AuthErrorBoundary>
    </Provider>
  );
}
