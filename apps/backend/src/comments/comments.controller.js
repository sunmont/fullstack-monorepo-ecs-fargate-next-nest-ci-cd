"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var user_schema_1 = require("../users/schemas/user.schema");
var CommentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)("comments"), (0, common_1.Controller)("comments")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAllByPost_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _like_decorators;
    var _getCommentStats_decorators;
    var CommentsController = _classThis = /** @class */ (function () {
        function CommentsController_1(commentsService) {
            this.commentsService = (__runInitializers(this, _instanceExtraInitializers), commentsService);
        }
        CommentsController_1.prototype.create = function (req, createCommentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.commentsService.create(req.user.id, createCommentDto.postId, createCommentDto)];
                });
            });
        };
        CommentsController_1.prototype.findAllByPost = function (postId_1) {
            return __awaiter(this, arguments, void 0, function (postId, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.commentsService.findAllByPost(postId, page, limit)];
                });
            });
        };
        CommentsController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.commentsService.findOne(id)];
                });
            });
        };
        CommentsController_1.prototype.update = function (id, req, updateCommentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.commentsService.update(id, req.user.id, updateCommentDto)];
                });
            });
        };
        CommentsController_1.prototype.remove = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.commentsService.remove(id, req.user.id, req.user.role === user_schema_1.UserRole.ADMIN)];
                });
            });
        };
        CommentsController_1.prototype.like = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.commentsService.likeComment(id, req.user.id)];
                });
            });
        };
        CommentsController_1.prototype.getCommentStats = function (postId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.commentsService.getCommentStats(postId)];
                });
            });
        };
        return CommentsController_1;
    }());
    __setFunctionName(_classThis, "CommentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({ summary: "Create a new comment" }), (0, swagger_1.ApiResponse)({ status: 201, description: "Comment created successfully" }), (0, swagger_1.ApiResponse)({ status: 404, description: "Post not found" }), openapi.ApiResponse({ status: 201, type: Object })];
        _findAllByPost_decorators = [(0, common_1.Get)("post/:postId"), (0, swagger_1.ApiOperation)({ summary: "Get comments for a post" }), (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number, default: 1 }), (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number, default: 20 }), (0, swagger_1.ApiResponse)({ status: 200, description: "Comments retrieved successfully" }), openapi.ApiResponse({ status: 200 })];
        _findOne_decorators = [(0, common_1.Get)(":id"), (0, swagger_1.ApiOperation)({ summary: "Get a comment by ID" }), (0, swagger_1.ApiResponse)({ status: 200, description: "Comment retrieved" }), (0, swagger_1.ApiResponse)({ status: 404, description: "Comment not found" }), openapi.ApiResponse({ status: 200, type: Object })];
        _update_decorators = [(0, common_1.Put)(":id"), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({ summary: "Update a comment" }), (0, swagger_1.ApiResponse)({ status: 200, description: "Comment updated" }), (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden" }), (0, swagger_1.ApiResponse)({ status: 404, description: "Comment not found" }), openapi.ApiResponse({ status: 200, type: Object })];
        _remove_decorators = [(0, common_1.Delete)(":id"), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({ summary: "Delete a comment" }), (0, swagger_1.ApiResponse)({ status: 200, description: "Comment deleted" }), (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden" }), (0, swagger_1.ApiResponse)({ status: 404, description: "Comment not found" }), openapi.ApiResponse({ status: 200 })];
        _like_decorators = [(0, common_1.Post)(":id/like"), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({ summary: "Like/Unlike a comment" }), (0, swagger_1.ApiResponse)({ status: 200, description: "Like status toggled" }), openapi.ApiResponse({ status: 201 })];
        _getCommentStats_decorators = [(0, common_1.Get)("post/:postId/stats"), (0, swagger_1.ApiOperation)({ summary: "Get comment statistics for a post" }), (0, swagger_1.ApiResponse)({ status: 200, description: "Statistics retrieved" }), openapi.ApiResponse({ status: 200 })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllByPost_decorators, { kind: "method", name: "findAllByPost", static: false, private: false, access: { has: function (obj) { return "findAllByPost" in obj; }, get: function (obj) { return obj.findAllByPost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _like_decorators, { kind: "method", name: "like", static: false, private: false, access: { has: function (obj) { return "like" in obj; }, get: function (obj) { return obj.like; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCommentStats_decorators, { kind: "method", name: "getCommentStats", static: false, private: false, access: { has: function (obj) { return "getCommentStats" in obj; }, get: function (obj) { return obj.getCommentStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommentsController = _classThis;
}();
exports.CommentsController = CommentsController;
