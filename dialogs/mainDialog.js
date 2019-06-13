// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { DeliDialog } = require('./deliDialog');
const { ReturnItemDialog } = require('./returnItemDialog');
const { NavigationDialog } = require('./navigationDialog');
const { LuisHelper } = require('./luisHelper');
const { CardFactory } = require('botbuilder-core');
const WelcomeCard = require('../bots/resources/welcomeCard.json');
const GratitudeCard = require('../bots/resources/gratitudeCard.json');
const HeroCard = require('../bots/resources/heroCard.json');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const DELI_DIALOG = 'deliDialog';
const RETURN_ITEM_DIALOG = 'returnItemDialog';
const NAVIGATION_DIALOG = 'navigationDialog';

class MainDialog extends ComponentDialog {
    constructor(logger) {
        super('MainDialog');

        if (!logger) {
            logger = console;
            logger.log('[MainDialog]: logger not passed in, defaulting to console');
        }

        this.logger = logger;

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(new DeliDialog(DELI_DIALOG))
            .addDialog(new ReturnItemDialog(RETURN_ITEM_DIALOG))
            .addDialog(new NavigationDialog(NAVIGATION_DIALOG))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.actStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }


    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} dialogContext
     */
    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
     * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
     */
    async introStep(stepContext) {
        if (!process.env.LuisAppId || !process.env.LuisAPIKey || !process.env.LuisAPIHostName) {
            await stepContext.context.sendActivity('NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.');
            return await stepContext.next();
        }

        return await stepContext.prompt('TextPrompt', { prompt: 'What can I help you with today?\nSay something like "Start the Ninjas Quest"' });
    }

    async translateRequest(query, stepContext){

        const request = require('request');
        const uuidv4 = require('uuid/v4');

        let options = {
            method: 'POST',
            baseUrl: 'https://api.cognitive.microsofttranslator.com/',
            url: 'translate',
            qs: {
            'api-version': '3.0',
            'to': ['en']
            },
            headers: {
            'Ocp-Apim-Subscription-Key': "e08cdf27666143aaba6ecf70eeb8922c",
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
            },
            body: [{
                'text':query 
            }],
            json: true,
        };

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

        try {
            var body = await doRequest(options);
            console.log(JSON.stringify(body));

            if(body[0].detectedLanguage.language != 'en'){
                console.log("TRANSLATION REQUIRED :: " + body[0].detectedLanguage.language);
                stepContext.context.sendActivity("Translated your question to \" " + String(body[0].translations[0].text).trim() + "\"");
                return String(body[0].translations[0].text);
            }

            return query;
        } catch (error) {
            console.log("TRANSLATION ERROR!!" + error);

            return query;
        }

        return query;

    }

    /**
     * Second step in the waterall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
     * Then, it hands off to the bookingDialog child dialog to collect any remaining details.
     */
    async actStep(stepContext) {
        let luisDetails = {};

        try {
            if(stepContext.context.activity.value.query){
                stepContext.context.activity.text = stepContext.context.activity.value.query;
            }
        } catch (error) {
            
        }

        stepContext.context.activity.text = await this.translateRequest(stepContext.context.activity.text, stepContext);

        console.log("TEXT QUERY :: " + stepContext.context.activity.text);

        if (process.env.LuisAppId && process.env.LuisAPIKey && process.env.LuisAPIHostName) {
            // Call LUIS and gather any potential booking details.
            // This will attempt to extract the origin, destination and travel date from the user's message
            // and will then pass those values into the booking dialog
            luisDetails = await LuisHelper.executeLuisQuery(this.logger, stepContext.context);

            this.logger.log('LUIS extracted these details:', luisDetails);
        }

        if(luisDetails.intent == "findMenu"){
            return await stepContext.beginDialog('deliDialog', luisDetails);
        }else if(luisDetails.intent == "greeting"){

            const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
            return await stepContext.context.sendActivity({ attachments: [welcomeCard] });

        }else if(luisDetails.intent == "gratitude"){

            const gratCard = CardFactory.adaptiveCard(GratitudeCard);
            return await stepContext.context.sendActivity({ attachments: [gratCard] });

        }else if(luisDetails.intent == "returnitem"){

            return await stepContext.beginDialog('returnItemDialog', luisDetails);

        }else if(luisDetails.intent == "laugh"){

            /*let heroCard = CardFactory.adaptiveCard(HeroCard);
    
            console.log("HERRO :: " + JSON.stringify(heroCard));
    
            heroCard.content.body[0].url = imgUrl;
            heroCard.content.body[1].text = desc;
    
            await stepContext.context.sendActivity({ attachments: [heroCard] });
           
            return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });*/

            const heroCard = CardFactory.adaptiveCard(HeroCard);
            return await stepContext.context.sendActivity({ attachments: [heroCard] });

        } else if (luisDetails.intent === "navigation") {
          return await stepContext.beginDialog('navigationDialog', luisDetails);
        }


        // In this sample we only have a single intent we are concerned with. However, typically a scenario
        // will have multiple different intents each corresponding to starting a different child dialog.

        // Run the BookingDialog giving it whatever details we have from the LUIS call, it will fill out the remainder.
        
    }

}

module.exports.MainDialog = MainDialog;
