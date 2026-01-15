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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var post_schema_1 = require("./schemas/post.schema");
var PostsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PostsService = _classThis = /** @class */ (function () {
        function PostsService_1(postModel) {
            this.postModel = postModel;
        }
        PostsService_1.prototype.create = function (userId, createPostDto) {
            return __awaiter(this, void 0, void 0, function () {
                var post;
                return __generator(this, function (_a) {
                    post = new this.postModel(__assign(__assign({}, createPostDto), { author: userId, status: createPostDto.status || post_schema_1.PostStatus.DRAFT }));
                    if (createPostDto.status === post_schema_1.PostStatus.PUBLISHED) {
                        post.publishedAt = new Date();
                    }
                    return [2 /*return*/, post.save()];
                });
            });
        };
        PostsService_1.prototype.findAll = function (pagination, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, _c, sortBy, _d, sortOrder, filters, query, skip, _e, posts, total;
                var _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _a = pagination.page, page = _a === void 0 ? 1 : _a, _b = pagination.limit, limit = _b === void 0 ? 10 : _b, _c = pagination.sortBy, sortBy = _c === void 0 ? "createdAt" : _c, _d = pagination.sortOrder, sortOrder = _d === void 0 ? "desc" : _d, filters = __rest(pagination, ["page", "limit", "sortBy", "sortOrder"]);
                            query = {};
                            // Apply filters
                            query.status = filters.status || post_schema_1.PostStatus.PUBLISHED;
                            if (filters.author) {
                                query.author = new mongoose_1.Types.ObjectId(filters.author);
                            }
                            if (filters.tags && filters.tags.length > 0) {
                                query.tags = { $in: filters.tags };
                            }
                            if (filters.category) {
                                query.categories = filters.category;
                            }
                            if (filters.search) {
                                query.$text = { $search: filters.search };
                            }
                            // For authors, show their own drafts
                            if (userId && filters.includeDrafts) {
                                query.$or = [
                                    { status: post_schema_1.PostStatus.PUBLISHED },
                                    { author: new mongoose_1.Types.ObjectId(userId), status: post_schema_1.PostStatus.DRAFT },
                                ];
                            }
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.postModel
                                        .find(query)
                                        .populate("author", "name email profilePicture")
                                        .sort((_f = {}, _f[sortBy] = sortOrder === "desc" ? -1 : 1, _f))
                                        .skip(skip)
                                        .limit(limit)
                                        .lean(),
                                    this.postModel.countDocuments(query),
                                ])];
                        case 1:
                            _e = _g.sent(), posts = _e[0], total = _e[1];
                            return [2 /*return*/, {
                                    posts: posts,
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
        PostsService_1.prototype.findOne = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.postModel
                                .findById(id)
                                .populate("author", "name email profilePicture")
                                .lean()];
                        case 1:
                            post = _a.sent();
                            if (!post) {
                                throw new common_1.NotFoundException("Post not found");
                            }
                            // Check permissions
                            if (post.status === post_schema_1.PostStatus.DRAFT &&
                                post.author._id.toString() !== userId) {
                                throw new common_1.ForbiddenException("You do not have permission to view this post");
                            }
                            // Increment view count
                            return [4 /*yield*/, this.postModel.updateOne({ _id: id }, { $inc: { viewCount: 1 } })];
                        case 2:
                            // Increment view count
                            _a.sent();
                            return [2 /*return*/, post];
                    }
                });
            });
        };
        PostsService_1.prototype.update = function (id, userId, updatePostDto) {
            return __awaiter(this, void 0, void 0, function () {
                var post, updatedPost;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.postModel.findById(id)];
                        case 1:
                            post = _a.sent();
                            if (!post) {
                                throw new common_1.NotFoundException("Post not found");
                            }
                            // Check ownership
                            if (post.author.toString() !== userId) {
                                throw new common_1.ForbiddenException("You can only update your own posts");
                            }
                            // Handle status changes
                            if (updatePostDto.status === post_schema_1.PostStatus.PUBLISHED &&
                                post.status !== post_schema_1.PostStatus.PUBLISHED) {
                                updatePostDto.publishedAt = new Date();
                            }
                            return [4 /*yield*/, this.postModel
                                    .findByIdAndUpdate(id, updatePostDto, { new: true })
                                    .populate("author", "name email profilePicture")];
                        case 2:
                            updatedPost = _a.sent();
                            return [2 /*return*/, updatedPost];
                    }
                });
            });
        };
        PostsService_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.postModel.findById(id)];
                        case 1:
                            post = _a.sent();
                            if (!post) {
                                throw new common_1.NotFoundException("Post not found");
                            }
                            // Check ownership or admin
                            if (post.author.toString() !== userId) {
                                throw new common_1.ForbiddenException("You can only delete your own posts");
                            }
                            // Soft delete by changing status
                            post.status = post_schema_1.PostStatus.ARCHIVED;
                            return [4 /*yield*/, post.save()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: "Post archived successfully" }];
                    }
                });
            });
        };
        PostsService_1.prototype.likePost = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post, alreadyLiked;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.postModel.findById(id)];
                        case 1:
                            post = _a.sent();
                            if (!post) {
                                throw new common_1.NotFoundException("Post not found");
                            }
                            return [4 /*yield*/, this.postModel.findOne({
                                    _id: id,
                                    "likes.user": userId,
                                })];
                        case 2:
                            alreadyLiked = _a.sent();
                            if (!alreadyLiked) return [3 /*break*/, 4];
                            // Unlike
                            return [4 /*yield*/, this.postModel.updateOne({ _id: id }, {
                                    $pull: { likes: { user: userId } },
                                    $inc: { likeCount: -1 },
                                })];
                        case 3:
                            // Unlike
                            _a.sent();
                            return [2 /*return*/, { liked: false }];
                        case 4: 
                        // Like
                        return [4 /*yield*/, this.postModel.updateOne({ _id: id }, {
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
        PostsService_1.prototype.getTrendingPosts = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var weekAgo;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return [2 /*return*/, this.postModel
                            .find({
                            status: post_schema_1.PostStatus.PUBLISHED,
                            publishedAt: { $gte: weekAgo },
                        })
                            .sort({ viewCount: -1, likeCount: -1 })
                            .limit(limit)
                            .populate("author", "name email profilePicture")
                            .lean()];
                });
            });
        };
        PostsService_1.prototype.getPostsByAuthor = function (authorId_1) {
            return __awaiter(this, arguments, void 0, function (authorId, includeDrafts) {
                var query;
                if (includeDrafts === void 0) { includeDrafts = false; }
                return __generator(this, function (_a) {
                    query = { author: authorId };
                    if (!includeDrafts) {
                        query.status = post_schema_1.PostStatus.PUBLISHED;
                    }
                    return [2 /*return*/, this.postModel
                            .find(query)
                            .sort({ createdAt: -1 })
                            .populate("author", "name email profilePicture")
                            .lean()];
                });
            });
        };
        PostsService_1.prototype.searchPosts = function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, filters) {
                var searchQuery;
                if (filters === void 0) { filters = {}; }
                return __generator(this, function (_a) {
                    searchQuery = {
                        status: post_schema_1.PostStatus.PUBLISHED,
                        $text: { $search: query },
                    };
                    if (filters.tags && filters.tags.length > 0) {
                        searchQuery.tags = { $in: filters.tags };
                    }
                    if (filters.category) {
                        searchQuery.categories = filters.category;
                    }
                    return [2 /*return*/, this.postModel
                            .find(searchQuery)
                            .sort({ score: { $meta: "textScore" } })
                            .populate("author", "name email profilePicture")
                            .lean()];
                });
            });
        };
        PostsService_1.prototype.getStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var stats, totalPosts, publishedPosts, totalViews;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.postModel.aggregate([
                                {
                                    $group: {
                                        _id: "$status",
                                        count: { $sum: 1 },
                                        totalViews: { $sum: "$viewCount" },
                                        totalLikes: { $sum: "$likeCount" },
                                        avgViews: { $avg: "$viewCount" },
                                        avgLikes: { $avg: "$likeCount" },
                                    },
                                },
                            ])];
                        case 1:
                            stats = _b.sent();
                            return [4 /*yield*/, this.postModel.countDocuments()];
                        case 2:
                            totalPosts = _b.sent();
                            return [4 /*yield*/, this.postModel.countDocuments({
                                    status: post_schema_1.PostStatus.PUBLISHED,
                                })];
                        case 3:
                            publishedPosts = _b.sent();
                            return [4 /*yield*/, this.postModel.aggregate([
                                    { $group: { _id: null, total: { $sum: "$viewCount" } } },
                                ])];
                        case 4:
                            totalViews = _b.sent();
                            return [2 /*return*/, {
                                    stats: stats,
                                    summary: {
                                        totalPosts: totalPosts,
                                        publishedPosts: publishedPosts,
                                        draftPosts: totalPosts - publishedPosts,
                                        totalViews: ((_a = totalViews[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                                    },
                                }];
                    }
                });
            });
        };
        return PostsService_1;
    }());
    __setFunctionName(_classThis, "PostsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PostsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PostsService = _classThis;
}();
exports.PostsService = PostsService;
