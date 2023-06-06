import dotenv from 'dotenv';
dotenv.config();

export default {
  jwt: {
    secret: process.env.SECRET!,
    expiresIn: '1d',
  },
};
