import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Configure QueryClient to avoid unnecessary refetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not refetch when window regains focus
      refetchOnWindowFocus: false,
      // Do not refetch on network reconnect
      refetchOnReconnect: false,
      // Do not retry failed requests automatically
      retry: 1,
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
