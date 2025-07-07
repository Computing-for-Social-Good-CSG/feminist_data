import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 
var dataSourceArr = utils.pullData("Data Sources", "https://computing-for-social-good-csg.github.io/feminist_data/data/data_sources.json");
const baseBiasList = ["Age","Country","Language","Gender","Race","Socioeconomic Class"];
const baseContextList = ["Law", "Education", "Literature", "Academia", "News", "Spoken (conversation)", "Social Media"];

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
utils.populateInputGroup("inputDataSource", Object.keys(dataSourceArr), null, "radio", "dataSource");
utils.populateInputGroup("inputLang", Object.keys(langArr), null, "checkbox", "lang");

// when Data Source is submitted, populate suggested biases 
document.getElementById("sourceSubmit").addEventListener("click", function(event){
    
    var parent = event.target.parentElement;
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    doCollapse(parent);

    d.data_source = document.querySelector('input[name="dataSource"]:checked').value;
    var sourceArr = dataSourceArr[d.data_source];
    var knownBiasKeys = Object.keys(sourceArr);

    // find known biases from JSON file
    var knownBiasTitles = []
    for (var i=0; i<knownBiasKeys.length; i++){
        if (i%3 == 0){
            knownBiasTitles.push(knownBiasKeys[i]);
        }
    }

    // create HTML for known biases 
    utils.removeChildOfClass("inputSourceBias","form-check");
    utils.populateCiteGroup("inputSourceBias", knownBiasKeys, Object.values(sourceArr), "sourceBias");

    // populate unchecked blanks for the rest
    var unknownBiasTitles = [] 
    for (var i=0; i<baseBiasList.length; i++){
        if (!knownBiasTitles.includes(baseBiasList[i])){
            unknownBiasTitles.push(baseBiasList[i]);
        }
    }
    utils.populateInputGroup("inputSourceBias", unknownBiasTitles, null, "checkbox", "sourceBias");
})

// when Data Source Biases are submitted, update database 
document.getElementById("sourceBiasSubmit").addEventListener("click", function(event){

    var parent = event.target.parentElement;
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    doCollapse(parent);

    if (document.getElementById("Age").checked){
        d.age = utils.updateBias("Age");
    } 
    if (document.getElementById("Country").checked){
        d.country_list = utils.updateBias("Country");
    }
    if (document.getElementById("Language").checked){
        d.lang_macro = utils.updateBias("Language");
    }
    if (document.getElementById("Race").checked){
        d.race = utils.updateBias("Race");
    }
    if (document.getElementById("Socioeconomic Class").checked){
        d.class = utils.updateBias("Socioeconomic Class");
    }
});

// when Macro Language submitted, update Dialect options
document.getElementById("langSubmit").addEventListener("click", function(event) {

    var parent = event.target.parentElement;
    var parentName = parent.getAttribute("name");
    var empty = isEmpty(parent);

    // clean up divs populated from this action (in resubmitted)
    utils.removeChildOfClass("inputDialect","form-check");
    utils.removeChildOfClass("inputDialect", "suggested-header");

    // lang is blacklisted, so this requires an input checked to progress
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    doCollapse(parent);

    // get list of selected Macro Languages 
    var langsChecked = [];
    var formList = parent.querySelectorAll(`[name*="${parentName}"]`);
    for(var i=0; i<formList.length; i++) {
        if (formList[i].checked) {
            langsChecked.push(formList[i].value);
        }
    }
    d.lang_macro = langsChecked;

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
        utils.populateInputGroup("inputDialect", Object.keys(dialectArr), null, "checkbox", "dialect", dialectCountries, "Associated Countries: ");
    } 
});

document.getElementById("submitDialect").addEventListener("click", function(event){
    var parent = event.target.parentElement;
    var dialectNodes = parent.querySelectorAll(`[name*="dialect"]:checked`);
    var dialectSelected = Array.from(dialectNodes).map(checkbox => checkbox.value);
    var container = document.getElementById("inputCountry");

    // generate help text 
    var p = document.createElement("p");
    p.classList.add("suggested-heading");
    if (dialectNodes.length > 0) {
        p.textContent = 'These countries are suggested based on your selected dialects: ' + dialectSelected.join(", ");
    } else {
        p.textContent = 'Please indicate the countries where your dataset came from. I.e. where the people who generated the data live.'
    }
    container.appendChild(p);

    // get list of suggested countries based on dialect 
    var suggestedCountries = [];
    for (var x=0; x<dialectSelected.length; x++) {
        suggestedCountries.push(langArr[d.lang_macro].Dialects[dialectSelected[x]]);
    }

    // populate list of countries 
    var countryAll = langArr[d.lang_macro].Countries;
    utils.populateBiasGroup("inputCountry", countryAll, suggestedCountries, "country");

    doCollapse(parent);
});

document.getElementById("submitCountry").addEventListener("click", function(event){
    var parent = event.target.parentElement;

    //TODO update database accordingly

    // Currently limiting to a single dialect for the demo, can expand later



    var headerFormality = "Suggested formality based on Dialects: " + dialectSelected[0];
    // Since factory takes an array as input, and formality is a string. create an array with the single string.
    var dialectFormality = [];
    dialectFormality[0] = langArr[d.lang_macro].Dialects[dialectSelected[0]].Formality;

    var headerContext = "Social context based on Dialects: " + dialectSelected[0];
    var dialectContext = langArr[d.lang_macro].Dialects[dialectSelected[0]].Context;
    // clear existing
    utils.removeChildOfClass("inputCountry","form-check");

    //populate new
    utils.populateHeader("inputCountry", headerFormality, "formality");
    // utils.populateBiasGroup("inputCountry", dialectSelected[0], dialectFormality, "formality", true);


    utils.populateHeader("inputCountry", headerContext, "context");
    // utils.populateBiasGroup("inputCountry", dialectSelected[0], dialectContext, "context", true);
    
    var unknownContexts = [] 
    for (var i=0; i<baseContextList.length; i++){
        if (!dialectContext.includes(baseContextList[i])){
            unknownContexts.push(baseContextList[i]);
        }
    }
    // utils.populateBiasGroup("inputCountry", dialectSelected[0], unknownContexts, "context", false);

    doCollapse(parent);
});




// On submit, modify the database with date variables 
    // null checks built in to database class using set function
    // does not check for other garbage values before overwriting
document.getElementById("dateSubmit").addEventListener("click", function(event){

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