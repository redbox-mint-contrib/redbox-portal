"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    class WorkspaceAsync extends controller.Controllers.Core.Controller {
        constructor() {
            super(...arguments);
            this._exportedMethods = [
                'start',
                'loop',
                'status'
            ];
        }
        start(req, res) {
            const name = req.param('name');
            const recordType = req.param('recordType');
            const username = req.username;
            const method = req.param('method');
            const service = req.param('service');
            const args = req.param('args');
            return WorkspaceAsyncService.start({ name, recordType, username, service, method, args })
                .subscribe(response => {
                this.ajaxOk(req, res, null, {});
            }, error => {
                sails.log.error(error);
                this.ajaxFail(req, res, 'Error registering async workspace', error);
            });
        }
        status(req, res) {
            const status = req.param('status');
            const recordType = req.param('recordType');
            return WorkspaceAsyncService.status({ status, recordType })
                .subscribe(response => {
                this.ajaxOk(req, res, null, response);
            }, error => {
                sails.log.error(error);
                this.ajaxFail(req, res, 'Error checking status async workspace', error);
            });
        }
    }
    Controllers.WorkspaceAsync = WorkspaceAsync;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
