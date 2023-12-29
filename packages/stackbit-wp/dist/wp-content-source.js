"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WpContentSource = void 0;
var types_1 = require("@stackbit/types");
var core_1 = require("@nextwp/core");
var WpContentSource = /** @class */ (function () {
    function WpContentSource(options) {
        this.projectId = options.projectId;
        this.wpApplicationPassword = options.wpApplicationPassword;
        this.wpUrl = options.wpUrl;
    }
    WpContentSource.prototype.getContentSourceType = function () {
        return "wordpress";
    };
    WpContentSource.prototype.getProjectId = function () {
        return this.projectId;
    };
    WpContentSource.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // initialize the content source for example, fetch the site's settings
                        // perhaps initialize the a webhook to listen for updates?
                        _a = this;
                        return [4 /*yield*/, (0, core_1.getSiteSettings)()];
                    case 1:
                        // initialize the content source for example, fetch the site's settings
                        // perhaps initialize the a webhook to listen for updates?
                        _a.settings = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WpContentSource.prototype.getVersion = function () {
        return (0, types_1.getVersion)({
            contentSourceVersion: "1.0.0",
        });
    };
    WpContentSource.prototype.getSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const models = await this.apiClient.getModels();
                // const locales = await this.apiClient.getLocales();
                // const stackbitModels = convertToStackbitModels(models);
                // const stackbitLocales = convertToStackbitLocales(locales);
                return [2 /*return*/, {
                        models: [],
                        locales: [],
                        context: {
                            customProp: "foo",
                        },
                    }];
            });
        });
    };
    WpContentSource.prototype.getDocuments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const documents = await this.apiClient.getDocuments();
                // const stackbitDocuments = convertToStackbitDocuments(documents);
                return [2 /*return*/, []];
            });
        });
    };
    WpContentSource.prototype.getAssets = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const assets = await this.apiClient.getAssets();
                // const stackbitAssets = convertToStackbitAssets(assets);
                return [2 /*return*/, []];
            });
        });
    };
    WpContentSource.prototype.getProjectManageUrl = function () {
        return "".concat(this.wpUrl, "/wp-admin");
    };
    return WpContentSource;
}());
exports.WpContentSource = WpContentSource;
