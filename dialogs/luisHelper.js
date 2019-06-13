// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { LuisRecognizer } = require('botbuilder-ai');

class LuisHelper {
    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {*} logger
     * @param {TurnContext} context
     */
    static async executeLuisQuery(logger, context) {
        const luisDetails = {};

        try {
            const recognizer = new LuisRecognizer({
                applicationId: process.env.LuisAppId,
                endpointKey: process.env.LuisAPIKey,
                endpoint: `https://${ process.env.LuisAPIHostName }`
            }, {}, true);

            const recognizerResult = await recognizer.recognize(context);

            const intent = LuisRecognizer.topIntent(recognizerResult);

            luisDetails.intent = intent;

            console.log("====Recognizer Results=====");
            console.log(JSON.stringify(recognizerResult.entities));

            if (intent === 'findMenu') {

                /* Samples Data
                {"$instance":{"RestaurantReservation_Time":[{"startIndex":19,"endIndex":24,"score":0.6839417,"text":"today","type":"RestaurantReservation.Time"}],"datetime":[{"startIndex":19,"endIndex":24,"text":"today","type":"builtin.datetimeV2.date"}]},"RestaurantReservation_Time":["today"],"datetime":[{"type":"date","timex":["2019-06-12"]}]}
                */

                luisDetails.date = LuisHelper.parseDatetimeEntity(recognizerResult);
                luisDetails.menuType = LuisHelper.parseSimpleEntity(recognizerResult,"menuType");
                luisDetails.location = LuisHelper.parseSimpleEntity(recognizerResult, "number");

            }

            if (intent === 'navigation') {
              luisDetails.destination = 
                LuisHelper.parseSimpleEntity(recognizerResult,"Destination");
              luisDetails.name = LuisHelper.parseSimpleEntity(recognizerResult,"Name");
              luisDetails.startLocation = 
                LuisHelper.parseSimpleEntity(recognizerResult,"startLocation");
              luisDetails.num = LuisHelper.parseSimpleEntity(recognizerResult, "number");
              luisDetails.personName = 
                LuisHelper.parseSimpleEntity(recognizerResult,"personName");
            }

            console.log("====LUIS DETAILS=====");
            console.log(JSON.stringify(luisDetails));

        } catch (err) {
            logger.warn(`LUIS Exception: ${ err } Check your LUIS configuration`);
        }
        return luisDetails;
    }

    static parseNumber(result, simpleName) {
        const simpleEntity = result.entities[simpleName];
        if (!simpleEntity) return undefined;

        console.log("Found Entity :: " + simpleEntity);

        return simpleEntity;
    }

    static parseSimpleEntity(result, simpleName) {
        const simpleEntity = result.entities[simpleName];
        if (!simpleEntity) return undefined;

        console.log("Found Entity :: " + simpleEntity);

        return simpleEntity;
    }

    static parseCompositeEntity(result, compositeName, entityName) {
        const compositeEntity = result.entities[compositeName];
        if (!compositeEntity || !compositeEntity[0]) return undefined;

        const entity = compositeEntity[0][entityName];
        if (!entity || !entity[0]) return undefined;

        const entityValue = entity[0][0];
        return entityValue;
    }

    static parseDatetimeEntity(result) {
        const datetimeEntity = result.entities['datetime'];
        if (!datetimeEntity || !datetimeEntity[0]) return undefined;

        const timex = datetimeEntity[0]['timex'];
        if (!timex || !timex[0]) return undefined;

        const datetime = timex[0].split('T')[0];
        return datetime;
    }
}

module.exports.LuisHelper = LuisHelper;
