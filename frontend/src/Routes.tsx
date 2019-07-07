import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './views/Home';
import App from './views/User';
import Account from './views/Account';
import LoginCallback from './views/LoginCallback';
import AccountDetails from './views/Account/AccountDetails';
import EditProvider from './views/Account/EditProvider';
import NewProvider from './views/Account/NewProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import styles from './Routes.module.scss';

declare global {
  interface Window {
    gtag?: (...args: any[]) => any;
  }
}

const Routes = () => (
  <Router>
    <Route
      path="/"
      render={({ location }) => {
        if (typeof window.gtag === 'function') {
          window.gtag('config', process.env.REACT_APP_GOOGLE_ANALYTICS, {
            page_title: document.title,
            page_location: window.location.href,
            page_path: location.pathname,
          });
        }
        return null;
      }}
    />
    <Header />
    <main className={styles.main}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/account" component={Account} />
        <Route
          exact
          path="/account/settings"
          component={(...props: any[]) => <AccountDetails {...props} edit />}
        />
        <Route exact path="/account/setup" component={AccountDetails} />
        <Route exact path="/account/login" component={LoginCallback} />
        <Route exact path="/account/provider/new" component={NewProvider} />
        <Route
          exact
          path="/account/provider/:provider"
          component={EditProvider}
        />
        <Route exact path="/:permalink/:amount?" component={App} />
      </Switch>
    </main>
    <Footer />
  </Router>
);

export default Routes;
