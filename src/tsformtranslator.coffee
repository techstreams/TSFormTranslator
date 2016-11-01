###
* Copyright Laura Taylor
* (https://github.com/techstreams/TSFormTranslator)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
###

###
 * Add a custom menu to the active form
###
`function onOpen() {
  FormApp.getUi()
      .createMenu('TSFormTranslator')
      .addItem('Open sidebar', 'openSidebar')
      .addItem('Clear form', 'clearForm')
      .addSeparator()
      .addItem('About', 'about')
      .addToUi();
}`

###
 * Open TSFormTranslator sidebar
###
`function openSidebar() {
  var html, langs, tsft, ui;

  ui = FormApp.getUi();
  try {
    tsft = new TSFormTranslator(FormApp.getActiveForm());
    tsft.setFormTrigger('checkResponses').setDocProperties();

    langs = tsft.getLangs();
    html = HtmlService.createTemplateFromFile('sidebar');
    html.langs = langs;
    ui.showSidebar(html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle('TSFormTranslator'));
  }  catch (e) {
    ui.alert('Clear Form', 'TSFormTranslator encountered an error while trying to open the sidebar.  Please try again later.', ui.ButtonSet.OK);
  }

}`


###
 * Process form response
 * @param {Object} form submit trigger event
###
`function checkResponses(e) {
  var form, tscf;
  try {
    form = FormApp.getActiveForm();
    tscf = new TSFormTranslator(form, e.response).sendEmail();
  } catch(error) {
    // Send errors to owner
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'TSFormTranslator: Error processing form submission', error.message);
  }
}`

###
 * Delete all items in form
###
`function clearForm() {
  var result, tsft, ui;
  
  ui = FormApp.getUi();
  try {
    result = ui.alert('Clear Form', 'Remove all form elements?', ui.ButtonSet.OK_CANCEL);
    if (result == ui.Button.OK) {
      tsft = new TSFormTranslator(FormApp.getActiveForm()).clear();
      ui.alert('Clear Form', 'All form elements have been removed.', ui.ButtonSet.OK);
    }
  } catch (e) {
    ui.alert('Clear Form', 'TSFormTranslator encountered an error while clearing the form.  Please try again later.', ui.ButtonSet.OK);
  }
}`

###
 * Show About Information
###
`function about() {
  FormApp.getUi().showModelessDialog(HtmlService.createHtmlOutputFromFile('about').setSandboxMode(HtmlService.SandboxMode.IFRAME), ' ');
}`

###
 * Convert form text to selected translation language
###
`function translate(formObject) {
  
  try { 
      return new TSFormTranslator(FormApp.getActiveForm()).translateText(formObject); 
  } catch(e) {
      throw new Error('The following error occurred while trying to translate the form.  Please run the "TSFormTranslator > Clear form" menu option to reset the form. \n\n' + e);
  }
}`

###
 * Get time in pretty format
 * @param {String} time string in format hh:mm
 * @return {String} time string in pretty format
###
`function getPrettyTime(time) {
  var t;
  t = time.trim().split(":");
  if (t[0] == 0) {
    return '12' +  ":" + t[1] + 'AM';
  } else if (t[0] < 12) {
    return parseInt(t[0]) + ":" + t[1] + 'AM';
  } else if (t[0] == 12) {
    return '12' + ":" + t[1] + 'PM';
  } else {
    return (t[0] - 12) + ":" + t[1] + 'PM';
  }
}`


###
 * Get duration in pretty format
 * @param {String} duration string in format hh:mm:ss
 * @return {String} duration string in pretty format
###
`function getPrettyDuration(time) {
  var duration, t;
  duration = '';
  t = time.trim().split(":");
  if (t[0] > 0) {
    duration += parseInt(t[0]) + " hours";
  }
  if (t[1] > 0) {
    if (t[0] > 0) {
      duration += "  : "
    }
    duration += parseInt(t[1]) + " minutes";
  }
  if (t[2] > 0) {
    if (t[0] > 0 || t[1] > 0) {
      duration += "  : "
    }
    duration += parseInt(t[2]) + " seconds";
  }
  return duration;
}`

###
* Define TSFormTranslator Class
###

do ->

  ###
  * TSFormTranslator
  * @class
  ###
  class @TSFormTranslator
    ###
    * @constructor
    * @param {Object} form object
    * @param {Object} form response object
    * @param {String} email template name
    * @param {String} email subject line
    * @return {TSFormTranslator} this object for chaining
    ###
    constructor: (@form, @formResponse = null, @email = 'email', @subjectline = 'Form Submission') ->
      @key = 'tsformtranslator'
      @origin =
        code: 'en'
        lang: 'English'
      @translator =
        code: ''
        lang: ''
      @meta = null
      @

    # PUBLIC FUNCTIONS

    ###
      * Remove form elements and reset TSFormTranslator configuration
      * @return {TSFormTranslator} this object for chaining
    ###
    clear: ->
      @form.setTitle('TSFormTranslator')
      @form.setDescription('')
      @form.setConfirmationMessage('')
      children = @form.getItems()
      children.forEach (item) =>
        @form.deleteItem(item)
      PropertiesService.getDocumentProperties().setProperty(@key, @origin.lang)
      @

    ###
      * Get languages
      * @return {Object} an object of language codes
    ###
    getLangs: ->
      langs =
        'Afrikaans':'af'
        'Albanian':'sq'
        'Arabic':'ar'
        'Armenian':'hy'
        'Azerbaijani':'az'
        'Basque':'eu'
        'Belarusian':'be'
        'Bengali':'bn'
        'Bosnian':'bs'
        'Bulgarian':'bg'
        'Catalan':'ca'
        'Cebuano':'ceb'
        'Chinese':'zh'
        'Croatian':'hr'
        'Czech':'cs'
        'Danish':'da'
        'Dutch':'nl'
        'Esperanto':'eo'
        'Estonian':'et'
        'Filipino':'tl'
        'Finnish':'fi'
        'French':'fr'
        'Galician':'gl'
        'Georgian':'ka'
        'German':'de'
        'Greek':'el'
        'Gujarati':'gu'
        'Haitian Creole':'ht'
        'Hausa':'ha'
        'Hebrew':'iw'
        'Hindi':'hi'
        'Hmong':'hmn'
        'Hungarian':'hu'
        'Icelandic':'is'
        'Igbo':'ig'
        'Indonesian':'id'
        'Irish':'ga'
        'Italian':'it'
        'Japanese':'ja'
        'Javanese':'jv'
        'Kannada':'kn'
        'Khmer':'km'
        'Korean':'ko'
        'Lao':'lo'
        'Latin':'la'
        'Latvian':'lv'
        'Lithuanian':'lt'
        'Macedonian':'mk'
        'Malay':'ms'
        'Maltese':'mt'
        'Maori':'mi'
        'Marathi':'mr'
        'Mongolian':'mn'
        'Nepali':'ne'
        'Norwegian':'no'
        'Persian':'fa'
        'Polish':'pl'
        'Portuguese':'pt'
        'Punjabi':'pa'
        'Romanian':'ro'
        'Russian':'ru'
        'Serbian':'sr'
        'Slovak':'sk'
        'Slovenian':'sl'
        'Somali':'so'
        'Spanish':'es'
        'Swahili':'sw'
        'Swedish':'sv'
        'Tamil':'ta'
        'Telugu':'te'
        'Thai':'th'
        'Turkish':'tr'
        'Ukrainian':'uk'
        'Urdu':'ur'
        'Vietnamese':'vi'
        'Welsh':'cy'
        'Yiddish':'yi'
        'Yoruba':'yo'
        'Zulu':'zu'
      langs

    ###
    * Generate form meta and send email
    * @return {TSFormTranslator} this object for chaining
    ###
    sendEmail: ->
      lang = PropertiesService.getDocumentProperties().getProperty(@key)
      from = @getLangs()[lang]
      if from
        @generateFormResponseMeta_(from, @origin.code)
      else
        @generateFormResponseMeta_(@origin.code, @origin.code)
      if @meta
        @sendEmail_()
      @

    ###
    * Set Initial Document Properties
    * @return {TSFormTranslator} this object for chaining
    ###
    setDocProperties: ->
      if not PropertiesService.getDocumentProperties().getProperty(@key)
        PropertiesService.getDocumentProperties().setProperty(@key, @origin.lang)
      @

    ###
    * Set a form trigger for processing form responses
    * @param {String} function name to be run on trigger
    * @return {TSFormTranslator} this object for chaining
    ###
    setFormTrigger: (functionName) ->
      if not @hasSubmitTrigger_(functionName)
        triggers = ScriptApp.getProjectTriggers()
        triggers.forEach (trigger) ->
          ScriptApp.deleteTrigger(trigger)
        ScriptApp.newTrigger(functionName)
          .forForm(@form)
          .onFormSubmit()
          .create()
      @

    ###
    * Translate form text
    * @return {String} language string
    ###
    translateText: (formObject) ->
      if formObject.status is 'translatetext'
        toCode = @getLangs()[formObject.translatelang]
        @translate_(@origin.code, toCode)
        PropertiesService.getDocumentProperties().setProperty(@key, formObject.translatelang)
        return formObject.translatelang
      if formObject.status is 'translateeng'
        toCode = @getLangs()[formObject.translate]
        @translate_(toCode, @origin.code)
        PropertiesService.getDocumentProperties().setProperty(@key, @origin.lang)
        return @origin.lang


    # PRIVATE FUNCTIONS

    ###
    * Generate form response meta
    * @return {TSFormTranslator} this object for chaining
    * @private
    ###
    generateFormResponseMeta_: (from, to) ->
      if @formResponse
        meta = new Object()
        meta.lang = PropertiesService.getDocumentProperties().getProperty(@key)
        meta.fromCode = from
        meta.toCode = to
        meta.url = @form.getPublishedUrl()
        meta.title = @form.getTitle()
        if @form.collectsEmail()
          meta.submitter = @formResponse.getRespondentEmail()
        meta.response = []
        @formResponse.getItemResponses().forEach (itemResponse) =>
          item = itemResponse.getItem()
          response = new Object()
          response.title = item.getTitle()
          response.type = @getItemType_(item.getType())
          if response.type is 'grid'
            response.rows = item.asGridItem().getRows()
          if response.type is 'scale'
            scale = item.asScaleItem()
            scaleparams = new Object()
            scaleparams.lowerlabel = scale.getLeftLabel()
            scaleparams.lowerbound = scale.getLowerBound()
            scaleparams.upperlabel = scale.getRightLabel()
            scaleparams.upperbound = scale.getUpperBound()
            response.scale = scaleparams
          response.response = itemResponse.getResponse()
          meta.response.push response
          null
        @meta = meta
      @

    ###
    * Get form response item type
    * @param {Object} form response item type
    * @return {String} type of form object
    * @private
    ###
    getItemType_: (itemType) ->
      type = null
      switch itemType
        when FormApp.ItemType.CHECKBOX
          type = 'checkbox'
        when FormApp.ItemType.DATE
          type = 'date'
        when FormApp.ItemType.DATETIME
          type = 'datetime'
        when FormApp.ItemType.TIME
          type = 'time'
        when FormApp.ItemType.DURATION
          type = 'duration'
        when FormApp.ItemType.GRID
          type = 'grid'
        when FormApp.ItemType.LIST
          type = 'list'
        when FormApp.ItemType.MULTIPLE_CHOICE
          type = 'multiplechoice'
        when FormApp.ItemType.SCALE
          type = 'scale'
        when FormApp.ItemType.PARAGRAPH_TEXT
          type = 'paragraph'
        when FormApp.ItemType.TEXT
          type = 'text'
        when FormApp.ItemType.TIME
          type = 'time'
        else
      type

    ###
    * Check for form submit trigger
    * @return {Boolean} return true if submit trigger exists else false
    ###
    hasSubmitTrigger_: (functionName) ->
      exists = false
      ScriptApp.getProjectTriggers().forEach (trigger) ->
        if trigger.getEventType() is ScriptApp.EventType.ON_FORM_SUBMIT and trigger.getHandlerFunction() is functionName
          exists = true
      exists

    ###
    * Send email
    * @return {TSFormTranslator} this object for chaining
    * @private
    ###
    sendEmail_: () ->
      email = HtmlService.createTemplateFromFile(@email)
      email.meta = @meta
      params =
        htmlBody: email.evaluate().getContent()
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(), @subjectline, "", params)
      @

    ###
    * Translate form elements
    * @return {TSFormTranslator} this object for chaining
    * @private
    ###
    translate_: (from, to) ->
      @form.setTitle(LanguageApp.translate(@form.getTitle(), from, to))
      if @form.getDescription() and @form.getDescription() isnt ''
        @form.setDescription(LanguageApp.translate(@form.getDescription(), from, to))
      if @form.getConfirmationMessage() and @form.getConfirmationMessage() isnt ''
        @form.setConfirmationMessage(LanguageApp.translate(@form.getConfirmationMessage(), from, to))
      children = @form.getItems()
      children.forEach (item) ->
        if item.getTitle() and item.getTitle() isnt ''
          item.setTitle(LanguageApp.translate(item.getTitle(), from, to))
        if item.getHelpText() and item.getHelpText() isnt ''
          item.setHelpText(LanguageApp.translate(item.getHelpText(), from, to))
        if item.getType() is FormApp.ItemType.CHECKBOX
          choices = []
          elem = item.asCheckboxItem()
          elem.getChoices().forEach (choice) ->
            choices.push(LanguageApp.translate(choice.getValue(), from, to))
          elem.setChoiceValues(choices)
        if item.getType() is FormApp.ItemType.LIST
          choices = []
          elem = item.asListItem()
          elem.getChoices().forEach (choice) ->
            choices.push(LanguageApp.translate(choice.getValue(), from, to))
          elem.setChoiceValues(choices)
        if item.getType() is FormApp.ItemType.MULTIPLE_CHOICE
          choices = []
          elem = item.asMultipleChoiceItem()
          elem.getChoices().forEach (choice) ->
            choices.push(LanguageApp.translate(choice.getValue(), from, to))
          elem.setChoiceValues(choices)
        if item.getType() is FormApp.ItemType.SCALE
          elem = item.asScaleItem()
          leftlabel = LanguageApp.translate(elem.getLeftLabel(), from, to)
          rightlabel = LanguageApp.translate(elem.getRightLabel(), from, to)
          elem.setLabels(leftlabel, rightlabel)
        if item.getType() is FormApp.ItemType.GRID
          elem = item.asGridItem()
          rows = []
          columns = []
          elem.getRows().forEach (row) ->
            rows.push(LanguageApp.translate(row, from, to))
          elem.getColumns().forEach (column) ->
            columns.push(LanguageApp.translate(column, from, to))
          elem.setRows(rows).setColumns(columns)
      @
