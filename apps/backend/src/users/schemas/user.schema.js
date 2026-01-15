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
exports.UserSchema = exports.User = exports.UserRole = void 0;
var openapi = require("@nestjs/swagger");
var mongoose_1 = require("@nestjs/mongoose");
var class_transformer_1 = require("class-transformer");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["MODERATOR"] = "moderator";
})(UserRole || (exports.UserRole = UserRole = {}));
var User = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true,
            toJSON: {
                transform: function (doc, ret) {
                    delete ret.password;
                    delete ret.refreshToken;
                    delete ret.__v;
                    return ret;
                },
            },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _isVerified_decorators;
    var _isVerified_initializers = [];
    var _isVerified_extraInitializers = [];
    var _verificationToken_decorators;
    var _verificationToken_initializers = [];
    var _verificationToken_extraInitializers = [];
    var _resetPasswordToken_decorators;
    var _resetPasswordToken_initializers = [];
    var _resetPasswordToken_extraInitializers = [];
    var _resetPasswordExpires_decorators;
    var _resetPasswordExpires_initializers = [];
    var _resetPasswordExpires_extraInitializers = [];
    var _refreshToken_decorators;
    var _refreshToken_initializers = [];
    var _refreshToken_extraInitializers = [];
    var _lastLogin_decorators;
    var _lastLogin_initializers = [];
    var _lastLogin_extraInitializers = [];
    var _profilePicture_decorators;
    var _profilePicture_initializers = [];
    var _profilePicture_extraInitializers = [];
    var _preferences_decorators;
    var _preferences_initializers = [];
    var _preferences_extraInitializers = [];
    var User = _classThis = /** @class */ (function () {
        function User_1() {
            this.email = __runInitializers(this, _email_initializers, void 0);
            this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.name = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.role = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.isVerified = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _isVerified_initializers, void 0));
            this.verificationToken = (__runInitializers(this, _isVerified_extraInitializers), __runInitializers(this, _verificationToken_initializers, void 0));
            this.resetPasswordToken = (__runInitializers(this, _verificationToken_extraInitializers), __runInitializers(this, _resetPasswordToken_initializers, void 0));
            this.resetPasswordExpires = (__runInitializers(this, _resetPasswordToken_extraInitializers), __runInitializers(this, _resetPasswordExpires_initializers, void 0));
            this.refreshToken = (__runInitializers(this, _resetPasswordExpires_extraInitializers), __runInitializers(this, _refreshToken_initializers, void 0));
            this.lastLogin = (__runInitializers(this, _refreshToken_extraInitializers), __runInitializers(this, _lastLogin_initializers, void 0));
            this.profilePicture = (__runInitializers(this, _lastLogin_extraInitializers), __runInitializers(this, _profilePicture_initializers, void 0));
            this.preferences = (__runInitializers(this, _profilePicture_extraInitializers), __runInitializers(this, _preferences_initializers, void 0));
            __runInitializers(this, _preferences_extraInitializers);
        }
        Object.defineProperty(User_1.prototype, "fullName", {
            // Virtual for full name
            get: function () {
                return this.name;
            },
            enumerable: false,
            configurable: true
        });
        User_1._OPENAPI_METADATA_FACTORY = function () {
            return { email: { required: true, type: function () { return String; } }, password: { required: true, type: function () { return String; } }, name: { required: true, type: function () { return String; } }, role: { required: true, enum: require("./user.schema").UserRole }, isVerified: { required: true, type: function () { return Boolean; } }, verificationToken: { required: false, type: function () { return String; } }, resetPasswordToken: { required: false, type: function () { return String; } }, resetPasswordExpires: { required: false, type: function () { return Date; } }, refreshToken: { required: false, type: function () { return String; } }, lastLogin: { required: false, type: function () { return Date; } }, profilePicture: { required: false, type: function () { return String; } }, preferences: { required: true, type: function () { return [String]; } } };
        };
        return User_1;
    }());
    __setFunctionName(_classThis, "User");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _email_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _password_decorators = [(0, mongoose_1.Prop)({ required: true }), (0, class_transformer_1.Exclude)()];
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _role_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: UserRole,
                default: UserRole.USER,
            })];
        _isVerified_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _verificationToken_decorators = [(0, mongoose_1.Prop)()];
        _resetPasswordToken_decorators = [(0, mongoose_1.Prop)()];
        _resetPasswordExpires_decorators = [(0, mongoose_1.Prop)()];
        _refreshToken_decorators = [(0, mongoose_1.Prop)(), (0, class_transformer_1.Exclude)()];
        _lastLogin_decorators = [(0, mongoose_1.Prop)({ default: Date.now })];
        _profilePicture_decorators = [(0, mongoose_1.Prop)()];
        _preferences_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: function (obj) { return "isVerified" in obj; }, get: function (obj) { return obj.isVerified; }, set: function (obj, value) { obj.isVerified = value; } }, metadata: _metadata }, _isVerified_initializers, _isVerified_extraInitializers);
        __esDecorate(null, null, _verificationToken_decorators, { kind: "field", name: "verificationToken", static: false, private: false, access: { has: function (obj) { return "verificationToken" in obj; }, get: function (obj) { return obj.verificationToken; }, set: function (obj, value) { obj.verificationToken = value; } }, metadata: _metadata }, _verificationToken_initializers, _verificationToken_extraInitializers);
        __esDecorate(null, null, _resetPasswordToken_decorators, { kind: "field", name: "resetPasswordToken", static: false, private: false, access: { has: function (obj) { return "resetPasswordToken" in obj; }, get: function (obj) { return obj.resetPasswordToken; }, set: function (obj, value) { obj.resetPasswordToken = value; } }, metadata: _metadata }, _resetPasswordToken_initializers, _resetPasswordToken_extraInitializers);
        __esDecorate(null, null, _resetPasswordExpires_decorators, { kind: "field", name: "resetPasswordExpires", static: false, private: false, access: { has: function (obj) { return "resetPasswordExpires" in obj; }, get: function (obj) { return obj.resetPasswordExpires; }, set: function (obj, value) { obj.resetPasswordExpires = value; } }, metadata: _metadata }, _resetPasswordExpires_initializers, _resetPasswordExpires_extraInitializers);
        __esDecorate(null, null, _refreshToken_decorators, { kind: "field", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; }, set: function (obj, value) { obj.refreshToken = value; } }, metadata: _metadata }, _refreshToken_initializers, _refreshToken_extraInitializers);
        __esDecorate(null, null, _lastLogin_decorators, { kind: "field", name: "lastLogin", static: false, private: false, access: { has: function (obj) { return "lastLogin" in obj; }, get: function (obj) { return obj.lastLogin; }, set: function (obj, value) { obj.lastLogin = value; } }, metadata: _metadata }, _lastLogin_initializers, _lastLogin_extraInitializers);
        __esDecorate(null, null, _profilePicture_decorators, { kind: "field", name: "profilePicture", static: false, private: false, access: { has: function (obj) { return "profilePicture" in obj; }, get: function (obj) { return obj.profilePicture; }, set: function (obj, value) { obj.profilePicture = value; } }, metadata: _metadata }, _profilePicture_initializers, _profilePicture_extraInitializers);
        __esDecorate(null, null, _preferences_decorators, { kind: "field", name: "preferences", static: false, private: false, access: { has: function (obj) { return "preferences" in obj; }, get: function (obj) { return obj.preferences; }, set: function (obj, value) { obj.preferences = value; } }, metadata: _metadata }, _preferences_initializers, _preferences_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
}();
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
// Indexes
exports.UserSchema.index({ email: 1 }, { unique: true });
exports.UserSchema.index({ createdAt: -1 });
exports.UserSchema.index({ "profile.name": "text", email: "text" });
