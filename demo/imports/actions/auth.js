import { AUTH } from '../constants';

export const login = () => ({ type: AUTH.LOGIN });

export const logout = () => ({ type: AUTH.LOGOUT });
