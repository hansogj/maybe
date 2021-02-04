/* / * eslint-disable import/no-extraneous-dependencies * /
import 'reflect-metadata';

import * as winston from 'winston';

// don't log while running tests
winston.remove(winston.transports.Console);
winston.remove(winston.transports.File);
 */