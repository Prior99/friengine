import { createLogger, format } from "winston"

export const logger = createLogger({
    level: "verbose",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
        format.colorize(),
        format.printf(param => `${param.timestamp} - ${param.level}: ${param.message}`),
    ),
    silent: true,
});