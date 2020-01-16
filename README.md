#  TSFormTranslator

> TSFormTranslator is a demonstration [Google Apps Script](https://www.google.com/script/start/) which enables a *[Google Form](https://support.google.com/docs/topic/6063584) owner* to translate a form ***created in English*** into ***one of 79 different languages*** using [Google Translate](https://translate.google.com/). *( For a list of supported languages, see the [TSFormTranslator documentation](https://techstreams.github.io/TSFormTranslator#langs). )*
>
> Once the form has been translated and [shared](https://support.google.com/docs/answer/2839588), *form users* can submit responses in the ***form's language***.
>
> A nicely formatted email containing the submitted content will be sent to the *form owner* in both the ***form language*** and ***English translation*** each time a *form user* submits to the form.


`**` *NOTE:  If you and your form users are using a browser such as [Chrome](https://www.google.com/intl/en-US/chrome/browser/) (which already supports translation), you may be interested in [TSContactForm](https://techstreams.github.io/TSContactForm)</a> instead.*


---

## Install

Follow these instructions to install the **TSFormTranslator** script and host form into your Google Drive:

* Login to your [Google Drive](https://drive.google.com/).

* Access the [TSFormTranslator form](https://techstreams.page.link/TSFormTranslator).

* Click the ***Use Template*** button. This will copy the form to your Google Drive.


---


## Usage

See the [TSFormTranslator documentation](https://techstreams.github.io/TSFormTranslator)

**Important Usage Notes:**

* TSFormTranslator uses [Google Translate](https://translate.google.com/) to translate form elements.   Some *English words and phrases may not translate as expected* in all languages.  
* Some *built-in* Google Form text *will not* be translated by TSFormTranslator.

* Some translation languages may only be viewable in browsers such as [Chrome](https://www.google.com/intl/en-US/chrome/browser/).

* [Form Page Navigation](https://support.google.com/docs/answer/141062) *will no longer work* after form translation.

* Time, date and duration form field submissions will only show in English in the sent email.

* Google Apps Scripts are subject to daily quota limits including the number of emails sent and the Trigger Aggregate Execution Time.   See the *Quota Limits* tab of the [Google Apps Script Dashboard](https://docs.google.com/macros/dashboard) for more information.

* TSFormTranslator may not be appropriate for high traffic forms, especially in cases where the form owner consistently receives quota limit exceeded notifications. 


---


## Contributing to this project

Contributions are welcome. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md) and check the [Change log](CHANGELOG.md) for any existing updates.

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)  


---


## Developer Notes

Edit [src/tsformtranslator.coffee](src/tsformtranslator.coffee) for all changes to [dist/code.gs](dist/code.gs) and use [Gulp](http://gulpjs.com/) to build.  *See the [Using CoffeeScript and Gulp](#using-coffeescript-and-gulp) section below for more information.*

Edit `.html` files directly in the [dist/ directory](./dist).


#### Using CoffeeScript and Gulp

Ensure that [Node.js](http://nodejs.org/) and [npm](https://github.com/npm/npm) are installed on your system.  *NOTE: Most Node.js installers include npm.*

To install dependencies, run the following command from the project's root directory *(you may need to run `sudo npm install` depending upon your environment)*:

```sh
$ npm install
```

Install [Gulp](http://gulpjs.com/) globally. *(You may need to run `sudo npm install --global gulp` depending upon your environment)*:

```sh
$ npm install --global gulp
```

**Code:**


To build code, edit the [source](src/tsformtranslator.coffee) and run the following command from the project's root directory:

```sh
$ gulp
```

*While developing, the `gulp dev` task may be useful.  Run the following command from the project's root directory:*

```sh
$ gulp dev
```

You can find gulp tasks in the [gulpfile](gulpfile.coffee).  


---


## License

Copyright [Laura Taylor](https://github.com/techstreams)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use the files except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
