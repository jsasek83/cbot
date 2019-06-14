const request = require('request');
const {
  ConfirmPrompt,
  TextPrompt,
  WaterfallDialog
} = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder-core');
const HeroCard = require('../bots/resources/heroCard.json');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class NavigationDialog extends CancelAndHelpDialog {
  constructor(id) {
    super(id || 'NavigationDialog');
    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
      .addDialog(
        new WaterfallDialog(WATERFALL_DIALOG, [
          NavigationDialog.gatherStartAndDestination,
          NavigationDialog.navigationService
        ])
      );
    this.initialDialogId = WATERFALL_DIALOG;
  }

  /**
   * Attempts to fetch the destination from the utterance. If one isn't
   * found, prompts the user to provide one.
   *
   * @static
   * @param {*} stepContext
   * @memberof NavigationDialog
   */
  static async gatherStartAndDestination(stepContext) {
    const luisDetails = stepContext.options;
    const destination = NavigationDialog.getDestination(luisDetails);
    if (typeof destination === 'undefined') {
      // If for any reason, destination can't be parsed from the
      // chat, prompt the user, which ends up in stepContext.result
      // in the next step.
      return await stepContext.prompt(TEXT_PROMPT, {
        prompt: 'Where would you like to go? (6601-6618)'
      });
    }
    return await stepContext.next(luisDetails);
  }

  /**
   * Makes the request to the navigation service, and then sends back
   * a card representing the map.
   *
   * @static
   * @param {*} stepContext
   * @memberof NavigationDialog
   */
  static async navigationService(stepContext) {
    const luisDetails = stepContext.options;
    const startLocation = NavigationDialog.getStartLocation(luisDetails);
    const destination =
      NavigationDialog.getDestination(luisDetails) || stepContext.result;
    await stepContext.context.sendActivity(
      'Please wait while I navigate you to your destination..'
    );
    const response = await NavigationDialog.makeRequest(
      startLocation,
      destination
    );

    if (response && response.mapURI) {
      const heroCard = CardFactory.adaptiveCard(HeroCard);
      heroCard.content.body[0].url = response.mapURI;
      heroCard.content.body[1].text = '';
      await stepContext.context.sendActivity({ attachments: [heroCard] });
    } else {
      await stepContext.context.sendActivity(
        `Oof. I couldn\'t get directions to ${destination}.`
      );
    }
    return await stepContext.endDialog();
  }

  /**
   * Returns the destination from the entities object.
   *
   * @static
   * @param {Object} luisDetails
   * @returns {String} The destination the user is seeking
   * @memberof NavigationDialog
   */
  static getDestination(luisDetails) {
    // Destination can be destination, name, personName, or num.
    const destinationArray =
      (luisDetails && luisDetails.destination) ||
      (luisDetails && luisDetails.name) ||
      (luisDetails && luisDetails.personName) ||
      (luisDetails && luisDetails.num);
    return Array.isArray(destinationArray) ? destinationArray[0] : undefined;
  }

  /**
   * Returns the startLocation from the entities object.
   *
   * @static
   * @param {Object} luisDetails
   * @returns {String} The startLocation from the user
   * @memberof NavigationDialog
   */
  static getStartLocation(luisDetails) {
    // Start location is startLocation
    const startLocation = luisDetails && luisDetails.startLocation;
    return Array.isArray(startLocation) ? startLocation[0] : undefined;
  }

  /**
   * Makes the actual request to the navigation service
   *
   * @static
   * @param {*} start If no starting location, sends ''
   * @param {*} end The destination location
   * @returns
   * @memberof NavigationDialog
   */
  static makeRequest(start, end) {
    const s = start || '';
    const e = end || '';
    return new Promise((resolve, reject) => {
      const url = `https://krakennavigation.azurewebsites.net/services/v1/Direction?startLocName=${s}&endLocName=${e}`;
      request(
        {
          url,
          headers: {
            correlationId: 'xyz'
          }
        },
        (error, response, body) => {
          console.log(
            `navigationDialog.js.makeRequest: Status`,
            response.statusCode
          );
          if (!error && response.statusCode === 200) {
            const navigationObj = JSON.parse(body);
            resolve(navigationObj);
          }
          reject(error);
        }
      );
    });
  }
}

module.exports.NavigationDialog = NavigationDialog;
