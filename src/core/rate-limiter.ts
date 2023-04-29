import rateLimit from 'express-rate-limit';
import { Enviroment } from '../configuration/enviroment';

const limiter = rateLimit({
	windowMs: Enviroment.WINDOW_MINUTES * 60 * 1000,
	max: Enviroment.MAX_REQUEST,
	standardHeaders: true,
	legacyHeaders: false,
});

export default limiter;