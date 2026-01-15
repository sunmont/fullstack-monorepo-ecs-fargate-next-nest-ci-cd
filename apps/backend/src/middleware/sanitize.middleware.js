"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeMiddleware = void 0;
var common_1 = require("@nestjs/common");
var xss_1 = require("xss");
var SanitizeMiddleware = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SanitizeMiddleware = _classThis = /** @class */ (function () {
        function SanitizeMiddleware_1() {
        }
        SanitizeMiddleware_1.prototype.use = function (req, res, next) {
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
        };
        SanitizeMiddleware_1.prototype.sanitizeObject = function (obj) {
            var _this = this;
            if (Array.isArray(obj)) {
                return obj.map(function (item) { return _this.sanitizeValue(item); });
            }
            if (obj !== null && typeof obj === "object") {
                var sanitized = {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        sanitized[key] = this.sanitizeValue(obj[key]);
                    }
                }
                return sanitized;
            }
            return this.sanitizeValue(obj);
        };
        SanitizeMiddleware_1.prototype.sanitizeValue = function (value) {
            if (typeof value === "string") {
                // Remove potentially dangerous characters
                value = value
                    .replace(/[<>]/g, "") // Remove < and >
                    .trim();
                // XSS protection
                value = (0, xss_1.default)(value, {
                    whiteList: {}, // empty means filter out all tags
                    stripIgnoreTag: true,
                    stripIgnoreTagBody: ["script", "style"],
                });
            }
            return value;
        };
        return SanitizeMiddleware_1;
    }());
    __setFunctionName(_classThis, "SanitizeMiddleware");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanitizeMiddleware = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanitizeMiddleware = _classThis;
}();
exports.SanitizeMiddleware = SanitizeMiddleware;
