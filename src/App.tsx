import "./App.css";

import { SignedIn, SignedOut, SignIn, SignUp, useClerk, useUser, ClerkProvider } from "@clerk/chrome-extension";
import { useNavigate, Routes, Route, MemoryRouter } from "react-router-dom";

function HelloUser() {
  const { isSignedIn, user } = useUser();
  const clerk = useClerk();

  console.debug(clerk);
  console.debug("clerk.session?.id");
  console.debug(clerk.session?.id);
  console.debug("clerk.session?.lastActiveToken");
  console.debug(clerk.session?.lastActiveToken);
  console.debug("clerk.client.id");
  console.debug(clerk.client.id);

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <p>Hi, {user.primaryEmailAddress?.emailAddress}!</p>
      <p>
        <button onClick={() => clerk.signOut()}>Sign out</button>
      </p>
    </>
  );
}

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || "";

// console.debug(publishableKey)

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={publishableKey} routerPush={(x) => navigate(x)} routerReplace={(to) => navigate(to, { replace: true })} syncSessionWithTab>
      <div className="App">
        <header className="App-header">
          <p>Welcome to Clerk Chrome Extension Starter!</p>
          <a className="App-link" href="https://clerk.dev/docs" target="_blank" rel="noopener noreferrer">
            Learn more about Clerk
          </a>
        </header>
        <main className="App-main">
          {/* <h1>
            {`publishablekey: ${publishableKey}`}
          </h1> */}
          <Routes>
            <Route path="/sign-up/*" element={<SignUp signInUrl="/" />} />
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <HelloUser />
                  </SignedIn>
                  <SignedOut>
                    <SignIn signUpUrl="/sign-up" />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </ClerkProvider>
  );
}

function App() {
  return (
    <MemoryRouter>
      <ClerkProviderWithRoutes />
    </MemoryRouter>
  );
}

export default App;
