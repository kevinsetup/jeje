import { environment } from 'src/environment/environment';

const jwtServiceConfig = {
  signIn: `${environment.apiUrl}Login/PostToken`,
  signUp: 'api/auth/sign-up',
  accessToken: `${environment.apiUrl}Login/GetNavigation`,
  updateUser: 'api/auth/user/update',
};

export default jwtServiceConfig;
