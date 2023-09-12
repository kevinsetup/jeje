import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import { environment } from 'src/environment/environment';
import axios from 'axios';
import jwtService from './services/jwtService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in with JWT' }));

      /**
       * Sign in and retrieve user data with stored token
       */
      jwtService
        .signInWithToken()
        .then((user) => {
          success(user, 'Bienvenido nuevamente 👋');

          const token = localStorage.getItem('jwt_access_token');
          axios
            .get(`${environment.apiUrl}Login/GetNavigation`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log(res.data.navigation);

              const currentUrl = window.location.pathname; // 1. Obtiene la URL actual

              let urlFound = false;

              // 2. Itera sobre la respuesta de la API
              if (currentUrl === '/') {
                urlFound = true;
              } else {
                // 3. Itera sobre la respuesta de la API para verificar las demás rutas
                res.data.navigation.forEach((item) => {
                  if (item.url === currentUrl) {
                    urlFound = true;
                  }
                  if (item.children) {
                    item.children.forEach((child) => {
                      if (child.url === currentUrl) {
                        urlFound = true;
                      }
                    });
                  }
                });
              }

              // 4. Si no hay coincidencia, muestra una alerta.
              if (!urlFound) {
                alert(
                  'AL parecer estás queriendo acceder a una página protegida!!!, redireccionando'
                );
                window.location.href = '/';
              }
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    jwtService.on('onLogin', (user) => {
      success(user, 'Signed in');
    });

    jwtService.on('onLogout', () => {
      pass('Signed out');

      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);

      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([
        dispatch(setUser(user)),
        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
