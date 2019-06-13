// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');
const { CardFactory } = require('botbuilder-core');
const LunchCard = require('../bots/resources/lunchCard.json');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class DeliDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'DeliDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.dateStep.bind(this),
                this.locationStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async dateStep(stepContext) {

        console.log("STEPCONTEXT :: " + JSON.stringify(stepContext.options));

        const luisDetails = stepContext.options;

        console.log("STEP: Execute deli date step");
       
        if (!luisDetails.date) {
            return await stepContext.next(new Date(Date.now()));
        } else {
            return await stepContext.next(luisDetails.date);
        }
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async locationStep(stepContext) {
        const luisDetails = stepContext.options;
        luisDetails.date = stepContext.result;

        console.log("STEP: Execute deli location step");

        if (!luisDetails.location) {
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Which Costco building?' });
        } else {
            return await stepContext.next(luisDetails.location);
        }
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    async finalStep(stepContext) {
        const luisDetails = stepContext.options;
        luisDetails.location = stepContext.result;

        console.log("DETAILS :: " + JSON.stringify(luisDetails));

        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (stepContext.result) {
            const result = luisDetails;
            // Now we have all the booking details.

            // This is where calls to the booking AOU service or database would go.

            // If the call to the booking service was successful tell the user.
            const timeProperty = new TimexProperty(result.date);
            const travelDateMsg = timeProperty.toNaturalLanguage(new Date(Date.now()));

            const { MongoDbHelper } = require('./mongoDbHelper');

            var mh = new MongoDbHelper();

            const msg = `Searching our database for menus at ${ result.location } for ${ travelDateMsg }.`;
            stepContext.context.sendActivity(msg);

            var dateString = "";
            if(travelDateMsg.toLowerCase().indexOf('toda') > -1){
                dateString += new Date(Date.now()).getMonth() + 1;
                dateString += "/";
                dateString += new Date(Date.now()).getDate();
                dateString += "/";
                dateString += new Date(Date.now()).getFullYear();
            }else if(travelDateMsg.toLowerCase().indexOf('tomorr') > -1){
                var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                dateString += tomorrowDate.getMonth() + 1;
                dateString += "/";
                dateString += tomorrowDate.getDate();
                dateString += "/";
                dateString += tomorrowDate.getFullYear();
            }

            var buildingNumber = String(result.location).match(/\d+/)[0];
            var query = {"date" : dateString, "location" : {$regex: buildingNumber}};

            console.log("DELI QUERY :: " + JSON.stringify(query));

            var data = await mh.queryDeli(query);

            if(data == null){
                await stepContext.context.sendActivity("Sorry I couldn't find any data for that location and time, please try again");
            }else{

                let lunchCard = CardFactory.adaptiveCard(LunchCard);
    
                console.log("LUNCH CARD :: " + JSON.stringify(lunchCard));

                var lunchItems = [];
                for(var i=0;i<data.menuItems.length;i++){
                    lunchItems.push({"title" : data.menuItems[i].type, "value" : data.menuItems[i].name});
                }
        
                lunchCard.content.body[0].facts = lunchItems;
        
                return await stepContext.context.sendActivity({ attachments: [lunchCard] });
            }

        } else {
            await stepContext.context.sendActivity('Feel free to ask me something about warehouse hours or office locations.');
        }
        return await stepContext.endDialog();
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.DeliDialog = DeliDialog;
