import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import ReportPage from './components/ReportPage';

const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "",
  pkceMethod: 'S256' // Enable PKCE
};

const keycloak = new Keycloak(keycloakConfig);

const App: React.FC = () => {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <div className="App">
        <ReportPage />
      </div>
    </ReactKeycloakProvider>
  );
};

export default App;