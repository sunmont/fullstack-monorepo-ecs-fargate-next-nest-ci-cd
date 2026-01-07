"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.CommentsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var CommentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CommentsService = _classThis = /** @class */ (function () {
        function CommentsService_1(commentModel) {
            this.commentModel = commentModel;
        }
        CommentsService_1.prototype.create = function (userId, postId, createCommentDto) {
            return __awaiter(this, void 0, void 0, function () {
                var commentData, parentComment, comment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            commentData = {
                                content: createCommentDto.content,
                                author: new mongoose_1.Types.ObjectId(userId),
                                post: new mongoose_1.Types.ObjectId(postId),
                                isActive: true,
                            };
                            if (!createCommentDto.parentCommentId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.commentModel.findById(createCommentDto.parentCommentId)];
                        case 1:
                            parentComment = _a.sent();
                            if (!parentComment) {
                                throw new common_1.NotFoundException("Parent comment not found");
                            }
                            commentData.parentComment = parentComment._id;
                            commentData.depth = parentComment.depth + 1;
                            // Update parent comment's reply count
                            return [4 /*yield*/, this.commentModel.updateOne({ _id: parentComment._id }, { $inc: { replyCount: 1 } })];
                        case 2:
                            // Update parent comment's reply count
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            commentData.depth = 0;
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.commentModel.create(commentData)];
                        case 5:
                            comment = _a.sent();
                            // Populate author information
                            return [2 /*return*/, this.commentModel
                                    .findById(comment._id)
                                    .populate("author", "name email profilePicture")
                                    .populate("parentComment")
                                    .lean()];
                    }
                });
            });
        };
        CommentsService_1.prototype.findAllByPost = function (postId_1) {
            return __awaiter(this, arguments, void 0, function (postId, page, limit) {
                var skip, _a, comments, total, nestedComments;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.commentModel
                                        .find({ post: postId, isActive: true })
                                        .populate("author", "name email profilePicture")
                                        .sort({ createdAt: 1 }) // Chronological order for nested comments
                                        .skip(skip)
                                        .limit(limit)
                                        .lean(),
                                    this.commentModel.countDocuments({ post: postId, isActive: true }),
                                ])];
                        case 1:
                            _a = _b.sent(), comments = _a[0], total = _a[1];
                            nestedComments = this.buildNestedComments(comments);
                            return [2 /*return*/, {
                                    comments: nestedComments,
                                    meta: {
                                        page: page,
                                        limit: limit,
                                        total: total,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        CommentsService_1.prototype.buildNestedComments = function (comments, parentId) {
            var _this = this;
            if (parentId === void 0) { parentId = null; }
            return comments
                .filter(function (comment) {
                return (!parentId && !comment.parentComment) ||
                    (parentId &&
                        comment.parentComment &&
                        comment.parentComment.toString() === parentId);
            })
                .map(function (comment) { return (__assign(__assign({}, comment), { replies: _this.buildNestedComments(comments, comment._id.toString()) })); });
        };
        CommentsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var comment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.commentModel
                                .findById(id)
                                .populate("author", "name email profilePicture")
                                .populate("post")
                                .lean()];
                        case 1:
                            comment = _a.sent();
                            if (!comment) {
                                throw new common_1.NotFoundException("Comment not found");
                            }
                            return [2 /*return*/, comment];
                    }
                });
            });
        };
        CommentsService_1.prototype.update = function (id, userId, updateCommentDto) {
            return __awaiter(this, void 0, void 0, function () {
                var comment, updatedComment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.commentModel.findById(id)];
                        case 1:
                            comment = _a.sent();
                            if (!comment) {
                                throw new common_1.NotFoundException("Comment not found");
                            }
                            // Check ownership
                            if (comment.author.toString() !== userId) {
                                throw new common_1.ForbiddenException("You can only update your own comments");
                            }
                            return [4 /*yield*/, this.commentModel
                                    .findByIdAndUpdate(id, __assign(__assign({}, updateCommentDto), { editedAt: new Date() }), { new: true })
                                    .populate("author", "name email profilePicture")];
                        case 2:
                            updatedComment = _a.sent();
                            return [2 /*return*/, updatedComment];
                    }
                });
            });
        };
        CommentsService_1.prototype.remove = function (id_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (id, userId, isAdmin) {
                var comment;
                if (isAdmin === void 0) { isAdmin = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.commentModel.findById(id)];
                        case 1:
                            comment = _a.sent();
                            if (!comment) {
                                throw new common_1.NotFoundException("Comment not found");
                            }
                            // Check ownership or admin status
                            if (!isAdmin && comment.author.toString() !== userId) {
                                throw new common_1.ForbiddenException("You can only delete your own comments");
                            }
                            if (!(comment.replyCount > 0)) return [3 /*break*/, 3];
                            comment.isActive = false;
                            comment.content = "[Deleted]";
                            return [4 /*yield*/, comment.save()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 3: return [4 /*yield*/, comment.deleteOne()];
                        case 4:
                            _a.sent();
                            if (!comment.parentComment) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.commentModel.updateOne({ _id: comment.parentComment }, { $inc: { replyCount: -1 } })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/, { message: "Comment deleted successfully" }];
                    }
                });
            });
        };
        CommentsService_1.prototype.likeComment = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var comment, alreadyLiked;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.commentModel.findById(id)];
                        case 1:
                            comment = _a.sent();
                            if (!comment) {
                                throw new common_1.NotFoundException("Comment not found");
                            }
                            return [4 /*yield*/, this.commentModel.findOne({
                                    _id: id,
                                    "likes.user": userId,
                                })];
                        case 2:
                            alreadyLiked = _a.sent();
                            if (!alreadyLiked) return [3 /*break*/, 4];
                            // Unlike
                            return [4 /*yield*/, this.commentModel.updateOne({ _id: id }, {
                                    $pull: { likes: { user: userId } },
                                    $inc: { likeCount: -1 },
                                })];
                        case 3:
                            // Unlike
                            _a.sent();
                            return [2 /*return*/, { liked: false }];
                        case 4: 
                        // Like
                        return [4 /*yield*/, this.commentModel.updateOne({ _id: id }, {
                                $push: { likes: { user: userId, likedAt: new Date() } },
                                $inc: { likeCount: 1 },
                            })];
                        case 5:
                            // Like
                            _a.sent();
                            return [2 /*return*/, { liked: true }];
                    }
                });
            });
        };
        CommentsService_1.prototype.getCommentStats = function (postId) {
            return __awaiter(this, void 0, void 0, function () {
                var stats, topComments;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.commentModel.aggregate([
                                { $match: { post: new mongoose_1.Types.ObjectId(postId), isActive: true } },
                                {
                                    $group: {
                                        _id: null,
                                        totalComments: { $sum: 1 },
                                        totalLikes: { $sum: "$likeCount" },
                                        avgLikes: { $avg: "$likeCount" },
                                    },
                                },
                            ])];
                        case 1:
                            stats = _a.sent();
                            return [4 /*yield*/, this.commentModel
                                    .find({ post: postId, isActive: true })
                                    .sort({ likeCount: -1 })
                                    .limit(5)
                                    .populate("author", "name profilePicture")
                                    .lean()];
                        case 2:
                            topComments = _a.sent();
                            return [2 /*return*/, {
                                    stats: stats[0] || {
                                        totalComments: 0,
                                        totalLikes: 0,
                                        avgLikes: 0,
                                    },
                                    topComments: topComments,
                                }];
                    }
                });
            });
        };
        return CommentsService_1;
    }());
    __setFunctionName(_classThis, "CommentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommentsService = _classThis;
}();
exports.CommentsService = CommentsService;
