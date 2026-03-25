import {
  AuthClient,
  type AuthClientCreateOptions,
  type AuthClientLoginOptions,
} from "@dfinity/auth-client";
import type { Identity } from "@icp-sdk/core/agent";
import { DelegationIdentity, isDelegationValid } from "@icp-sdk/core/identity";
import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadConfig } from "../config";

export type Status =
  | "initializing"
  | "idle"
  | "logging-in"
  | "success"
  | "loginError";

export type InternetIdentityContext = {
  /** The identity is available after successfully loading the identity from local storage
   * or completing the login process. */
  identity?: Identity;

  /** Connect to Internet Identity to login the user. */
  login: () => void;

  /** Clears the identity from the state and local storage. Effectively "logs the user out". */
  clear: () => void;

  /** The loginStatus of the login process. Note: The login loginStatus is not affected when a stored
   * identity is loaded on mount. */
  loginStatus: Status;

  /** `loginStatus === "initializing"` */
  isInitializing: boolean;

  /** `loginStatus === "idle"` */
  isLoginIdle: boolean;

  /** `loginStatus === "logging-in"` */
  isLoggingIn: boolean;

  /** `loginStatus === "success"` */
  isLoginSuccess: boolean;

  /** `loginStatus === "loginError"` */
  isLoginError: boolean;

  loginError?: Error;
};

const ONE_HOUR_IN_NANOSECONDS = BigInt(3_600_000_000_000);
const DEFAULT_IDENTITY_PROVIDER = process.env.II_URL;

type ProviderValue = InternetIdentityContext;
const InternetIdentityReactContext = createContext<ProviderValue | undefined>(
  undefined,
);

/**
 * Create the auth client with default options or options provided by the user.
 */
async function createAuthClient(
  createOptions?: AuthClientCreateOptions,
): Promise<AuthClient> {
  const config = await loadConfig();
  const options: AuthClientCreateOptions = {
    idleOptions: {
      // Default behaviour of this hook is not to logout and reload window on identity expiration
      disableDefaultIdleCallback: true,
      disableIdle: true,
      ...createOptions?.idleOptions,
    },
    loginOptions: {
      derivationOrigin: config.ii_derivation_origin,
    },
    ...createOptions,
  };
  const authClient = await AuthClient.create(options);
  return authClient;
}

/**
 * Helper function to set loginError state.
 */
function assertProviderPresent(
  context: ProviderValue | undefined,
): asserts context is ProviderValue {
  if (!context) {
    throw new Error(
      "InternetIdentityProvider is not present. Wrap your component tree with it.",
    );
  }
}

/**
 * Hook to access the internet identity as well as loginStatus along with
 * login and clear functions.
 */
export const useInternetIdentity = (): InternetIdentityContext => {
  const context = useContext(InternetIdentityReactContext);
  assertProviderPresent(context);
  return context;
};

export function InternetIdentityProvider({
  children,
  createOptions,
}: PropsWithChildren<{
  children: ReactNode;
  createOptions?: AuthClientCreateOptions;
}>) {
  // Store authClient in a ref so it NEVER causes re-renders or effect re-runs
  const authClientRef = useRef<AuthClient | undefined>(undefined);
  const createOptionsRef = useRef(createOptions);
  // Guard flag: ensure initialization runs exactly once
  const initDoneRef = useRef(false);

  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [loginStatus, setStatus] = useState<Status>("initializing");
  const [loginError, setError] = useState<Error | undefined>(undefined);

  const setErrorMessage = useCallback((message: string) => {
    setStatus("loginError");
    setError(new Error(message));
  }, []);

  // handleLoginSuccess uses ref, not state — no stale closure issues
  const handleLoginSuccess = useCallback(() => {
    const latestIdentity = authClientRef.current?.getIdentity();
    if (!latestIdentity) {
      setErrorMessage("Identity not found after successful login");
      return;
    }
    setIdentity(latestIdentity);
    setStatus("success");
  }, [setErrorMessage]);

  const handleLoginError = useCallback(
    (maybeError?: string) => {
      setErrorMessage(maybeError ?? "Login failed");
    },
    [setErrorMessage],
  );

  const login = useCallback(() => {
    const client = authClientRef.current;
    if (!client) {
      setErrorMessage(
        "AuthClient is not initialized yet, make sure to call `login` on user interaction e.g. click.",
      );
      return;
    }

    const currentIdentity = client.getIdentity();
    if (
      !currentIdentity.getPrincipal().isAnonymous() &&
      currentIdentity instanceof DelegationIdentity &&
      isDelegationValid(currentIdentity.getDelegation())
    ) {
      // Already authenticated — just update identity state
      setIdentity(currentIdentity);
      setStatus("success");
      return;
    }

    const options: AuthClientLoginOptions = {
      identityProvider: DEFAULT_IDENTITY_PROVIDER,
      onSuccess: handleLoginSuccess,
      onError: handleLoginError,
      maxTimeToLive: ONE_HOUR_IN_NANOSECONDS * BigInt(24 * 30), // 30 days
    };

    setStatus("logging-in");
    void client.login(options);
  }, [handleLoginError, handleLoginSuccess, setErrorMessage]);

  const clear = useCallback(() => {
    const client = authClientRef.current;
    if (!client) {
      setErrorMessage("Auth client not initialized");
      return;
    }

    void client
      .logout()
      .then(() => {
        setIdentity(undefined);
        setStatus("idle");
        setError(undefined);
        // Reset so the next effect run can re-initialize
        authClientRef.current = undefined;
        initDoneRef.current = false;
      })
      .catch((unknownError: unknown) => {
        setStatus("loginError");
        setError(
          unknownError instanceof Error
            ? unknownError
            : new Error("Logout failed"),
        );
      });
  }, [setErrorMessage]);

  // CRITICAL: empty dependency array — runs ONCE on mount, NEVER again
  // authClientRef is in useRef so it never triggers this effect
  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    void (async () => {
      try {
        setStatus("initializing");
        const client = await createAuthClient(createOptionsRef.current);
        authClientRef.current = client;
        const isAuthenticated = await client.isAuthenticated();
        if (isAuthenticated) {
          const loadedIdentity = client.getIdentity();
          setIdentity(loadedIdentity);
        }
      } catch (unknownError) {
        setStatus("loginError");
        setError(
          unknownError instanceof Error
            ? unknownError
            : new Error("Initialization failed"),
        );
      } finally {
        setStatus("idle");
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo<ProviderValue>(
    () => ({
      identity,
      login,
      clear,
      loginStatus,
      isInitializing: loginStatus === "initializing",
      isLoginIdle: loginStatus === "idle",
      isLoggingIn: loginStatus === "logging-in",
      isLoginSuccess: loginStatus === "success",
      isLoginError: loginStatus === "loginError",
      loginError,
    }),
    [identity, login, clear, loginStatus, loginError],
  );

  return createElement(InternetIdentityReactContext.Provider, {
    value,
    children,
  });
}
