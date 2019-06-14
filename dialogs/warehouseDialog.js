// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const request = require('request');
const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { CardFactory } = require('botbuilder-core');
const WarehouseCard = require('../bots/resources/warehouseCard.json');

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class WarehouseDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'WarehouseDialog');

        this.cardJsonString = JSON.stringify(CardFactory.adaptiveCard(WarehouseCard));

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                WarehouseDialog.locationStep.bind(this),
                WarehouseDialog.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    static async locationStep(stepContext) {
        const luisDetails = stepContext.options;
        luisDetails.date = stepContext.result;

        console.log("STEP: Execute warehouse location step");

        if (!luisDetails.location) {
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Which Costco warehouse? (zip code, city and state, or warehouse number)' });
        } else {
            return await stepContext.next(luisDetails.location);
        }
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    static async finalStep(stepContext) {
        const luisDetails = stepContext.options;
        luisDetails.location = stepContext.result;

        const param = WarehouseDialog.getParam(luisDetails.location);

        const warehouseData = await WarehouseDialog.makeRequest(
            luisDetails.location,
            param
        ).catch(error => {
            console.log('Error: ', error);
        });

        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (warehouseData && warehouseData.id) {
          
            const warehouseCard = JSON.parse(this.cardJsonString);
    
            console.log("WAREHOUSE CARD :: " + JSON.stringify(warehouseCard));

            let wc = warehouseCard.content;
            wc.body[0].text = "Warehouse " + warehouseData.displayName;
            wc.body[1].text = warehouseData.address1 + " " + warehouseData.city + " " + warehouseData.state;
            wc.body[2].text = warehouseData.phone;

            let wcHours = warehouseCard.content.body[3].columns[0].items;

            for(var i=0;i<warehouseData.warehouseHours.length;i++){
                wcHours.push({
                    "type": "TextBlock",
                    "text": warehouseData.warehouseHours[i],
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                })
            }

            wcHours.push({
                "type": "TextBlock",
                "text": "",
                "size": "small",
                "weight":"regular",
                "spacing": "none"
            })

            wcHours.push({
                "type": "TextBlock",
                "text": "Pharmacy Hours",
                "size": "small",
                "weight":"bolder",
                "spacing": "none"
            })

            for(var i=0;i<warehouseData.pharmacyHours.length;i++){
                wcHours.push({
                    "type": "TextBlock",
                    "text": warehouseData.pharmacyHours[i],
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                })
            }

            let wcServices = warehouseCard.content.body[3].columns[1].items;

            for(var i=0;i<warehouseData.coreServices.length;i++){
                wcServices.push({
                    "type": "TextBlock",
                    "text": warehouseData.coreServices[i].localizedName,
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                })
            }
    
            await stepContext.context.sendActivity({ attachments: [warehouseCard] });
        
        }
        else {
            await stepContext.context.sendActivity(
                `Oof. I couldn\'t get warehouse details for ${luisDetails.location}`
            );
        }

        return await stepContext.endDialog();
    }

    static makeRequest(location, param) {
        const l = location.toLowerCase() || '';
        const p = param || '';
        return new Promise((resolve, reject) => {
            const url = `https://kraken-services.azurewebsites.net/warehouse?${p}=${l}`;
            request(
                {
                    url
                },
                (error, response, body) => {
                    console.log(
                        `warehouseDialog.js.makeRequest: URL`,
                        url
                    )
                    console.log(
                        `warehouseDialog.js.makeRequest: Status`,
                        response.statusCode
                    );
                    if (!error && response.statusCode === 200) {
                        const warehouseData = JSON.parse(body);
                        resolve(warehouseData);
                    }
                    reject(error);
                }
            )
        })
    }

    /**
     * Returns the type for the given location.
     * (warehouseNumber, city, or zipCode)
     * 
     * @param {String} location 
     * @returns {String} the param
     */
    static getParam(location) {
        console.log('location is ', location);
        if (/^\d{1,4}$/.test(location)) {
            return "warehouseNumber";
        }
        else if (/^\d{5}/.test(location)) {
            return "zipCode";
        }
        else if (/\w{3,}/.test(location)) {
            return "city";
        }
        else {
            return undefined;
        }
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.WarehouseDialog = WarehouseDialog;
