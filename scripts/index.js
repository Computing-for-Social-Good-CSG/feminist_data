import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 
const baseBiasList = ["Age","Country","Language","Gender","Race","Socioeconomic Class"];
const baseFormalityList = ["Honorific", "Formal", "Vernacular", "Informal/Slang"];
const baseContextList = ["Academia", "Education", "Encyclopedia", "Historical", "Law", "Literature", "News", "Religious", "Spoken (conversational)", "Social Media"];

// -- CHANGE BACK BEFORE PUSHING 
// var langArr = utils.pullData("Languages", "https://computing-for-social-good-csg.github.io/feminist_data/data/languages.json");
var langArr = utils.pullData("Languages", "data/languages.json");
// var dataSourceArr = utils.pullData("Data Sources", "https://computing-for-social-good-csg.github.io/feminist_data/data/data_sources.json");
var dataSourceArr = utils.pullData("Data Sources", "data/data_sources.json");

class Dataset {
    constructor () {
        this.age = null;
        this.age_cite = null;
        this.age_link = null;
        this.bias_other = [];
        this.class = "";
        this.class_cite = null;
        this.class_link = null;
        this.collect_start = "";
        this.collect_start_est = false;
        this.collect_end = "";
        this.collect_end_est = false;
        this.country_arr = [];       
        this.data_source = "";
        this.dialect = [];
        this.dialect_by_lang = [];
        this.formality = "";
        this.gender = null;
        this.gender_cite = null;
        this.gender_link = null;        
        this.lang = [];
        this.race = "";
        this.timestamp_start = "";
        this.timestamp_start_est = false;
        this.timestamp_end = "";
        this.timestamp_end_est = false;
    }

    set(varString, value) {
        if(varString != "" && varString != null && value != null && value != "") {
            this[varString] = value;
            return true;
        }

        if (typeof value == "boolean" && value == this[varString]) {
            return true;
        }

        return false;
    }
}

var d = new Dataset;

// Add submit function to all buttons
// NOTE: I think buttons may be type "submit" in the future, when sending the radio values
// document.addEventListener("click", function(event){
//     if(event.target.name == "submit"){
//         clickSubmit(event.target.parentElement);
//     }
// });

function isEmpty(buttonParent) {
    // check that there is a selection
    if(utils.formEmpty(buttonParent)){
        //TODO No option was selected in this form, display some warning and do not continue
        return true;
    }
    return false;

    //TODO add an "other" option with write in 
}

function doCollapse(buttonParent) {
    var accordionContainer = document.getElementById('accordionContainer');
    var accordionList = accordionContainer.querySelectorAll(`[class*="accordion-collapse"]`);
    currentAccordion = utils.getCurrentAccordion(buttonParent, accordionList);

    // close current accordion element
    var currentCollapsable = new bootstrap.Collapse(accordionList[currentAccordion], {
        toggle: false
    })
    currentCollapsable.hide();

    // If there is a next section
    if(currentAccordion+1 < accordionList.length) {

        // open the next accordion element
        currentAccordion++;
        var nextCollapsable = new bootstrap.Collapse(accordionList[currentAccordion], {
            toggle: false
        })
        nextCollapsable.show();
    }
}

// populate Data Source and Macro Languages 
utils.populateInputGroup("inputDataSource", Object.keys(dataSourceArr), "radio", "dataSource");
utils.populateInputGroup("inputLang", Object.keys(langArr), "checkbox", "lang");

