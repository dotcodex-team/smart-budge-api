import { verifyToken } from '../utils/jwt';

export default async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.substring(7, authHeader.length);

    if (authHeader.startsWith('Bearer ')) {
      const decoded = await verifyToken(token);
      req.user = decoded;
      return next();
    }
    return res.status(401).send({
      message: 'Your session is not valid!'
    });
  } catch (error) {
    return res.status(401).send({
      message: error.message
    });
  }
}
