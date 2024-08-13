const winston = require('winston');


const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' }) 
  ],
});


logger.error('Something went wrong!', { error: err });