// when Data Source is submitted, populate suggested biases 
document.getElementById("submitSource").addEventListener("click", function(event){
    
    // PATTERN -- for every submit button 
    // remove existing items (in case of resubmission)
    utils.removeChildOfClass("inputSourceBias","form-check");
    utils.removeChildOfClass("inputSourceBias", "suggested-h6");
    // get parent item (use later to check empty selection and collapse accordion) 
    var parent = event.target.parentElement;
    // update data object 
    d.data_source = document.querySelector('input[name="dataSource"]:checked').value;

    // check for input to progress 
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    var knownBiases = [];
    if (dataSourceArr[d.data_source].hasOwnProperty("Biases")) {

        // populate known biases
        var headerText = "Suggested biases based on the source: " + d.data_source;
        utils.populateSuggestedHeader("inputSourceBias", headerText);
        knownBiases = utils.populateCiteGroup("inputSourceBias", dataSourceArr[d.data_source].Biases, "sourceBias");
    } else {
        var headerText = "No suggested biases based on the source: " + d.data_source;
        utils.populateSuggestedHeader("inputSourceBias", headerText);
    }

    // populate possible, unknown biases 
    var headerText = "Other possible bias categories"
    utils.populateSuggestedHeader("inputSourceBias", headerText);
    var unknownBiasTitles = utils.removeItems(baseBiasList, knownBiases); 
    utils.populateOtherGroup("inputSourceBias", unknownBiasTitles, "sourceBias");

    doCollapse(parent);
});

// when Data Source Biases are submitted, update database 
document.getElementById("submitSourceBias").addEventListener("click", function(event) {
    var parent = event.target.parentElement;
    utils.updateBiases(dataSourceArr, d);

    console.log(d.bias_other);

    doCollapse(parent);
});

// when Macro Language submitted, update Dialect options
document.getElementById("submitLang").addEventListener("click", function(event) {
    utils.removeChildOfClass("inputDialect","form-check");
    utils.removeChildOfClass("inputDialect", "suggested-h6");
    utils.removeChildOfClass("inputDialect", "suggested-h5");
    var parent = event.target.parentElement;
    var langNodes = parent.querySelectorAll(`[name*="lang"]:checked`);
    d.lang = Array.from(langNodes).map(checkbox => checkbox.value);
    
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    // populate Dialects based on Macro Languages 
    for(var i=0; i<d.lang.length; i++) {

        // no dialect data, break out early 
        if (!langArr[d.lang[i]].hasOwnProperty("Dialects")) {
            var headerText = "No suggested dialects for the language: " + d.lang[i];
            utils.populateSuggestedHeader("inputDialect", headerText, "h5");
            continue; 
        }

        var headerText = "Suggested dialects based on the language: " + d.lang[i];
        utils.populateSuggestedHeader("inputDialect", headerText, "h5");
        var dialectArr = langArr[d.lang[i]].Dialects;
        var dialectCountries = [];
        for (var y=0; y<Object.keys(dialectArr).length; y++) {
            var countrySublist = Object.values(dialectArr)[y].Countries; 
            dialectCountries[y] = countrySublist;
        }
        utils.populateInputGroup("inputDialect", Object.keys(dialectArr), "checkbox", "dialect", dialectCountries, "Associated Countries: ");
    }
    doCollapse(parent); 
});

