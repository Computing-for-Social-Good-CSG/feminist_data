import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 
var dataSourceArr = utils.pullData("Data Sources", "https://computing-for-social-good-csg.github.io/feminist_data/data/data_sources.json");
const baseBiasList = ["Age","Country","Language","Gender","Race","Socioeconomic Class"];
const baseFormalityList = ["Honorific", "Formal", "Vernacular", "Informal/Slang"];
const baseContextList = ["Academia", "Education", "Historical", "Law", "Literature", "News", "Religious", "Spoken, conversational", "Social Media"];

// -- CHANGE BACK BEFORE PUSHING 
// var langArr = utils.pullData("Languages", "https://computing-for-social-good-csg.github.io/feminist_data/data/languages.json");
var langArr = utils.pullData("Languages", "data/languages.json");

class Dataset {
    constructor () {
        this.citation_list = [];
        this.data_source = "";
        this.age = "";
        this.class = "";
        this.lang_macro = [];
        this.lang_dialect = [];
        this.country_list = [];
        this.race = "";
        this.formal = "";
        // change gen to timestamp
        this.gen_date_start = "";
        this.gen_date_start_est = false;
        this.gen_date_end = "";
        this.gen_date_end_est = false;
        this.collect_date_start = "";
        this.collect_date_start_est = false;
        this.collect_date_end = "";
        this.collect_date_end_est = false;
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
    utils.removeChildOfClass("inputSourceBias", "suggested-header");
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

    // populate known biases
    var headerText = "Suggested biases based on the source: " + d.data_source;
    utils.populateSuggestedHeader("inputSourceBias", headerText); 
    var sourceArr = dataSourceArr[d.data_source];
    var knownBiasKeys = Object.keys(sourceArr);     
    var knownBiasTitles = []
    for (var i=0; i<knownBiasKeys.length; i++){
        if (i%3 == 0){
            knownBiasTitles.push(knownBiasKeys[i]);
        }
    }
    utils.populateCiteGroup("inputSourceBias", knownBiasKeys, Object.values(sourceArr), "sourceBias");

    // populate possible, unknown biases 
    var unknownBiasTitles = [] 
    for (var i=0; i<baseBiasList.length; i++){
        if (!knownBiasTitles.includes(baseBiasList[i])){
            unknownBiasTitles.push(baseBiasList[i]);
        }
    }
    utils.populateInputGroup("inputSourceBias", unknownBiasTitles, "checkbox", "sourceBias");
    doCollapse(parent);
})

// when Data Source Biases are submitted, update database 
document.getElementById("submitSourceBias").addEventListener("click", function(event) {
    var parent = event.target.parentElement;
    if (document.getElementById("Age").checked) {
        d.age = utils.updateBias("Age");
    } 
    if (document.getElementById("Country").checked) {
        d.country_list = utils.updateBias("Country");
    }
    if (document.getElementById("Language").checked) {
        d.lang_macro = utils.updateBias("Language");
    }
    if (document.getElementById("Race").checked) {
        d.race = utils.updateBias("Race");
    }
    if (document.getElementById("Socioeconomic Class").checked) {
        d.class = utils.updateBias("Socioeconomic Class");
    }
    doCollapse(parent);
});

