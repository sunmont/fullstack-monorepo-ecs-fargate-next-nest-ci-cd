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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostDto = void 0;
var openapi = require("@nestjs/swagger");
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var post_schema_1 = require("../schemas/post.schema");
var CreatePostDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _excerpt_decorators;
    var _excerpt_initializers = [];
    var _excerpt_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _categories_decorators;
    var _categories_initializers = [];
    var _categories_extraInitializers = [];
    var _featuredImage_decorators;
    var _featuredImage_initializers = [];
    var _featuredImage_extraInitializers = [];
    var _publishedAt_decorators;
    var _publishedAt_initializers = [];
    var _publishedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePostDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.excerpt = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _excerpt_initializers, void 0));
                this.status = (__runInitializers(this, _excerpt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.tags = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.categories = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _categories_initializers, void 0));
                this.featuredImage = (__runInitializers(this, _categories_extraInitializers), __runInitializers(this, _featuredImage_initializers, void 0));
                this.publishedAt = (__runInitializers(this, _featuredImage_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
                __runInitializers(this, _publishedAt_extraInitializers);
            }
            CreatePostDto._OPENAPI_METADATA_FACTORY = function () {
                return { title: { required: true, type: function () { return String; }, minLength: 5, maxLength: 200 }, content: { required: true, type: function () { return String; }, minLength: 10 }, excerpt: { required: false, type: function () { return String; }, maxLength: 500 }, status: { required: false, enum: require("../schemas/post.schema").PostStatus }, tags: { required: false, type: function () { return [String]; } }, categories: { required: false, type: function () { return [String]; } }, featuredImage: { required: false, type: function () { return String; } }, publishedAt: { required: false, type: function () { return Date; } } };
            };
            return CreatePostDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: "My First Post" }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(5), (0, class_validator_1.MaxLength)(200)];
            _content_decorators = [(0, swagger_1.ApiProperty)({ example: "This is the content of my first post..." }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(10)];
            _excerpt_decorators = [(0, swagger_1.ApiProperty)({ example: "A brief excerpt about my post", required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _status_decorators = [(0, swagger_1.ApiProperty)({
                    example: "draft",
                    enum: post_schema_1.PostStatus,
                    required: false,
                    default: post_schema_1.PostStatus.DRAFT,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(post_schema_1.PostStatus)];
            _tags_decorators = [(0, swagger_1.ApiProperty)({ example: ["technology", "programming"], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _categories_decorators = [(0, swagger_1.ApiProperty)({ example: ["tutorial", "guide"], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _featuredImage_decorators = [(0, swagger_1.ApiProperty)({
                    example: "https://example.com/featured-image.jpg",
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _publishedAt_decorators = [(0, swagger_1.ApiProperty)({
                    example: "",
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _excerpt_decorators, { kind: "field", name: "excerpt", static: false, private: false, access: { has: function (obj) { return "excerpt" in obj; }, get: function (obj) { return obj.excerpt; }, set: function (obj, value) { obj.excerpt = value; } }, metadata: _metadata }, _excerpt_initializers, _excerpt_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: function (obj) { return "categories" in obj; }, get: function (obj) { return obj.categories; }, set: function (obj, value) { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
            __esDecorate(null, null, _featuredImage_decorators, { kind: "field", name: "featuredImage", static: false, private: false, access: { has: function (obj) { return "featuredImage" in obj; }, get: function (obj) { return obj.featuredImage; }, set: function (obj, value) { obj.featuredImage = value; } }, metadata: _metadata }, _featuredImage_initializers, _featuredImage_extraInitializers);
            __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: function (obj) { return "publishedAt" in obj; }, get: function (obj) { return obj.publishedAt; }, set: function (obj, value) { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePostDto = CreatePostDto;
