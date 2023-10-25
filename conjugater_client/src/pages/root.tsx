import { Show, createSignal } from 'solid-js';
import { Login } from '../components/login-form';
import '../styles/home.css';
import SignUp from '../components/sign-up-form';
import { SocketContextProvider } from '../contexts/socket-context-provider';
import { useAuth, useStore } from '../contexts/auth-context-provider';
import { SignOut } from '../components/sign-out';
import { A, Outlet } from '@solidjs/router';

export const Root = () => {
  const [currentUserInfo, _setCurrUserInfo] = useStore();
  const [token, _setToken] = useAuth();

  return (
    <SocketContextProvider>
      <div style={{ "height": "30px", "display": "flex", "justify-content": "space-between", "align-items": "center" }}>
        <h1 style={{ "margin-left": "8px" }}>conjugater</h1>
        <div style={{ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" }}>
          <A href='/home' style={{ "color": "peru" }}>home</A>
          <Show when={token()}>
            <A href='/my-data' style={{ "color": "saddlebrown" }}>my data</A>
          </Show>
          <Show when={!token()}>
            <p style={{ "margin-right": "8px", "font-size": "18px" }}><a href='/login'><b>login</b></a></p>
          </Show>
          <A href='search'>search</A>
        </div>
      </div>
      <Outlet />
    </SocketContextProvider>
  )
}
