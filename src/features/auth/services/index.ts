import {authService} from './authService';
import {tokenService} from './tokenService';
import {userService} from './userService';

export {authService} from './authService';
export {tokenService} from './tokenService';
export {userService} from './userService';

export const auth = {
  service: authService,
  tokens: tokenService,
  user: userService,
};