// when Dialects are submitted, populate list of Countries 
document.getElementById("submitDialect").addEventListener("click", function(event){
    utils.removeChildOfClass("inputCountry","form-check");
    utils.removeChildOfClass("inputCountry", "suggested-h6");
    utils.removeChildOfClass("inputCountry", "suggested-h5");
    var parent = event.target.parentElement;
    var dialectNodes = parent.querySelectorAll(`[name*="dialect"]:checked`);
    d.dialect = Array.from(dialectNodes).map(checkbox => checkbox.value);

    // loop through macro languages 
    for (var x=0; x<d.lang.length; x++) {
        d.dialect_by_lang[x] = [];

        // no country data for the language, break out early 
        if (!langArr[d.lang[x]].hasOwnProperty("Countries")) {
            var headerText = "No suggested countries for the language: " + d.lang[x];
            utils.populateSuggestedHeader("inputCountry", headerText, "h5");
            continue; 
        } else {
            var langCountries = langArr[d.lang[x]].Countries;
            var headerText = "For the language: " + d.lang[x];
            utils.populateSuggestedHeader("inputCountry", headerText, "h5");

            // populate suggested Countries
            var suggestedCountries = [];
            var noCountryDialects = [];
            for (var i=0; i<d.dialect.length; i++) {

                // if the dialect exists in this language 
                var allLangDialects = Object.keys(langArr[d.lang[x]].Dialects);
                if (allLangDialects.includes(d.dialect[i])) {
                    d.dialect_by_lang[x] = d.dialect_by_lang[x].concat(d.dialect[i]);
                    if (langArr[d.lang[x]].Dialects[d.dialect[i]].Countries) {
                        suggestedCountries = suggestedCountries.concat(langArr[d.lang[x]].Dialects[d.dialect[i]].Countries);
                    } else {
                        // there is a dialect, but it's not associated with countries 
                        noCountryDialects = noCountryDialects.concat(d.dialect[i]);
                    }
                }
            }

            var editedDialects = [];
            if (noCountryDialects.length > 0) {
                var headerText = "No suggested countries based on the dialect(s): " + noCountryDialects.join(", ");
                utils.populateSuggestedHeader("inputCountry", headerText);
                editedDialects = d.dialect_by_lang[x].slice();
                editedDialects = utils.removeItems(editedDialects, noCountryDialects);
            }
            if (suggestedCountries.length > 0) {
                if (editedDialects.length > 0) {
                    var headerText = "Suggested countries based on the dialect(s): " + editedDialects.join(", ");
                } else {
                    var headerText = "Suggested countries based on the dialect(s): " + d.dialect_by_lang[x].join(", ");
                }
                utils.populateSuggestedHeader("inputCountry", headerText);
                suggestedCountries.sort();
                suggestedCountries = [... new Set(suggestedCountries)];
                utils.populateInputGroup("inputCountry", suggestedCountries, "checkbox", "countries", null, null, true);
            } 

            // populate all other Countries of language
            var otherCountries = [];
            for (var i=0; i<langCountries.length; i++) {
                if (!suggestedCountries.includes(langCountries[i])) {
                    otherCountries.push(langCountries[i]);
                }
            }
            if (otherCountries.length == 0) {
                var headerText = "No other countries based on the language: " + d.lang[x];
                utils.populateSuggestedHeader("inputCountry", headerText);
            } else {
                var headerText = "Other countries based on the language: " + d.lang[x];
                utils.populateSuggestedHeader("inputCountry", headerText);
                otherCountries.sort();
                utils.populateInputGroup("inputCountry", otherCountries, "checkbox", "countries");
            }  
        }
    }
    doCollapse(parent);
});

// when Countries are submitted, populate Conversation Contexts and Formality 
document.getElementById("submitCountry").addEventListener("click", function(event){
    utils.removeChildOfClass("inputFormality", "form-check");
    utils.removeChildOfClass("inputFormality", "suggested-h6");
    utils.removeChildOfClass("inputContext", "form-check");
    utils.removeChildOfClass("inputContext", "suggested-h6");
    var parent = event.target.parentElement;
    var countryNodes = parent.querySelectorAll(`[name*="countries"]:checked`);
    d.country_arr = Array.from(countryNodes).map(checkbox => checkbox.value);

    var suggestForm = [];
    var suggestFormFrom = []; 
    var suggestContext = [];
    var suggestContextFrom = []; 

    // find suggested formality and contexts by data source
    if (dataSourceArr[d.data_source].Formality) {
        suggestForm = suggestForm.concat(dataSourceArr[d.data_source].Formality);
        suggestFormFrom.push(d.data_source);
    }
    if (dataSourceArr[d.data_source].Context) {
        suggestContext = suggestContext.concat(dataSourceArr[d.data_source].Context);
        suggestContextFrom.push(d.data_source);
    }

    // find suggested formality and contexts by dialect
    for (var x=0; x<d.lang.length; x++) {
        if (langArr[d.lang[x]].hasOwnProperty("Dialects")) {
            for (var i=0; i<d.dialect_by_lang[x].length; i++) {
                if (langArr[d.lang[x]].Dialects[d.dialect_by_lang[x][i]].Formality) {
                    suggestForm = suggestForm.concat(langArr[d.lang[x]].Dialects[d.dialect_by_lang[x][i]].Formality);
                    suggestFormFrom.push(d.dialect_by_lang[x][i]);
                } 
                if (langArr[d.lang[x]].Dialects[d.dialect_by_lang[x][i]].Context) {
                    suggestContext = suggestContext.concat(langArr[d.lang[x]].Dialects[d.dialect_by_lang[x][i]].Context);
                    suggestContextFrom.push(d.dialect_by_lang[x][i]);
                } 
            }
        } 
    }

    if (suggestForm.length > 0) {
        var headerText = "Suggested formalities from: " + suggestFormFrom.join(", ");
        utils.populateSuggestedHeader("inputFormality", headerText);
        suggestForm = [... new Set(suggestForm)];
        utils.populateInputGroup("inputFormality", suggestForm, "checkbox", "formality", null, null, true);
        var otherForm = utils.removeItems(baseFormalityList, suggestForm);
        utils.populateInputGroup("inputFormality", otherForm, "checkbox", "formality");
    } else {
        var headerText = "No suggested formalities based on selected data sources or dialects.";
        utils.populateSuggestedHeader("inputFormality", headerText);
        utils.populateInputGroup("inputFormality", baseFormalityList, "checkbox", "formality");
    }
    
    if (suggestContext.length > 0) {
        var headerText = "Suggested conversational contexts from: " + suggestContextFrom.join(", ");
        utils.populateSuggestedHeader("inputContext", headerText);
        suggestContext = [... new Set(suggestContext)];
        utils.populateInputGroup("inputContext", suggestContext, "checkbox", "context", null, null, true);
        var otherContext = utils.removeItems(baseContextList, suggestContext);
        utils.populateInputGroup("inputContext", otherContext, "checkbox", "context");
    } else { 
        var headerText = "No suggested conversational contexts based on selected data sources or dialects.";
        utils.populateSuggestedHeader("inputContext", headerText);
        utils.populateInputGroup("inputContext", baseContextList, "checkbox", "context");
    }    
    doCollapse(parent);
});

