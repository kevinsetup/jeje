import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import jwtService from '../../auth/services/jwtService';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  password: yup
    .string()
    .required('Por favor ingrese su contraseña')
    // .min(4, 'Password is too short - must be at least 4 chars.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function ModernReversedSignInPage() {
  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ email, password }) {
    jwtService
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      // No need to do anything, user data will be set at app/auth/AuthContext
    })
    .catch((_errors) => {
      console.log('errors', _errors);
      _errors.forEach((error) => {
        setError(error.type, {
          type: 'manual',
          message: error.message,
        });
      });
    });
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0 md:p-32">
      <Paper className="flex w-full sm:w-auto min-h-full sm:min-h-auto md:w-full md:max-w-6xl rounded-0 sm:rounded-2xl sm:shadow overflow-hidden">
        <Box
          className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
          sx={{ backgroundColor: 'primary.main' }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Box
              component="g"
              sx={{ color: 'primary.light' }}
              className="opacity-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </Box>
          </svg>
          <Box
            component="svg"
            className="absolute -top-64 -right-64 opacity-20"
            sx={{ color: 'primary.light' }}
            viewBox="0 0 220 192"
            width="220px"
            height="192px"
            fill="none"
          >
            <defs>
              <pattern
                id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
          </Box>

          <div className="z-10 relative w-full max-w-2xl">
            <div className="text-7xl font-bold leading-none text-gray-100">
              <div>Bienvenido al</div>
              <div>Sistema de Pedidos</div>
            </div>
            <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            El sistema de pedidos permite realizar sus pedidos de manera sistemática

            </div>
            <div className="flex items-center mt-32">
              <AvatarGroup
                sx={{
                  '& .MuiAvatar-root': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Avatar src="assets/images/avatars/female-18.jpg" />
                <Avatar src="assets/images/avatars/female-11.jpg" />
                <Avatar src="assets/images/avatars/male-09.jpg" />
                <Avatar src="assets/images/avatars/male-16.jpg" />
              </AvatarGroup>

              <div className="ml-16 font-medium tracking-tight text-gray-400">
              Mas de 2 personas se han unido a nosotros
              </div>
            </div>
          </div>
        </Box>

        <div className="w-full sm:w-auto py-32 px-16 sm:p-48 md:p-64 rtl:border-r-1 ltr:border-l-1">
          <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img
            className="w-200"
            src="assets/images/logo/Figuesvg.png"
            alt="logo"
          />
            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
              Iniciar Sesión
            </Typography>
            <form
              name="loginForm"
              noValidate
              className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Usuario"
                    autoFocus
                    type="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    variant="outlined"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        label="Recuerdame"
                        control={<Checkbox size="small" {...field} />}
                      />
                    </FormControl>
                  )}
                />

                <Link className="text-md font-medium" to="/pages/auth/forgot-password">
                  ¿Olvidó su contraseña?
                </Link>
              </div>

              <Button
                variant="contained"
                color="secondary"
                className=" w-full mt-16"
                aria-label="Sign in"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type="submit"
                size="large"
              >
                Iniciar Sesión
              </Button>

            </form>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default ModernReversedSignInPage;

// export default SignInPage;
