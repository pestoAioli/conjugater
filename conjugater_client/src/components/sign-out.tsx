import type { Component, Setter } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";

export const SignOut: Component<{ setLoggedIn: Setter<boolean> }> = ({ setLoggedIn }) => {
  const [token, setToken] = useAuth();

  async function signOut() {
    const response = await fetch(import.meta.env.VITE_LOG_OUT_URL, {
      method: "POST",
      body: JSON.stringify({ token: token() }),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token()}`
      }
    })
    const signedOut = await response.json();
    localStorage.clear();
    setToken(null);
    setLoggedIn(false);
  }

  return (
    <button onClick={signOut}>Sign out</button>
  )
}
