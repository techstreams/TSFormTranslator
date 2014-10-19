
/*
* Copyright 2014 Laura Taylor
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
 */

/*
 * Add a custom menu to the active form
 */
function onOpen() {
  FormApp.getUi()
      .createMenu('TSFormTranslator')
      .addItem('Open sidebar', 'openSidebar')
      .addItem('Clear form', 'clearForm')
      .addSeparator()
      .addItem('About', 'about')
      .addToUi();
};

/*
 * Open TSFormTranslator sidebar
 */
function openSidebar() {
  var html, key, langs, tsft, ui;

  ui = FormApp.getUi();
  try {
    tsft = new TSFormTranslator(FormApp.getActiveForm());
    tsft.setFormTrigger('checkResponses').setDocProperties();

    langs = tsft.getLangs();
    var html = HtmlService.createTemplateFromFile('sidebar');
    html.langs = langs;
    FormApp.getUi().showSidebar(html.evaluate().setTitle('TSFormTranslator'));
  }  catch (e) {
    ui.alert('Clear Form', 'TSFormTranslator encountered an error while trying to open the sidebar.  Please try again later.', ui.ButtonSet.OK);
  }

};

/*
 * Process form response
 * @param {Object} form submit trigger event
 */
function checkResponses(e) {
  var form, tscf;
  try {
    form = FormApp.getActiveForm();
    tscf = new TSFormTranslator(form, e.response).sendEmail();
  } catch(error) {
    // Send errors to owner
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'TSFormTranslator: Error processing form submission', error.message);
  }
};

/*
 * Delete all items in form
 */
