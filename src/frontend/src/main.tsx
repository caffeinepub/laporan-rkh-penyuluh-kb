import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "./index.css";

// Single QueryClient instance -- never recreated
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do NOT refetch on window focus or reconnect -- reduces unnecessary backend load
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // Cache data for 10 minutes
      staleTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <App />
        </InternetIdentityProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
