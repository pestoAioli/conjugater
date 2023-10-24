import type { Component, Setter } from "solid-js";
import { useAuth, useStore } from "../contexts/auth-context-provider";
import { useNavigate } from "@solidjs/router";

export const Login: Component<{ setLoggingIn: Setter<boolean>, setLoggedIn: Setter<boolean>, setError: Setter<boolean> }> =
  ({ setLoggingIn, setLoggedIn, setError }) => {
    const [tokenActual, setToken] = useAuth();
    const [currentUserInfo, setCurrentUserInfo] = useStore();
    const navigate = useNavigate();
    async function login(e: SubmitEvent) {
      e.preventDefault();
      try {
        const target = e.target as HTMLInputElementLogin;
        const email = target.email.value;
        const password = target.password.value;
        setLoggingIn(true);
        const response = await fetch(import.meta.env.VITE_LOG_IN_URL, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json",
          }
        })
        const { token, data } = await response.json();
        localStorage.setItem("toke", token)
        localStorage.setItem("id", data.user.id)
        localStorage.setItem("username", data.user.username)
        localStorage.setItem("fullname", data.user.full_name)
        setCurrentUserInfo("username", data.user.username)
        setCurrentUserInfo("fullname", data.user.full_name)
        setCurrentUserInfo("user_id", data.user.user_id)
        setLoggingIn(false);
        setLoggedIn(true);
        setToken(token)
        navigate("/newdream")
      } catch (e) {
        setError(true)
      }
    }

    return (
      <div>
        <form class='home-login-form' onSubmit={login}>
          <input type="text" id="email" name="email" placeholder="email" required />
          <input type="password" id="password" name="password" placeholder="password" required
            style={{ "margin-top": "8px" }} />
          <button class="submit-button" type="submit" ><strong>Login</strong></button>
        </form>
      </div>
    )
  }
