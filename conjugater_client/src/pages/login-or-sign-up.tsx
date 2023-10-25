import { Show, createSignal } from 'solid-js';
import { Login } from '../components/login-form';
import '../styles/home.css';
import SignUp from '../components/sign-up-form';
import { SocketContextProvider } from '../contexts/socket-context-provider';
import { useAuth, useStore } from '../contexts/auth-context-provider';
import { SignOut } from '../components/sign-out';

export const LoginOrSignUp = () => {
  const [loginOrRegister, setLoginOrRegister] = createSignal(true);
  const [loggingIn, setLoggingIn] = createSignal(false);
  const [loggedIn, setLoggedIn] = createSignal(false);
  const [error, setError] = createSignal(false);

  const [currentUserInfo, _setCurrUserInfo] = useStore();
  const [token, _setToken] = useAuth();

  return (
    <div class='home-login'>
      <img width={320} src='/westside1.jpg'></img>
      <Show when={!loggingIn() && loginOrRegister() && !loggedIn() && !token()}>
        <Login setLoggingIn={setLoggingIn} setLoggedIn={setLoggedIn} setError={setError} />
        <p style={{ "margin-top": "0" }}>Don't have an account? <button onClick={() => setLoginOrRegister(false)}>Sign up</button></p>
      </Show>
      <Show when={!loggingIn() && !loginOrRegister()}>
        <SignUp timeToLogin={setLoginOrRegister} />
      </Show>
      <Show when={loggingIn()}>
        <Show when={!error()}>
          <h1>One sec while I log you in 🧐</h1>
        </Show>
        <Show when={error()}>
          <p>something went wrong :/ please <button style={{ "text-decoration": "underline" }} onClick={() => {
            setError(false)
            setLoggingIn(false)
          }}><b>refresh</b></button> and try again, and make sure you're logged in</p>
        </Show>
      </Show>
      <Show when={(loggedIn() || token()) && !error()}>
        {currentUserInfo.username} is logged in
        <SignOut setLoggedIn={setLoggedIn} />
      </Show>
    </div >
  )
}
