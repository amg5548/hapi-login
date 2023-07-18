import {unauthorized} from '@hapi/boom';
import {ServerRoute} from '@hapi/hapi';
import Joi from 'joi';
import {JwtPayload, sign, verify} from 'jsonwebtoken';

const tokens: string[] = [];

const accessSecret = process.env.HAPI_LOGIN_ACCESS_TOKEN_SECRET as string;
const refreshSecret = process.env.HAPI_LOGIN_REFRESH_TOKEN_SECRET as string;

const routes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/login',
    handler: ({payload: {username}}: Request & {payload: {username: string}}, h) => {
      const refreshToken = sign({username}, refreshSecret, {
        expiresIn: '1d',
      });

      tokens.push(refreshToken);

      return h.response({refreshToken}).state(
        'accessToken',
        sign({username}, accessSecret, {
          expiresIn: '5s',
        })
      );
    },
    options: {
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/greet',
    handler: ({state: {accessToken}}) => {
      try {
        const {username} = verify(accessToken, accessSecret) as JwtPayload;

        return {message: `Hello ${username}!`};
      } catch (err) {
        return unauthorized();
      }
    },
    options: {
      validate: {
        state: Joi.object({
          accessToken: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/refresh',
    handler: ({payload: {refreshToken}}: Request & {payload: {refreshToken: string}}, h) => {
      // mock find query
      const token = tokens.find((t) => t === refreshToken);

      if (!token) {
        return unauthorized();
      }

      try {
        const {username} = verify(refreshToken, refreshSecret) as JwtPayload;

        return h.response({message: 'Successfully refreshed the access token!'}).state(
          'accessToken',
          sign({username}, accessSecret, {
            expiresIn: '5s',
          })
        );
      } catch (err) {
        return unauthorized();
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/logout',
    handler: ({payload: {refreshToken}}: Request & {payload: {refreshToken: string}}, h) => {
      const index = tokens.indexOf(refreshToken);

      // mock delete query
      const {length} = tokens.splice(index, index === -1 ? 0 : 1);

      if (!length) {
        return unauthorized();
      }

      return h.response({message: 'Successfully logged out!'}).unstate('accessToken');
    },
    options: {
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required(),
        }),
      },
    },
  },
];

export default routes;