// when Formality and Conversation Context are submitted, open dates 
document.getElementById("submitFormalityContext").addEventListener("click", function(event) {
    var parent = event.target.parentElement;
    var formalityNodes = parent.querySelectorAll(`[name*="formality"]:checked`);
    d.formality = Array.from(formalityNodes).map(checkbox => checkbox.value);
    var contextNodes = parent.querySelectorAll(`[name*="context"]:checked`);
    d.context = Array.from(contextNodes).map(checkbox => checkbox.value);    

    if (d.formality.length == 0 | d.context.length == 0) {
        console.log("No selection, not taking any action")
        return;
    }

    doCollapse(parent);
});

// document.getElementById("submitDate").addEventListener("click", function(event){

//     // requires all dates filled
//     var parent = event.target.parentElement;
//     var dates = parent.querySelectorAll(`[type*="date"]`);
//     for (var i = 0; i < dates.length; i++) {
//         if(dates[i].value == "") {
//             console.log("Empty date, taking no action");
//             return false;
//         }
//     }

//     if(d.set('timestamp_start', document.getElementById('startTimestamp').value)) {
//        d.set('timestamp_start_est', document.getElementById('startTimestampEst').checked);
//     }
//     if (d.set('timestamp_end', document.getElementById('endTimestamp').value)) {
//         d.set('timestamp_end_est', document.getElementById('endTimestampEst').checked);
//     }
//     if (d.set('collect_date_start', document.getElementById('startCol').value)) {
//         d.set('collect_date_start_est', document.getElementById('startColEst').checked);
//     }
//     if (d.set('collect_date_end', document.getElementById('endCol').value)) {
//         d.set('collect_date_end_est', document.getElementById('endColEst').checked);
//     }
//     doCollapse(parent);
// });

// generate final print out 
document.getElementById("finish").addEventListener("click", function(event) {
    var parent = event.target.parentElement;

    utils.populateReportItem("reportBody", "Data Source", d.data_source);  
    utils.populateReportItem("reportBody", "Language", d.lang);
    utils.populateReportItem("reportBody", "Dialect", d.dialect);  
    utils.populateReportItem("reportBody", "Country", d.country_arr);
    utils.populateReportItem("reportBody", "Formality", d.formality);
    utils.populateReportItem("reportBody", "Conversation Context", d.context);

    utils.populateReportBias("reportBody", "Age", d.age, d.age_cite, d.age_link);
    utils.populateReportBias("reportBody", "Gender", d.gender, d.gender_cite, d.gender_link);

    doCollapse(parent);
});