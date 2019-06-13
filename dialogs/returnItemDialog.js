// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');
const { CardFactory } = require('botbuilder-core');
const HeroCard = require('../bots/resources/heroCard.json');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class ReturnItemDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'ReturnItemDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.itemStep.bind(this),
                this.confirmItemStep.bind(this),
                this.quantityStep.bind(this),
                this.reasonStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async itemStep(stepContext) {

        console.log("STEPCONTEXT :: " + JSON.stringify(stepContext.options));

        const luisDetails = stepContext.options;

        console.log("STEP: Execute return item step");
       
        if (!luisDetails.item) {
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Great! Please describe the item and I\'ll look it up in your online purchase history' });
        } else {
            return await stepContext.next(luisDetails.item);
        }
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async confirmItemStep(stepContext) {

        const luisDetails = stepContext.options;
        luisDetails.item = stepContext.result;

        console.log("STEP: Execute return confirm item step");

        var msg = "Is this the correct item you plan to return?";

        let request = require('request');
        let cheerio = require('cheerio');

        function doRequest(options) {
            return new Promise(function (resolve, reject) {
            request(options, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                resolve(body);
                } else {
                reject(error);
                }
            });
            });
        }

        var options = {
            url : "https://www.costco.com/CatalogSearch?dept=All&keyword=" + luisDetails.item,
            headers : {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-language": "en-US,en;q=0.9",
                "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Mobile Safari/537.36"
            }
        }
    
        let res = await doRequest(options);
    
        const $ = cheerio.load(res);

        if($('.caption .caption .description').length > 0){

            console.log($('.caption .caption .description').first().text().trim());
            console.log($('.thumbnail .product-img-holder img').first().attr('src').trim());
    
            var desc = $('.caption .caption .description').first().text().trim();
            var imgUrl = $('.thumbnail .product-img-holder img').first().attr('src').trim();
    
            let heroCard = CardFactory.adaptiveCard(HeroCard);
    
            console.log("HERRO :: " + JSON.stringify(heroCard));
    
            heroCard.content.body[0].url = imgUrl;
            heroCard.content.body[1].text = desc;
    
            await stepContext.context.sendActivity({ attachments: [heroCard] });
           
            return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });

        }else{

            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'I couldn\'t find that item in your history.  Please search again' });

        }
    

    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async quantityStep(stepContext) {
        const luisDetails = stepContext.options;

        if (stepContext.result === false) {
            return await stepContext.endDialog(luisDetails);
        }

        console.log("STEP: Execute return quantity step");

        if (!luisDetails.quantity) {
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'How many will you be returning?' });
        } else {
            return await stepContext.next(luisDetails.quantity);
        }
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async reasonStep(stepContext) {
        const luisDetails = stepContext.options;
        luisDetails.quantity = stepContext.result;

        console.log("STEP: Execute return reason step");

        if (!luisDetails.reason) {
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Why are you returning this item?' });
        } else {
            return await stepContext.next(luisDetails.reason);
        }
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    async finalStep(stepContext) {
        const luisDetails = stepContext.options;
        luisDetails.reason = stepContext.result;

        console.log("DETAILS :: " + JSON.stringify(luisDetails));

        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (stepContext.result) {
            const result = luisDetails;
            // Now we have all the booking details.

            // This is where calls to the booking AOU service or database would go.

            // If the call to the booking service was successful tell the user.
            const msg = `Thanks a UPS truck will be by shortly to pickup your return`;
            await stepContext.context.sendActivity(msg);
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

module.exports.ReturnItemDialog = ReturnItemDialog;
