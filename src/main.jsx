import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'


createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain="dev-gfdpj05ngeziykup.us.auth0.com"
      clientId="OKRG2SK4ZWwrmoLSfdjpam6Df52BX4JJ"
      authorizationParams={{
        audience: "https://dev-gfdpj05ngeziykup.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
    <App />
  </Auth0Provider>,
)