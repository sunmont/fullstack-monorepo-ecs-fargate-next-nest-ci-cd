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
exports.PostSchema = exports.Post = exports.PostStatus = void 0;
var openapi = require("@nestjs/swagger");
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var PostStatus;
(function (PostStatus) {
    PostStatus["DRAFT"] = "draft";
    PostStatus["PUBLISHED"] = "published";
    PostStatus["ARCHIVED"] = "archived";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
var Post = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true,
            toJSON: {
                virtuals: true,
            },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _excerpt_decorators;
    var _excerpt_initializers = [];
    var _excerpt_extraInitializers = [];
    var _author_decorators;
    var _author_initializers = [];
    var _author_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _categories_decorators;
    var _categories_initializers = [];
    var _categories_extraInitializers = [];
    var _viewCount_decorators;
    var _viewCount_initializers = [];
    var _viewCount_extraInitializers = [];
    var _likeCount_decorators;
    var _likeCount_initializers = [];
    var _likeCount_extraInitializers = [];
    var _publishedAt_decorators;
    var _publishedAt_initializers = [];
    var _publishedAt_extraInitializers = [];
    var _featuredImage_decorators;
    var _featuredImage_initializers = [];
    var _featuredImage_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    var _parentPost_decorators;
    var _parentPost_initializers = [];
    var _parentPost_extraInitializers = [];
    var _isFeatured_decorators;
    var _isFeatured_initializers = [];
    var _isFeatured_extraInitializers = [];
    var _seo_decorators;
    var _seo_initializers = [];
    var _seo_extraInitializers = [];
    var Post = _classThis = /** @class */ (function () {
        function Post_1() {
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.excerpt = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _excerpt_initializers, void 0));
            this.author = (__runInitializers(this, _excerpt_extraInitializers), __runInitializers(this, _author_initializers, void 0));
            this.status = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.tags = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.categories = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _categories_initializers, void 0));
            this.viewCount = (__runInitializers(this, _categories_extraInitializers), __runInitializers(this, _viewCount_initializers, void 0));
            this.likeCount = (__runInitializers(this, _viewCount_extraInitializers), __runInitializers(this, _likeCount_initializers, void 0));
            this.publishedAt = (__runInitializers(this, _likeCount_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
            this.featuredImage = (__runInitializers(this, _publishedAt_extraInitializers), __runInitializers(this, _featuredImage_initializers, void 0));
            this.images = (__runInitializers(this, _featuredImage_extraInitializers), __runInitializers(this, _images_initializers, void 0));
            this.parentPost = (__runInitializers(this, _images_extraInitializers), __runInitializers(this, _parentPost_initializers, void 0));
            this.isFeatured = (__runInitializers(this, _parentPost_extraInitializers), __runInitializers(this, _isFeatured_initializers, void 0));
            this.seo = (__runInitializers(this, _isFeatured_extraInitializers), __runInitializers(this, _seo_initializers, void 0));
            __runInitializers(this, _seo_extraInitializers);
        }
        Object.defineProperty(Post_1.prototype, "readingTime", {
            // Virtual for reading time
            get: function () {
                var wordsPerMinute = 200;
                var wordCount = this.content.split(/\s+/).length;
                return Math.ceil(wordCount / wordsPerMinute);
            },
            enumerable: false,
            configurable: true
        });
        Post_1._OPENAPI_METADATA_FACTORY = function () {
            return { title: { required: true, type: function () { return String; } }, content: { required: true, type: function () { return String; } }, excerpt: { required: false, type: function () { return String; } }, author: { required: true, type: function () { return require("../../users/schemas/user.schema").User; } }, status: { required: true, enum: require("./post.schema").PostStatus }, tags: { required: true, type: function () { return [String]; } }, categories: { required: true, type: function () { return [String]; } }, viewCount: { required: true, type: function () { return Number; } }, likeCount: { required: true, type: function () { return Number; } }, publishedAt: { required: false, type: function () { return Date; } }, featuredImage: { required: false, type: function () { return String; } }, images: { required: true, type: function () { return [String]; } }, parentPost: { required: false, type: function () { return require("./post.schema").Post; } }, isFeatured: { required: true, type: function () { return Boolean; } }, seo: { required: true, type: function () { return ({ metaTitle: { required: false, type: function () { return String; } }, metaDescription: { required: false, type: function () { return String; } }, keywords: { required: false, type: function () { return [String]; } } }); } } };
        };
        return Post_1;
    }());
    __setFunctionName(_classThis, "Post");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _content_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _excerpt_decorators = [(0, mongoose_1.Prop)()];
        _author_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true })];
        _status_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: PostStatus,
                default: PostStatus.DRAFT,
            })];
        _tags_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _categories_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _viewCount_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _likeCount_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _publishedAt_decorators = [(0, mongoose_1.Prop)()];
        _featuredImage_decorators = [(0, mongoose_1.Prop)()];
        _images_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _parentPost_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Post' })];
        _isFeatured_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _seo_decorators = [(0, mongoose_1.Prop)({ type: Object, default: {} })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _excerpt_decorators, { kind: "field", name: "excerpt", static: false, private: false, access: { has: function (obj) { return "excerpt" in obj; }, get: function (obj) { return obj.excerpt; }, set: function (obj, value) { obj.excerpt = value; } }, metadata: _metadata }, _excerpt_initializers, _excerpt_extraInitializers);
        __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: function (obj) { return "author" in obj; }, get: function (obj) { return obj.author; }, set: function (obj, value) { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: function (obj) { return "categories" in obj; }, get: function (obj) { return obj.categories; }, set: function (obj, value) { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
        __esDecorate(null, null, _viewCount_decorators, { kind: "field", name: "viewCount", static: false, private: false, access: { has: function (obj) { return "viewCount" in obj; }, get: function (obj) { return obj.viewCount; }, set: function (obj, value) { obj.viewCount = value; } }, metadata: _metadata }, _viewCount_initializers, _viewCount_extraInitializers);
        __esDecorate(null, null, _likeCount_decorators, { kind: "field", name: "likeCount", static: false, private: false, access: { has: function (obj) { return "likeCount" in obj; }, get: function (obj) { return obj.likeCount; }, set: function (obj, value) { obj.likeCount = value; } }, metadata: _metadata }, _likeCount_initializers, _likeCount_extraInitializers);
        __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: function (obj) { return "publishedAt" in obj; }, get: function (obj) { return obj.publishedAt; }, set: function (obj, value) { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
        __esDecorate(null, null, _featuredImage_decorators, { kind: "field", name: "featuredImage", static: false, private: false, access: { has: function (obj) { return "featuredImage" in obj; }, get: function (obj) { return obj.featuredImage; }, set: function (obj, value) { obj.featuredImage = value; } }, metadata: _metadata }, _featuredImage_initializers, _featuredImage_extraInitializers);
        __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
        __esDecorate(null, null, _parentPost_decorators, { kind: "field", name: "parentPost", static: false, private: false, access: { has: function (obj) { return "parentPost" in obj; }, get: function (obj) { return obj.parentPost; }, set: function (obj, value) { obj.parentPost = value; } }, metadata: _metadata }, _parentPost_initializers, _parentPost_extraInitializers);
        __esDecorate(null, null, _isFeatured_decorators, { kind: "field", name: "isFeatured", static: false, private: false, access: { has: function (obj) { return "isFeatured" in obj; }, get: function (obj) { return obj.isFeatured; }, set: function (obj, value) { obj.isFeatured = value; } }, metadata: _metadata }, _isFeatured_initializers, _isFeatured_extraInitializers);
        __esDecorate(null, null, _seo_decorators, { kind: "field", name: "seo", static: false, private: false, access: { has: function (obj) { return "seo" in obj; }, get: function (obj) { return obj.seo; }, set: function (obj, value) { obj.seo = value; } }, metadata: _metadata }, _seo_initializers, _seo_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Post = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Post = _classThis;
}();
exports.Post = Post;
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
// Indexes
exports.PostSchema.index({ status: 1, publishedAt: -1 });
exports.PostSchema.index({ author: 1, createdAt: -1 });
exports.PostSchema.index({ tags: 1 });
exports.PostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