function clearForm() {
  var config, result, tsft, ui;
  
  ui = FormApp.getUi();
  try {
    result = ui.alert('Clear Form', 'Remove all form elements?', ui.ButtonSet.OK_CANCEL);
    if (result == ui.Button.OK) {
      tsft = new TSFormTranslator(FormApp.getActiveForm()).clear();
    }
    ui.alert('Clear Form', 'All form elements have been removed.', ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Clear Form', 'TSFormTranslator encountered an error while clearing the form.  Please try again later.', ui.ButtonSet.OK);
  }
};

/*
 * Show About Information
 */
function about() {
  FormApp.getUi().showModelessDialog(HtmlService.createHtmlOutputFromFile('about'), ' ');
};

/*
 * Convert form text to selected translation language
 */
function translate(formObject) {
  var tsmt;
  try {
    tsmt = new TSFormTranslator(FormApp.getActiveForm()).translateText(formObject);
  } catch(error) {

  }
  return tsmt;
};

/*
 * Get time in pretty format
 * @param {String} time string in format hh:mm
 * @return {String} time string in pretty format
 */
function getPrettyTime(time) {
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
};

/*
 * Get duration in pretty format
 * @param {String} duration string in format hh:mm:ss
 * @return {String} duration string in pretty format
 */
function getPrettyDuration(time) {
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
};

/*
* Define TSFormTranslator Class
 */
(function() {

  /*
  * TSFormTranslator
  * @class
   */
  return this.TSFormTranslator = (function() {

    /*
    * @constructor
    * @param {Object} form object
    * @param {Object} form response object
    * @param {String} email template name
    * @param {String} email subject line
    * @return {TSFormTranslator} this object for chaining
     */
    function TSFormTranslator(form, formResponse, email, subjectline) {
      this.form = form;
      this.formResponse = formResponse != null ? formResponse : null;
      this.email = email != null ? email : 'email';
      this.subjectline = subjectline != null ? subjectline : 'Form Submission';
      this.key = 'tsformtranslator';
      this.origin = {
        code: 'en',
        lang: 'English'
      };
      this.translator = {
        code: '',
        lang: ''
      };
      this.meta = null;
      this;
    }


    /*
      * Remove form elements and reset TSFormTranslator configuration
      * @return {TSFormTranslator} this object for chaining
     */

    TSFormTranslator.prototype.clear = function() {
      var children;
      this.form.setTitle('TSFormTranslator');
      this.form.setDescription('');
      this.form.setConfirmationMessage('');
      children = this.form.getItems();
      children.forEach((function(_this) {
        return function(item) {
          return _this.form.deleteItem(item);
        };
      })(this));
      PropertiesService.getDocumentProperties().setProperty(this.key, this.origin.lang);
      return this;
    };


    /*
      * Get languages
      * @return {Object} an object of language codes
     */

    TSFormTranslator.prototype.getLangs = function() {
      var langs;
      langs = {
        'Afrikaans': 'af',
        'Albanian': 'sq',
        'Arabic': 'ar',
        'Armenian': 'hy',
        'Azerbaijani': 'az',
        'Basque': 'eu',
        'Belarusian': 'be',
        'Bengali': 'bn',
        'Bosnian': 'bs',
        'Bulgarian': 'bg',
        'Catalan': 'ca',
        'Cebuano': 'ceb',
        'Chinese': 'zh',
        'Croatian': 'hr',
        'Czech': 'cs',
        'Danish': 'da',
        'Dutch': 'nl',
        'Esperanto': 'eo',
        'Estonian': 'et',
        'Filipino': 'tl',
        'Finnish': 'fi',
        'French': 'fr',
        'Galician': 'gl',
        'Georgian': 'ka',
        'German': 'de',
        'Greek': 'el',
        'Gujarati': 'gu',
        'Haitian Creole': 'ht',
        'Hausa': 'ha',
        'Hebrew': 'iw',
        'Hindi': 'hi',
        'Hmong': 'hmn',
        'Hungarian': 'hu',
        'Icelandic': 'is',
        'Igbo': 'ig',
        'Indonesian': 'id',
        'Irish': 'ga',
        'Italian': 'it',
        'Japanese': 'ja',
        'Javanese': 'jv',
        'Kannada': 'kn',
        'Khmer': 'km',
        'Korean': 'ko',
        'Lao': 'lo',
        'Latin': 'la',
        'Latvian': 'lv',
        'Lithuanian': 'lt',
        'Macedonian': 'mk',
        'Malay': 'ms',
        'Maltese': 'mt',
        'Maori': 'mi',
        'Marathi': 'mr',
        'Mongolian': 'mn',
        'Nepali': 'ne',
        'Norwegian': 'no',
        'Persian': 'fa',
        'Polish': 'pl',
        'Portuguese': 'pt',
        'Punjabi': 'pa',
        'Romanian': 'ro',
        'Russian': 'ru',
        'Serbian': 'sr',
        'Slovak': 'sk',
        'Slovenian': 'sl',
        'Somali': 'so',
        'Spanish': 'es',
        'Swahili': 'sw',
        'Swedish': 'sv',
        'Tamil': 'ta',
        'Telugu': 'te',
        'Thai': 'th',
        'Turkish': 'tr',
        'Ukrainian': 'uk',
        'Urdu': 'ur',
        'Vietnamese': 'vi',
        'Welsh': 'cy',
        'Yiddish': 'yi',
        'Yoruba': 'yo',
        'Zulu': 'zu'
      };
      return langs;
    };


    /*
    * Generate form meta and send email
    * @return {TSFormTranslator} this object for chaining
     */

    TSFormTranslator.prototype.sendEmail = function() {
      var from, lang;
      lang = PropertiesService.getDocumentProperties().getProperty(this.key);
      from = this.getLangs()[lang];
      if (from) {
        this.generateFormResponseMeta_(from, this.origin.code);
      } else {
        this.generateFormResponseMeta_(this.origin.code, this.origin.code);
      }
      if (this.meta) {
        this.sendEmail_();
      }
      return this;
    };


    /*
    * Set Initial Document Properties
    * @return {TSFormTranslator} this object for chaining
     */

    TSFormTranslator.prototype.setDocProperties = function() {
      if (!PropertiesService.getDocumentProperties().getProperty(this.key)) {
        PropertiesService.getDocumentProperties().setProperty(this.key, this.origin.lang);
      }
      return this;
    };


    /*
    * Set a form trigger for processing form responses
    * @param {String} function name to be run on trigger
    * @return {TSFormTranslator} this object for chaining
     */

    TSFormTranslator.prototype.setFormTrigger = function(functionName) {
      var triggers;
      if (!this.hasSubmitTrigger_(functionName)) {
        triggers = ScriptApp.getProjectTriggers();
        triggers.forEach(function(trigger) {
          return ScriptApp.deleteTrigger(trigger);
        });
        ScriptApp.newTrigger(functionName).forForm(this.form).onFormSubmit().create();
      }
      return this;
    };


    /*
    * Translate form text
    * @return {String} language string
     */

    TSFormTranslator.prototype.translateText = function(formObject) {
      var toCode;
      if (formObject.status === 'translatetext') {
        toCode = this.getLangs()[formObject.translatelang];
        this.translate_(this.origin.code, toCode);
        PropertiesService.getDocumentProperties().setProperty(this.key, formObject.translatelang);
        return formObject.translatelang;
      }
      if (formObject.status === 'translateeng') {
        toCode = this.getLangs()[formObject.translate];
        this.translate_(toCode, this.origin.code);
        PropertiesService.getDocumentProperties().setProperty(this.key, this.origin.lang);
        return this.origin.lang;
      }
    };


    /*
    * Generate form response meta
    * @return {TSFormTranslator} this object for chaining
    * @private
     */

    TSFormTranslator.prototype.generateFormResponseMeta_ = function(from, to) {
      var meta;
      if (this.formResponse) {
        meta = new Object();
        meta.lang = PropertiesService.getDocumentProperties().getProperty(this.key);
        meta.fromCode = from;
        meta.toCode = to;
        meta.url = this.form.getPublishedUrl();
        meta.title = this.form.getTitle();
        if (this.form.collectsEmail()) {
          meta.submitter = this.formResponse.getRespondentEmail();
        }
        meta.response = [];
        this.formResponse.getItemResponses().forEach((function(_this) {
          return function(itemResponse) {
            var item, response, scale, scaleparams;
            item = itemResponse.getItem();
            response = new Object();
            response.title = item.getTitle();
            response.type = _this.getItemType_(item.getType());
            if (response.type === 'grid') {
              response.rows = item.asGridItem().getRows();
            }
            if (response.type === 'scale') {
              scale = item.asScaleItem();
              scaleparams = new Object();
              scaleparams.lowerlabel = scale.getLeftLabel();
              scaleparams.lowerbound = scale.getLowerBound();
              scaleparams.upperlabel = scale.getRightLabel();
              scaleparams.upperbound = scale.getUpperBound();
              response.scale = scaleparams;
            }
            response.response = itemResponse.getResponse();
            meta.response.push(response);
            return null;
          };
        })(this));
        this.meta = meta;
      }
      return this;
    };


    /*
    * Get form response item type
    * @param {Object} form response item type
    * @return {String} type of form object
    * @private
     */

    TSFormTranslator.prototype.getItemType_ = function(itemType) {
      var type;
      type = null;
      switch (itemType) {
        case FormApp.ItemType.CHECKBOX:
          type = 'checkbox';
          break;
        case FormApp.ItemType.DATE:
          type = 'date';
          break;
        case FormApp.ItemType.DATETIME:
          type = 'datetime';
          break;
        case FormApp.ItemType.TIME:
          type = 'time';
          break;
        case FormApp.ItemType.DURATION:
          type = 'duration';
          break;
        case FormApp.ItemType.GRID:
          type = 'grid';
          break;
        case FormApp.ItemType.LIST:
          type = 'list';
          break;
        case FormApp.ItemType.MULTIPLE_CHOICE:
          type = 'multiplechoice';
          break;
        case FormApp.ItemType.SCALE:
          type = 'scale';
          break;
        case FormApp.ItemType.PARAGRAPH_TEXT:
          type = 'paragraph';
          break;
        case FormApp.ItemType.TEXT:
          type = 'text';
          break;
        case FormApp.ItemType.TIME:
          type = 'time';
          break;
      }
      return type;
    };


    /*
    * Check for form submit trigger
    * @return {Boolean} return true if submit trigger exists else false
     */

    TSFormTranslator.prototype.hasSubmitTrigger_ = function(functionName) {
      var exists;
      exists = false;
      ScriptApp.getProjectTriggers().forEach(function(trigger) {
        if (trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT && trigger.getHandlerFunction() === functionName) {
          return exists = true;
        }
      });
      return exists;
    };


    /*
    * Send email
    * @return {TSFormTranslator} this object for chaining
    * @private
     */

    TSFormTranslator.prototype.sendEmail_ = function() {
      var email, params;
      email = HtmlService.createTemplateFromFile(this.email);
      email.meta = this.meta;
      params = {
        htmlBody: email.evaluate().getContent()
      };
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(), this.subjectline, "", params);
      return this;
    };


    /*
    * Translate form elements
    * @return {TSFormTranslator} this object for chaining
    * @private
     */

    TSFormTranslator.prototype.translate_ = function(from, to) {
      var children;
      this.form.setTitle(LanguageApp.translate(this.form.getTitle(), from, to));
      if (this.form.getDescription() && this.form.getDescription() !== '') {
        this.form.setDescription(LanguageApp.translate(this.form.getDescription(), from, to));
      }
      if (this.form.getConfirmationMessage() && this.form.getConfirmationMessage() !== '') {
        this.form.setConfirmationMessage(LanguageApp.translate(this.form.getConfirmationMessage(), from, to));
      }
      children = this.form.getItems();
      children.forEach(function(item) {
        var choices, columns, elem, leftlabel, rightlabel, rows;
        if (item.getTitle() && item.getTitle() !== '') {
          item.setTitle(LanguageApp.translate(item.getTitle(), from, to));
        }
        if (item.getHelpText() && item.getHelpText() !== '') {
          item.setHelpText(LanguageApp.translate(item.getHelpText(), from, to));
        }
        if (item.getType() === FormApp.ItemType.CHECKBOX) {
          choices = [];
          elem = item.asCheckboxItem();
          elem.getChoices().forEach(function(choice) {
            return choices.push(LanguageApp.translate(choice.getValue(), from, to));
          });
          elem.setChoiceValues(choices);
        }
        if (item.getType() === FormApp.ItemType.LIST) {
          choices = [];
          elem = item.asListItem();
          elem.getChoices().forEach(function(choice) {
            return choices.push(LanguageApp.translate(choice.getValue(), from, to));
          });
          elem.setChoiceValues(choices);
        }
        if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
          choices = [];
          elem = item.asMultipleChoiceItem();
          elem.getChoices().forEach(function(choice) {
            return choices.push(LanguageApp.translate(choice.getValue(), from, to));
          });
          elem.setChoiceValues(choices);
        }
        if (item.getType() === FormApp.ItemType.SCALE) {
          elem = item.asScaleItem();
          leftlabel = LanguageApp.translate(elem.getLeftLabel(), from, to);
          rightlabel = LanguageApp.translate(elem.getRightLabel(), from, to);
          elem.setLabels(leftlabel, rightlabel);
        }
        if (item.getType() === FormApp.ItemType.GRID) {
          elem = item.asGridItem();
          rows = [];
          columns = [];
          elem.getRows().forEach(function(row) {
            return rows.push(LanguageApp.translate(row, from, to));
          });
          elem.getColumns().forEach(function(column) {
            return columns.push(LanguageApp.translate(column, from, to));
          });
          return elem.setRows(rows).setColumns(columns);
        }
      });
      return this;
    };

    return TSFormTranslator;

  })();
})();
