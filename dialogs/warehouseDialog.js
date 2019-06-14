// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');
const { CardFactory } = require('botbuilder-core');
const WarehouseCard = require('../bots/resources/warehouseCard.json');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class WarehouseDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'WarehouseDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.locationStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async locationStep(stepContext) {
        const luisDetails = stepContext.options;
        luisDetails.date = stepContext.result;

        console.log("STEP: Execute warehouse location step");

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


        var whdata = {
            "_id" : "5d02c5cf50dbb7bac02bd101",
            "stlocID" : 110,
            "displayName" : "110",
            "identifier" : "110",
            "phone" : "(425) 313-0965 ",
            "fax" : "",
            "address1" : "1801 10TH AVE NW",
            "city" : "ISSAQUAH",
            "state" : "WA",
            "country" : "US",
            "zipCode" : "98027-5384",
            "manager" : "STACEY JIMENEZ",
            "openDate" : "Sep 9, 1994",
            "tiresDepartmentPhone" : "(425) 313-0965",
            "distance" : 0,
            "latitude" : 47.551,
            "longitude" : -122.05,
            "parentGeoNodeID" : 10935,
            "active" : 1,
            "languageID" : -1,
            "hasGasDepartment" : true,
            "hasTiresDepartment" : true,
            "hasFoodDepartment" : true,
            "hasHearingDepartment" : true,
            "hasPharmacyDepartment" : true,
            "hasOpticalDepartment" : true,
            "hasBusinessDepartment" : false,
            "hasPhotoCenterDepartment" : true,
            "warehouseHours" : [
                "M-F 10:00am - 8:30pm",
                "Sat. 9:30am - 6:00pm",
                "Sun. 10:00am - 6:00pm"
            ],
            "pharmacyHours" : [
                "M-F 10:00-8:30",
                "SAT 9:30-6:00",
                "SUN CLOSED"
            ],
            "upcomingHolidays" : [
                {
                    "holidayName" : "Independence Day",
                    "holidayDate" : "7/4",
                    "holidayCode" : "closed",
                    "holidayHours" : "None"
                }
            ],
            "gasStationHours" : [
                {
                    "title" : "Mon-Fri. ",
                    "code" : "open",
                    "time" : "6:00am - 9:30pm"
                },
                {
                    "title" : "Sat. ",
                    "code" : "open",
                    "time" : "7:00am - 7:00pm"
                },
                {
                    "title" : "Sun. ",
                    "code" : "open",
                    "time" : "7:00am - 7:00pm"
                }
            ],
            "tireCenterHours" : [
                {
                    "title" : "Mon-Fri. ",
                    "code" : "open",
                    "time" : "9:00am - 8:30pm"
                },
                {
                    "title" : "Sat. ",
                    "code" : "open",
                    "time" : "9:00am - 6:00pm"
                },
                {
                    "title" : "Sun. ",
                    "code" : "open",
                    "time" : "9:00am - 6:00pm"
                }
            ],
            "coreServices" : [
                {
                    "name" : "Gas Station",
                    "localizedName" : "Gas Station",
                    "phone" : " "
                },
                {
                    "name" : "Food Court",
                    "localizedName" : "Food Court",
                    "phone" : "(425) 391-1731 "
                },
                {
                    "name" : "Hearing Aids",
                    "localizedName" : "Hearing Aids",
                    "phone" : "(425) 369-6732 "
                },
                {
                    "name" : "Optical Department",
                    "localizedName" : "Optical Department",
                    "phone" : "(425) 313-9232 "
                },
                {
                    "name" : "Pharmacy",
                    "localizedName" : "Pharmacy",
                    "phone" : "(425) 313-9200 "
                },
                {
                    "name" : "Photo Center",
                    "localizedName" : "Photo Center",
                    "phone" : "(425) 369-6730 "
                },
                {
                    "name" : "Tire Service Center",
                    "localizedName" : "Tire Service Center",
                    "phone" : "(425) 313-0965 "
                }
            ],
            "specialtyDepartments" : [
                {
                    "name" : "Auto Buying Program",
                    "localizedName" : "Auto Buying Program",
                    "phone" : " "
                },
                {
                    "name" : "Bakery",
                    "localizedName" : "Bakery",
                    "phone" : " "
                },
                {
                    "name" : "Executive Membership",
                    "localizedName" : "Executive Membership",
                    "phone" : " "
                },
                {
                    "name" : "Fresh Deli",
                    "localizedName" : "Fresh Deli",
                    "phone" : " "
                },
                {
                    "name" : "Fresh Meat",
                    "localizedName" : "Fresh Meat",
                    "phone" : " "
                },
                {
                    "name" : "Fresh Produce",
                    "localizedName" : "Fresh Produce",
                    "phone" : " "
                },
                {
                    "name" : "Gas Station",
                    "localizedName" : "Gas Station",
                    "phone" : " "
                },
                {
                    "name" : "Independent Optometrist",
                    "localizedName" : "Independent Optometrist",
                    "phone" : "(425) 369-6726 "
                },
                {
                    "name" : "Inkjet Cartridge Refill",
                    "localizedName" : "Inkjet Cartridge Refill",
                    "phone" : " "
                },
                {
                    "name" : "Membership",
                    "localizedName" : "Membership",
                    "phone" : "(425) 313-0965 "
                },
                {
                    "name" : "Photo Center",
                    "localizedName" : "Photo Center",
                    "phone" : "(425) 369-6730 "
                },
                {
                    "name" : "Special Order Kiosk",
                    "localizedName" : "Special Order Kiosk",
                    "phone" : " "
                }
            ],
            "locationName" : "Issaquah",
            "isShipToWarehouse" : true,
            "isWarehousePickup" : true,
            "enableShipToHome" : false,
            "_class" : "com.kraken.services.warehouse.data.Warehouse"
        }

        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (stepContext.result) {
          
            let warehouseCard = CardFactory.adaptiveCard(WarehouseCard);
    
            console.log("WAREHOUSE CARD :: " + JSON.stringify(warehouseCard));

            let wc = warehouseCard.content;
            wc.body[0].text = "Warehouse " + whdata.displayName;
            wc.body[1].text = whdata.address1 + " " + whdata.city + " " + whdata.state;
            wc.body[2].text = whdata.phone;

            let wcHours = warehouseCard.content.body[3].columns[0].items;

            for(var i=0;i<whdata.warehouseHours.length;i++){
                wcHours.push({
                    "type": "TextBlock",
                    "text": whdata.warehouseHours[i],
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

            for(var i=0;i<whdata.pharmacyHours.length;i++){
                wcHours.push({
                    "type": "TextBlock",
                    "text": whdata.pharmacyHours[i],
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                })
            }

            let wcServices = warehouseCard.content.body[3].columns[1].items;

            for(var i=0;i<whdata.coreServices.length;i++){
                wcServices.push({
                    "type": "TextBlock",
                    "text": whdata.coreServices[i].localizedName,
                    "size": "small",
                    "weight":"regular",
                    "spacing": "none"
                })
            }

            /*var lunchItems = [];
            for(var i=0;i<data.menuItems.length;i++){
                lunchItems.push({"title" : data.menuItems[i].type, "value" : data.menuItems[i].name});
            }
    
            warehouseCard.content.body[0].facts = lunchItems*/
    
            return await stepContext.context.sendActivity({ attachments: [warehouseCard] });
        
        }

        return await stepContext.endDialog();
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.WarehouseDialog = WarehouseDialog;
