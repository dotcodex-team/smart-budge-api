import allowedOrigins from '../config/allowedOrigins';

const cors = require('cors');

export default function useCors(app) {
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const message = 'The CORS policy for this site does not '
            + 'allow access from the specified Origin.';
          return callback(new Error(message), false);
        }
        return callback(null, true);
      }
    })
  );
}
