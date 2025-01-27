// Copyright (c) 2017 Queensland Cyber Infrastructure Foundation (http://www.qcif.edu.au/)
//
// GNU GENERAL PUBLIC LICENSE
//    Version 2, June 1991
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

import { Observable } from 'rxjs/Rx';
import services = require('../core/CoreService.js');
import { Sails, Model } from "sails";
import 'rxjs/add/operator/toPromise';
import * as request from "request-promise";
import path = require('path');


import { Index, jsonld } from 'calcyte';
const datacrate = require('datacrate').catalog;

declare var sails: Sails;
declare var RecordsService;
declare var BrandingService;
declare var _;




export module Services {
  /**
   *
   *
   *
   * @author <a target='_' href='https://github.com/andrewbrazzatti'>Andrew Brazzatti</a>
   *
   */
  export class Doi extends services.Services.Core.Service {

  	protected _exportedMethods: any = [
  		'publishDoi'
  	];



  	public publishDoi(oid, record, options): Observable<any> {
   		if( this.metTriggerCondition(oid, record, options) === "true") {

        let apiEndpoints = {
            create: _.template('<%= baseUrl%>mint.json/?app_id=<%= apiKey%>&url=<%= url%>'),
            // update: _.template('<%= baseUrl%>update.json/?app_id=<%= apiKey%>&doi=<%= doi%>'),
            // activate: _.template('<%= baseUrl%>activate.json/?app_id=<%= apiKey%>&doi=<%= doi%>'),
            // deactivate: _.template('<%= baseUrl%>deactivate.json/?app_id=<%= apiKey%>&doi=<%= doi%>'),
            // get: _.template('<%= baseUrl%>xml.json/?doi=<%= doi%>'),
            // status: _.template('<%= baseUrl%>status.json')
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
     }

     let xmlString = "";
      xmlString += xmlElements.id({doi: "10.0/0"})

    let creators = _.get(record, mappings.creators)
    if(creators === null || creators.length == 0) {
      return;
    } else {
      let creatorString = "";
      _.each(creators, creator => {
        creatorString += xmlElements.creator({creatorName: creator});
      });
      xmlString += xmlElements.creatorWrapper({creators: creatorString})
    }


    let title = _.get(record, mappings.creators);
      if(title == null || title.trim() == "") {
          return;
      } else {
          xmlString += xmlElements.title({title:title})
      }

      let publisher =_.get(record, mappings.publisher);
        if(publisher == null || publisher.trim() == "") {
            return;
        } else {
            xmlString += xmlElements.publisher({publisher:publisher})
        }

        let pubYear = _.get(record, mappings.publicationYear);
          if(pubYear == null || pubYear.trim() == "") {
              return;
          } else {
              xmlString += xmlElements.pubYear({pubYear:pubYear})
          }

        let resourceType = _.get(record, mappings.resourceType);
        let resourceTypeText = _.get(record, mappings.resourceTypeText);
        if(resourceType == null || resourceType.trim() == "") {
            return;
        } else {
          if(resourceTypeText == null || resourceTypeText == "null") {
            resourceTypeText = ""
          }
          xmlString += xmlElements.resourceType({resourceType: resourceType, resourceText: resourceTypeText})
        }

        let xml = xmlElements.wrapper({xml: xmlString});



    let statusUrl =apiEndpoints.create({baseUrl:options.baseUrl,apiKey:options.apiKey,url: options.url});

    request.get({url:statusUrl,body: xml}).then(resp => {sails.log.debug(resp)});

				return Observable.of(null);
    	} else {
     		sails.log.info(`Not sending notification log for: ${oid}, condition not met: ${_.get(options, "triggerCondition", "")}`)
    		return Observable.of(null);
   		}
  	}



	}
}

module.exports = new Services.Doi().exports();
