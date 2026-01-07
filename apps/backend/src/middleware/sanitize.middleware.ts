import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import xss from "xss";

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Sanitize request body
    if (req.body && typeof req.body === "object") {
      req.body = this.sanitizeObject(req.body);
    }

    // Sanitize request query
    if (req.query && typeof req.query === "object") {
      req.query = this.sanitizeObject(req.query);
    }

    // Sanitize request params
    if (req.params && typeof req.params === "object") {
      req.params = this.sanitizeObject(req.params);
    }

    next();
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeValue(item));
    }

    if (obj !== null && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeValue(obj[key]);
        }
      }
      return sanitized;
    }

    return this.sanitizeValue(obj);
  }

  private sanitizeValue(value: any): any {
    if (typeof value === "string") {
      // Remove potentially dangerous characters
      value = value
        .replace(/[<>]/g, "") // Remove < and >
        .trim();

      // XSS protection
      value = xss(value, {
        whiteList: {}, // empty means filter out all tags
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script", "style"],
      });
    }
    return value;
  }
}
