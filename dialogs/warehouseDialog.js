// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const request = require('request');
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
        const location = WarehouseDialog.getLocation(luisDetails);
        if (typeof location === 'undefined') {
            return await stepContext.prompt(TEXT_PROMPT, {
                prompt:
                'Which Costco warehouse? (tell me the city, zip code, or warehouse number)'
            });
        }
        return await stepContext.next(luisDetails);
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    static async finalStep(stepContext) {
        const luisDetails = stepContext.options;
        const location = WarehouseDialog.getLocation(luisDetails) || stepContext.result;

        const param = WarehouseDialog.getParam(location);

        const warehouseData = await WarehouseDialog.makeRequest(
            location,
            param
        ).catch(error => {
            console.log('Error: ', error);
        });

        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (warehouseData && warehouseData.id) {
          
            const warehouseCard = JSON.parse(this.cardJsonString);
    
            console.log("WAREHOUSE CARD :: " + JSON.stringify(warehouseCard));

            console.log(warehouseData);
            let wc = warehouseCard.content;
            wc.body[0].text = warehouseData.locationName + " - Warehouse " + warehouseData.displayName;
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
                });
            }

            if (warehouseData.upcomingHolidays) {
                wcHours.push({
                    "type": "TextBlock",
                    "text": "\n",
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                });

                wcHours.push({
                    "type": "TextBlock",
                    "text": "Upcoming Holidays",
                    "size": "small",
                    "weight":"bolder",
                    "spacing": "none"
                });
    
                for(var i=0;i<warehouseData.upcomingHolidays.length;i++){
                    let entry = warehouseData.upcomingHolidays[i];
                    wcHours.push({
                        "type": "TextBlock",
                        "text": entry.holidayName + ' ' + entry.holidayDate + ' ' + entry.holidayCode,
                        "size": "small",
                        "weight":"regular",
                        "spacing": "none"
                    });
                }
            }

            if (warehouseData.pharmacyHours) {
                wcHours.push({
                    "type": "TextBlock",
                    "text": "\n",
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                });

                wcHours.push({
                    "type": "TextBlock",
                    "text": "Pharmacy Hours",
                    "size": "small",
                    "weight":"bolder",
                    "spacing": "none"
                });
    
                for(var i=0;i<warehouseData.pharmacyHours.length;i++){
                    wcHours.push({
                        "type": "TextBlock",
                        "text": warehouseData.pharmacyHours[i],
                        "size": "small",
                        "weight":"regular",
                        "spacing": "none"
                    });
                }
            }

            if (warehouseData.gasStationHours) {
                wcHours.push({
                    "type": "TextBlock",
                    "text": "\n",
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                });

                wcHours.push({
                    "type": "TextBlock",
                    "text": "Gas Station Hours",
                    "size": "small",
                    "weight":"bolder",
                    "spacing": "none"
                });
    
                for(var i=0;i<warehouseData.gasStationHours.length;i++){
                    let entry = warehouseData.gasStationHours[i];
                    wcHours.push({
                        "type": "TextBlock",
                        "text": entry.title + entry.time,
                        "size": "small",
                        "weight":"regular",
                        "spacing": "none"
                    });
                }
            }

            if (warehouseData.tireCenterHours) {
                wcHours.push({
                    "type": "TextBlock",
                    "text": "\n",
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                });

                wcHours.push({
                    "type": "TextBlock",
                    "text": "Tire Center Hours",
                    "size": "small",
                    "weight":"bolder",
                    "spacing": "none"
                });
    
                for(var i=0;i<warehouseData.tireCenterHours.length;i++){
                    let entry = warehouseData.tireCenterHours[i];
                    wcHours.push({
                        "type": "TextBlock",
                        "text": entry.title + entry.time,
                        "size": "small",
                        "weight":"regular",
                        "spacing": "none"
                    });
                }
            }

            let wcServices = warehouseCard.content.body[3].columns[1].items;

            if (warehouseData.coreServices) {
                for(var i=0;i<warehouseData.coreServices.length;i++){
                    wcServices.push({
                        "type": "TextBlock",
                        "text": warehouseData.coreServices[i].localizedName,
                        "size": "small",
                        "weight":"regular",
                        "spacing": "none"
                    });
                }
            }
            if (warehouseData.specialtyDepartments) {
                wcServices.push({
                    "type": "TextBlock",
                    "text": "\n",
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                });

                wcServices.push({
                    "type": "TextBlock",
                    "text": "Departments",
                    "size": "small",
                    "weight":"bolder",
                    "spacing": "none"
                });

                for(var i=0;i<warehouseData.specialtyDepartments.length;i++){
                    wcServices.push({
                        "type": "TextBlock",
                        "text": warehouseData.specialtyDepartments[i].localizedName,
                        "size": "small",
                        "weight":"regular",
                        "spacing": "none"
                    });
                }
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

    static getLocation(luisDetails) {
        const locationArray = luisDetails && luisDetails.location;
        return Array.isArray(locationArray) ? locationArray[0] : undefined;
    }
}

module.exports.WarehouseDialog = WarehouseDialog;