// when Macro Language submitted, update Dialect options
document.getElementById("submitLang").addEventListener("click", function(event) {
    utils.removeChildOfClass("inputDialect","form-check");
    utils.removeChildOfClass("inputDialect", "suggested-header");
    var parent = event.target.parentElement;
    var langNodes = parent.querySelectorAll(`[name*="lang"]:checked`);
    d.lang_macro = Array.from(langNodes).map(checkbox => checkbox.value);
    
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    // populate Dialects based on Macro Languages 
    for(var i=0; i<d.lang_macro.length; i++) {

        // no dialect data, break out early 
        if (!langArr[d.lang_macro[i]].hasOwnProperty("Dialects")) {
            var headerText = "No suggested dialects for the language: " + d.lang_macro[i];
            utils.populateSuggestedHeader("inputDialect", headerText);
            continue; 
        }

        var headerText = "Suggested dialects based on the language: " + d.lang_macro[i];
        utils.populateSuggestedHeader("inputDialect", headerText);
        var dialectArr = langArr[d.lang_macro[i]].Dialects;
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
    utils.removeChildOfClass("inputCountry", "suggested-header");
    var parent = event.target.parentElement;
    var dialectNodes = parent.querySelectorAll(`[name*="dialect"]:checked`);
    d.lang_dialect = Array.from(dialectNodes).map(checkbox => checkbox.value);

    // loop through macro languages 
    for (var x=0; x<d.lang_macro.length; x++) {

        // no country data for the language, break out early 
        if (!langArr[d.lang_macro[x]].hasOwnProperty("Countries")) {
            var headerText = "No suggested countries for the language: " + d.lang_macro[x];
            utils.populateSuggestedHeader("inputCountry", headerText);
            continue; 
        } else {
            var langCountries = langArr[d.lang_macro[x]].Countries;

            // populate suggested Countries
            var dialectsInLang = []
            var suggestedCountries = [];
            for (var i=0; i<d.lang_dialect.length; i++) {

                // if the dialect exists in this language 
                var listDialects = Object.keys(langArr[d.lang_macro[x]].Dialects);
                if (listDialects.includes(d.lang_dialect[i])) {
                    dialectsInLang = dialectsInLang.concat(d.lang_dialect[i]);
                    if (langArr[d.lang_macro[x]].Dialects[d.lang_dialect[i]].Countries) {
                        suggestedCountries = suggestedCountries.concat(langArr[d.lang_macro[x]].Dialects[d.lang_dialect[i]].Countries);
                    }
                }
            }
            var headerText = "Suggested countries based on the dialect(s): " + dialectsInLang.join(", ");
            utils.populateSuggestedHeader("inputCountry", headerText);
            suggestedCountries.sort();
            suggestedCountries = [... new Set(suggestedCountries)];
            utils.populateInputGroup("inputCountry", suggestedCountries, "checkbox", "countries", null, null, true);

            // populate all other Countries of language
            var headerText = "Other countries based on the language: " + d.lang_macro[x];
            utils.populateSuggestedHeader("inputCountry", headerText);
            var otherCountries = [];
            for (var i=0; i<langCountries.length; i++) {
                if (!suggestedCountries.includes(langCountries[i])) {
                    otherCountries.push(langCountries[i]);
                }
            }
            otherCountries.sort();
            utils.populateInputGroup("inputCountry", otherCountries, "checkbox", "countries"); 
        }
    }
    doCollapse(parent);
});

// when Countries are submitted, populate Conversation Contexts and Formality 
document.getElementById("submitCountry").addEventListener("click", function(event){
    utils.removeChildOfClass("inputFormality","form-check");
    utils.removeChildOfClass("inputFormality", "suggested-header");
    utils.removeChildOfClass("inputConvo","form-check");
    utils.removeChildOfClass("inputConvo", "suggested-header");
    var parent = event.target.parentElement;
    var countryNodes = parent.querySelectorAll(`[name*="countries"]:checked`);
    d.country_list = Array.from(countryNodes).map(checkbox => checkbox.value);
 
    for (var x=0; x<d.lang_macro.length; x++) {

        // no dialect data for the language, break out early 
        if (!langArr[d.lang_macro[x]].hasOwnProperty("Dialects")) {
            var headerText = "No suggested formality for the language: " + d.lang_macro[x];
            utils.populateSuggestedHeader("inputFormality", headerText);
            var headerText = "No suggested conversation context for the language: " + d.lang_macro[x];
            utils.populateSuggestedHeader("inputConvo", headerText);
            continue; 
        } else {
            var dialectsInLang = []
            var suggestedFormalities = [];
            var suggestedConvos = [];
            for (var i=0; i<d.lang_dialect.length; i++) {

                // if the dialect exists in this language 
                var listDialects = Object.keys(langArr[d.lang_macro[x]].Dialects);
                if (listDialects.includes(d.lang_dialect[i])) {
                    dialectsInLang = dialectsInLang.concat(d.lang_dialect[i]);
                    if (langArr[d.lang_macro[x]].Dialects[d.lang_dialect[i]].Formality) {
                        suggestedFormalities = suggestedFormalities.concat(langArr[d.lang_macro[x]].Dialects[d.lang_dialect[i]].Formality);
                    }
                    if (langArr[d.lang_macro[x]].Dialects[d.lang_dialect[i]].Context) {
                        suggestedConvos = suggestedConvos.concat(langArr[d.lang_macro[x]].Dialects[d.lang_dialect[i]].Context);
                    }
                }
            }
            var headerText = "Suggested formality based on the dialect(s): " + dialectsInLang.join(", ");
            utils.populateSuggestedHeader("inputFormality", headerText);
            suggestedFormalities = [... new Set(suggestedFormalities)];
            utils.populateInputGroup("inputFormality", suggestedFormalities, "checkbox", "formality", null, null, true);

            var headerText = "Suggested conversation contexts based on the dialect(s): " + dialectsInLang.join(", ");
            utils.populateSuggestedHeader("inputConvo", headerText);
            suggestedConvos = [... new Set(suggestedConvos)];
            utils.populateInputGroup("inputConvo", suggestedConvos, "checkbox", "context", null, null, true);
        }

        // populate all other formalities and contexts 
        var headerText = "Other levels of formality";
        utils.populateSuggestedHeader("inputFormality", headerText);
        var otherFormalities = [];
        for (var i=0; i<baseFormalityList.length; i++) {
            if (!suggestedFormalities.includes(baseFormalityList[i])) {
                otherFormalities.push(baseFormalityList[i]);
            }
        }
        utils.populateInputGroup("inputFormality", otherFormalities, "checkbox", "formality");

        var headerText = "Other conversation contexts";
        utils.populateSuggestedHeader("inputConvo", headerText);
        var otherContexts = [];
        for (var i=0; i<baseContextList.length; i++) {
            if (!suggestedConvos.includes(baseContextList[i])) {
                otherContexts.push(baseContextList[i]);
            }
        }
        utils.populateInputGroup("inputConvo", otherContexts, "checkbox", "context");
    }


    // Currently limiting to a single dialect for the demo, can expand later



    // var headerFormality = "Suggested formality based on Dialects: " + dialectSelected[0];
    // Since factory takes an array as input, and formality is a string. create an array with the single string.
    // var dialectFormality = [];
    // dialectFormality[0] = langArr[d.lang_macro].Dialects[dialectSelected[0]].Formality;

    // var headerContext = "Social context based on Dialects: " + dialectSelected[0];
    // var dialectContext = langArr[d.lang_macro].Dialects[dialectSelected[0]].Context;
    // clear existing
    // utils.removeChildOfClass("inputCountry","form-check");

    //populate new
    // utils.populateHeader("inputCountry", headerFormality, "formality");
 
    // utils.populateHeader("inputCountry", headerContext, "context");

    // var unknownContexts = [] 
    // for (var i=0; i<baseContextList.length; i++){
    //     if (!dialectContext.includes(baseContextList[i])){
    //         unknownContexts.push(baseContextList[i]);
    //     }
    // }

    doCollapse(parent);
});




// On submit, modify the database with date variables 
    // null checks built in to database class using set function
    // does not check for other garbage values before overwriting
document.getElementById("submitDate").addEventListener("click", function(event){

    // Custom 'empty' check for dates, requires all dates filled
    var parent = event.target.parentElement;
    var dates = parent.querySelectorAll(`[type*="date"]`);
    for (var i = 0; i < dates.length; i++) {
        if(dates[i].value == "") {
            console.log("Empty date, taking no action");
            return false;
        }
    }

    doCollapse(parent);

    if(d.set('gen_date_start', document.getElementById('startDateGen').value)) {
       d.set('gen_date_start_est', document.getElementById('startDateGenEst').checked);
    }
    if (d.set('gen_date_end', document.getElementById('endDateGen').value)) {
        d.set('gen_date_end_est', document.getElementById('endDateGenEst').checked);
    }
    if (d.set('collect_date_start', document.getElementById('startDateCol').value)) {
        d.set('collect_date_start_est', document.getElementById('startDateColEst').checked);
    }
    if (d.set('collect_date_end', document.getElementById('endDateCol').value)) {
        d.set('collect_date_end_est', document.getElementById('endDateColEst').checked);
    }
});