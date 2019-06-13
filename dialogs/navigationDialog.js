// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
  TimexProperty
} = require('@microsoft/recognizers-text-data-types-timex-expression');
const {
  ConfirmPrompt,
  TextPrompt,
  WaterfallDialog
} = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder-core');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
// const HeroCard = require('../bots/resources/heroCard.json');

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
        prompt:
          "Where would you like to go? (6601, <name>'s desk, bathroom, etc.)"
      });
    }
    return await stepContext.next(luisDetails);
  }

  /**
   * Makes the actual request to the navigation service.
   *
   * @static
   * @param {*} stepContext
   * @memberof NavigationDialog
   */
  static async navigationService(stepContext) {
    const luisDetails = stepContext.options;
    const startLocation = NavigationDialog.getStartLocation(luisDetails);
    const destination =
      stepContext.result || NavigationDialog.getDestination(luisDetails);
    
    
    await stepContext.context.sendActivity('Please wait while I Navigate you to your destination..');
    // https://krakennavigation.azurewebsites.net/services/v1/Direction?startLocName=6604&endLocName=6601
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
}

module.exports.NavigationDialog = NavigationDialog;
