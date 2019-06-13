// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');

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
            return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Which item would you like to return?' });
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

        var msg = "Is the correct item you plan to return?";
       
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async quantityStep(stepContext) {
        const luisDetails = stepContext.options;

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
            const msg = `Searching our database for menus at ${ result.location } on ${ travelDateMsg }.`;
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
