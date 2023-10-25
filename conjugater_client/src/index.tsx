import { render } from 'solid-js/web';

import { Provider } from './contexts/auth-context-provider';
import { Route, Router, Routes } from '@solidjs/router';
import { Root } from './pages/root';
import { LoginOrSignUp } from './pages/login-or-sign-up';
import { Home } from './pages/home';
import { UserData } from './pages/user-data';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() =>
  <Provider>
    <Router>
      <Routes>
        <Route path="/" component={Root}>
          <Route path="/home" component={Home} />
          <Route path="/login" component={LoginOrSignUp} />
          <Route path="/my-data" component={UserData} />
        </Route>
      </Routes>
    </Router>
  </Provider>,
  root!);
