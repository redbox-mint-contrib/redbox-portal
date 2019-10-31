"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = require("rxjs/Rx");
const services = require("../core/CoreService.js");
require("rxjs/add/operator/toPromise");
const request = require("request-promise");
const datacrate = require('datacrate').catalog;
var Services;
(function (Services) {
    class Doi extends services.Services.Core.Service {
        constructor() {
            super(...arguments);
            this._exportedMethods = [
                'publishDoi'
            ];
        }
        publishDoi(oid, record, options) {
            if (this.metTriggerCondition(oid, record, options) === "true") {
                let apiEndpoints = {
                    create: _.template('<%= baseUrl%>mint.json/?app_id=<%= apiKey%>&url=<%= url%>'),
                };
                let mappings = options.mappings;
                let xmlElements = {
                    wrapper: _.template('<resource xmlns="http://datacite.org/schema/kernel-4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.1/metadata.xsd">\n<%= xml %></resource>'),
                    id: _.template('<identifier identifierType="DOI"><%= doi %></identifier>\n'),
                    title: _.template('<titles><title><%= title %></title></titles>\n'),
                    publisher: _.template('<publisher><%= publisher %></publisher>\n'),
                    pubYear: _.template('<publicationYear><%= pubYear %></publicationYear>\n'),
                    resourceType: _.template('<resourceType resourceTypeGeneral="<%= resourceType %>"><%= resourceText %></resourceType>\n'),
                    creator: _.template('<creator><creatorName><%= creatorName %></creatorName></creator>\n'),
                    creatorWrapper: _.template('<creators>\n<%= creators %></creators>\n')
                };
                let xmlString = "";
                xmlString += xmlElements.id({ doi: "10.0/0" });
                let creators = _.get(record, mappings.creators);
                if (creators === null || creators.length == 0) {
                    return;
                }
                else {
                    let creatorString = "";
                    _.each(creators, creator => {
                        creatorString += xmlElements.creator({ creatorName: creator });
                    });
                    xmlString += xmlElements.creatorWrapper({ creators: creatorString });
                }
                let title = _.get(record, mappings.creators);
                if (title == null || title.trim() == "") {
                    return;
                }
                else {
                    xmlString += xmlElements.title({ title: title });
                }
                let publisher = _.get(record, mappings.publisher);
                if (publisher == null || publisher.trim() == "") {
                    return;
                }
                else {
                    xmlString += xmlElements.publisher({ publisher: publisher });
                }
                let pubYear = _.get(record, mappings.publicationYear);
                if (pubYear == null || pubYear.trim() == "") {
                    return;
                }
                else {
                    xmlString += xmlElements.pubYear({ pubYear: pubYear });
                }
                let resourceType = _.get(record, mappings.resourceType);
                let resourceTypeText = _.get(record, mappings.resourceTypeText);
                if (resourceType == null || resourceType.trim() == "") {
                    return;
                }
                else {
                    if (resourceTypeText == null || resourceTypeText == "null") {
                        resourceTypeText = "";
                    }
                    xmlString += xmlElements.resourceType({ resourceType: resourceType, resourceText: resourceTypeText });
                }
                let xml = xmlElements.wrapper({ xml: xmlString });
                let statusUrl = apiEndpoints.create({ baseUrl: options.baseUrl, apiKey: options.apiKey, url: options.url });
                request.get({ url: statusUrl, body: xml }).then(resp => { sails.log.debug(resp); });
                return Rx_1.Observable.of(null);
            }
            else {
                sails.log.info(`Not sending notification log for: ${oid}, condition not met: ${_.get(options, "triggerCondition", "")}`);
                return Rx_1.Observable.of(null);
            }
        }
    }
    Services.Doi = Doi;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Doi().exports();
