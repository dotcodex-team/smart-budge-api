import bcrypt from 'bcryptjs';
import models from '../models';
import {
  getUserInfo,
  signRefreshToken,
  signToken
} from '../utils/jwt';

const { User } = models;

export const createUser = async (req, res, next) => {
  try {
    const today = new Date();
    const { body } = req;

    const userData = {
      username: body.username,
      email: body.email,
      password: body.password,
      created: today
    };

    const checkIfUserExists = await User.findOne({
      where: { email: userData.email }
    });

    if (checkIfUserExists) {
      res.status(400);
      const err = new Error('Ya existe un usuario registrado con este email');
      next(err);
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      userData.password = hash;
      const user = await User.create(userData);
      const userInfo = getUserInfo(user);
      const refreshToken = await signRefreshToken(user);
      const token = await signToken(user);

      await user.update({ refreshToken });

      res.json({
        user: userInfo,
        isLogged: true,
        token,
        refreshToken
      });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await User.findOne({
      where: {
        email: body.email
      }
    });
    if (user) {
      if (bcrypt.compareSync(body.password, user.password)) {
        const userInfo = getUserInfo(user);
        const token = await signToken(user);
        const refreshToken = await signRefreshToken(user);
        await user.update({ refreshToken });
        return res.json({
          user: userInfo,
          isLogged: true,
          token,
          refreshToken
        });
      }
    }
    res.status(400);
    const err = new Error('La dirección de email o la contraseña son incorrectos. Por favor intenténtelo nuevamente.');
    return next(err);
    // eslint-disable-next-line
    return;
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ where: { email } });

    if (req.query.refreshToken === user.refreshToken) {
      const token = signToken(user);

      const userInfo = getUserInfo(user);

      return res.json({ token, user: userInfo });
    }
    return res.status(401).send({
      message: 'Refresh token invalido!'
    });
  } catch (error) {
    return next(error);
  }
};
