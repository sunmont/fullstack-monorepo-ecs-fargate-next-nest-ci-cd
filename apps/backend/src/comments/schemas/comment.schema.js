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
exports.CommentSchema = exports.Comment = void 0;
var openapi = require("@nestjs/swagger");
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var Comment = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true,
            toJSON: {
                virtuals: true,
                transform: function (doc, ret) {
                    delete ret.__v;
                    return ret;
                },
            },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _author_decorators;
    var _author_initializers = [];
    var _author_extraInitializers = [];
    var _post_decorators;
    var _post_initializers = [];
    var _post_extraInitializers = [];
    var _parentComment_decorators;
    var _parentComment_initializers = [];
    var _parentComment_extraInitializers = [];
    var _depth_decorators;
    var _depth_initializers = [];
    var _depth_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _likeCount_decorators;
    var _likeCount_initializers = [];
    var _likeCount_extraInitializers = [];
    var _replyCount_decorators;
    var _replyCount_initializers = [];
    var _replyCount_extraInitializers = [];
    var _likes_decorators;
    var _likes_initializers = [];
    var _likes_extraInitializers = [];
    var _mentions_decorators;
    var _mentions_initializers = [];
    var _mentions_extraInitializers = [];
    var _editedAt_decorators;
    var _editedAt_initializers = [];
    var _editedAt_extraInitializers = [];
    var Comment = _classThis = /** @class */ (function () {
        function Comment_1() {
            this.content = __runInitializers(this, _content_initializers, void 0);
            this.author = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _author_initializers, void 0));
            this.post = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _post_initializers, void 0));
            this.parentComment = (__runInitializers(this, _post_extraInitializers), __runInitializers(this, _parentComment_initializers, void 0));
            this.depth = (__runInitializers(this, _parentComment_extraInitializers), __runInitializers(this, _depth_initializers, void 0));
            this.isActive = (__runInitializers(this, _depth_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.likeCount = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _likeCount_initializers, void 0));
            this.replyCount = (__runInitializers(this, _likeCount_extraInitializers), __runInitializers(this, _replyCount_initializers, void 0));
            this.likes = (__runInitializers(this, _replyCount_extraInitializers), __runInitializers(this, _likes_initializers, void 0));
            this.mentions = (__runInitializers(this, _likes_extraInitializers), __runInitializers(this, _mentions_initializers, void 0));
            this.editedAt = (__runInitializers(this, _mentions_extraInitializers), __runInitializers(this, _editedAt_initializers, void 0));
            __runInitializers(this, _editedAt_extraInitializers);
        }
        Object.defineProperty(Comment_1.prototype, "hasReplies", {
            // Virtual for checking if comment has replies
            get: function () {
                return this.replyCount > 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Comment_1.prototype, "isReply", {
            // Virtual for checking if comment is a reply
            get: function () {
                return !!this.parentComment;
            },
            enumerable: false,
            configurable: true
        });
        Comment_1._OPENAPI_METADATA_FACTORY = function () {
            return { content: { required: true, type: function () { return String; } }, author: { required: true, type: function () { return require("../../users/schemas/user.schema").User; } }, post: { required: true, type: function () { return require("../../posts/schemas/post.schema").Post; } }, parentComment: { required: false, type: function () { return require("./comment.schema").Comment; } }, depth: { required: true, type: function () { return Number; } }, isActive: { required: true, type: function () { return Boolean; } }, likeCount: { required: true, type: function () { return Number; } }, replyCount: { required: true, type: function () { return Number; } }, likes: { required: true }, mentions: { required: true, type: function () { return [String]; } }, editedAt: { required: false, type: function () { return Date; } } };
        };
        return Comment_1;
    }());
    __setFunctionName(_classThis, "Comment");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _content_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _author_decorators = [(0, mongoose_1.Prop)({
                type: mongoose_2.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            })];
        _post_decorators = [(0, mongoose_1.Prop)({
                type: mongoose_2.Schema.Types.ObjectId,
                ref: "Post",
                required: true,
            })];
        _parentComment_decorators = [(0, mongoose_1.Prop)({
                type: mongoose_2.Schema.Types.ObjectId,
                ref: "Comment",
                default: null,
            })];
        _depth_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _isActive_decorators = [(0, mongoose_1.Prop)({ default: true })];
        _likeCount_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _replyCount_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _likes_decorators = [(0, mongoose_1.Prop)({
                type: [
                    {
                        user: { type: mongoose_2.Schema.Types.ObjectId, ref: "User" },
                        likedAt: Date,
                    },
                ],
            })];
        _mentions_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _editedAt_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: function (obj) { return "author" in obj; }, get: function (obj) { return obj.author; }, set: function (obj, value) { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
        __esDecorate(null, null, _post_decorators, { kind: "field", name: "post", static: false, private: false, access: { has: function (obj) { return "post" in obj; }, get: function (obj) { return obj.post; }, set: function (obj, value) { obj.post = value; } }, metadata: _metadata }, _post_initializers, _post_extraInitializers);
        __esDecorate(null, null, _parentComment_decorators, { kind: "field", name: "parentComment", static: false, private: false, access: { has: function (obj) { return "parentComment" in obj; }, get: function (obj) { return obj.parentComment; }, set: function (obj, value) { obj.parentComment = value; } }, metadata: _metadata }, _parentComment_initializers, _parentComment_extraInitializers);
        __esDecorate(null, null, _depth_decorators, { kind: "field", name: "depth", static: false, private: false, access: { has: function (obj) { return "depth" in obj; }, get: function (obj) { return obj.depth; }, set: function (obj, value) { obj.depth = value; } }, metadata: _metadata }, _depth_initializers, _depth_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _likeCount_decorators, { kind: "field", name: "likeCount", static: false, private: false, access: { has: function (obj) { return "likeCount" in obj; }, get: function (obj) { return obj.likeCount; }, set: function (obj, value) { obj.likeCount = value; } }, metadata: _metadata }, _likeCount_initializers, _likeCount_extraInitializers);
        __esDecorate(null, null, _replyCount_decorators, { kind: "field", name: "replyCount", static: false, private: false, access: { has: function (obj) { return "replyCount" in obj; }, get: function (obj) { return obj.replyCount; }, set: function (obj, value) { obj.replyCount = value; } }, metadata: _metadata }, _replyCount_initializers, _replyCount_extraInitializers);
        __esDecorate(null, null, _likes_decorators, { kind: "field", name: "likes", static: false, private: false, access: { has: function (obj) { return "likes" in obj; }, get: function (obj) { return obj.likes; }, set: function (obj, value) { obj.likes = value; } }, metadata: _metadata }, _likes_initializers, _likes_extraInitializers);
        __esDecorate(null, null, _mentions_decorators, { kind: "field", name: "mentions", static: false, private: false, access: { has: function (obj) { return "mentions" in obj; }, get: function (obj) { return obj.mentions; }, set: function (obj, value) { obj.mentions = value; } }, metadata: _metadata }, _mentions_initializers, _mentions_extraInitializers);
        __esDecorate(null, null, _editedAt_decorators, { kind: "field", name: "editedAt", static: false, private: false, access: { has: function (obj) { return "editedAt" in obj; }, get: function (obj) { return obj.editedAt; }, set: function (obj, value) { obj.editedAt = value; } }, metadata: _metadata }, _editedAt_initializers, _editedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Comment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Comment = _classThis;
}();
exports.Comment = Comment;
exports.CommentSchema = mongoose_1.SchemaFactory.createForClass(Comment);
// Indexes for better query performance
exports.CommentSchema.index({ post: 1, createdAt: -1 });
exports.CommentSchema.index({ author: 1 });
exports.CommentSchema.index({ parentComment: 1 });
exports.CommentSchema.index({ content: "text" });
exports.CommentSchema.index({ isActive: 1 });
exports.CommentSchema.index({ createdAt: -1 });
