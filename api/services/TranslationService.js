"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services = require("../core/CoreService.js");
const i18next = require("i18next");
const Backend = require("i18next-node-fs-backend");
var Services;
(function (Services) {
    class Translation extends services.Services.Core.Service {
        constructor() {
            super(...arguments);
            this._exportedMethods = [
                'bootstrap',
                't'
            ];
        }
        bootstrap() {
            sails.log.debug("#####################");
            sails.log.debug(Backend);
            sails.log.debug("#####################");
            i18next.use(Backend).init({
                preload: ['en'],
                debug: true,
                lng: 'en',
                fallbackLng: 'en',
                initImmediate: false,
                backend: {
                    loadPath: `${sails.config.appPath}/assets/locales/{{lng}}/{{ns}}.json`
                }
            }).then(i18next => {
                sails.log.debug("**************************");
                sails.log.debug("i18next initialised");
                sails.log.debug("**************************");
            });
        }
        t(key, context = null) {
            return i18next.t(key);
        }
    }
    Services.Translation = Translation;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Translation().exports();
