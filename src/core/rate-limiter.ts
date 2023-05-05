import rateLimit from 'express-rate-limit';
import { Environment } from '../configuration/environment';

const limiter = rateLimit({
	windowMs: Environment.WINDOW_MINUTES * 60 * 1000,
	max: Environment.MAX_REQUEST,
	standardHeaders: true,
	legacyHeaders: false,
});

export default limiter;