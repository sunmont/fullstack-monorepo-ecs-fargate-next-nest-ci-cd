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
exports.UpdateUserDto = void 0;
var openapi = require("@nestjs/swagger");
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var user_schema_1 = require("../schemas/user.schema");
var UpdateUserDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _profilePicture_decorators;
    var _profilePicture_initializers = [];
    var _profilePicture_extraInitializers = [];
    var _preferences_decorators;
    var _preferences_initializers = [];
    var _preferences_extraInitializers = [];
    var _isVerified_decorators;
    var _isVerified_initializers = [];
    var _isVerified_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUserDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.name = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.role = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.profilePicture = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _profilePicture_initializers, void 0));
                this.preferences = (__runInitializers(this, _profilePicture_extraInitializers), __runInitializers(this, _preferences_initializers, void 0));
                this.isVerified = (__runInitializers(this, _preferences_extraInitializers), __runInitializers(this, _isVerified_initializers, void 0));
                __runInitializers(this, _isVerified_extraInitializers);
            }
            UpdateUserDto._OPENAPI_METADATA_FACTORY = function () {
                return { email: { required: false, type: function () { return String; }, format: "email" }, name: { required: false, type: function () { return String; }, minLength: 2, maxLength: 100 }, role: { required: false, enum: require("../schemas/user.schema").UserRole }, profilePicture: { required: false, type: function () { return String; } }, preferences: { required: false, type: function () { return [String]; } }, isVerified: { required: false, type: function () { return Boolean; } } };
            };
            return UpdateUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, swagger_1.ApiProperty)({ example: 'user@example.com', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'John Doe Updated', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _role_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'admin',
                    enum: user_schema_1.UserRole,
                    required: false
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(user_schema_1.UserRole)];
            _profilePicture_decorators = [(0, swagger_1.ApiProperty)({ example: 'https://example.com/new-avatar.jpg', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _preferences_decorators = [(0, swagger_1.ApiProperty)({ example: ['tech', 'programming'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)({ each: true })];
            _isVerified_decorators = [(0, swagger_1.ApiProperty)({ example: true, required: false }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _profilePicture_decorators, { kind: "field", name: "profilePicture", static: false, private: false, access: { has: function (obj) { return "profilePicture" in obj; }, get: function (obj) { return obj.profilePicture; }, set: function (obj, value) { obj.profilePicture = value; } }, metadata: _metadata }, _profilePicture_initializers, _profilePicture_extraInitializers);
            __esDecorate(null, null, _preferences_decorators, { kind: "field", name: "preferences", static: false, private: false, access: { has: function (obj) { return "preferences" in obj; }, get: function (obj) { return obj.preferences; }, set: function (obj, value) { obj.preferences = value; } }, metadata: _metadata }, _preferences_initializers, _preferences_extraInitializers);
            __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: function (obj) { return "isVerified" in obj; }, get: function (obj) { return obj.isVerified; }, set: function (obj, value) { obj.isVerified = value; } }, metadata: _metadata }, _isVerified_initializers, _isVerified_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUserDto = UpdateUserDto;
