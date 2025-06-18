import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 
var dataSourceArr = utils.pullData("Data Sources", "../data/data_sources.json");
const baseBiasList = ["Age","Country","Language","Gender","Race","Socioeconomic Class"];
var langArr = utils.pullData("Languages", "../data/languages.json");

class Dataset {
    constructor () {
        this.citation_list = [];
        this.data_source = "";
        this.age = "";
        this.class = "";
        this.lang_major = [];
        this.lang_dialect = [];
        this.country_list = [];
        this.race = "";
        this.formal = "";
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

// Populate initial form options
utils.populateInputGroup("inputDataSource", Object.keys(dataSourceArr), "radio", "dataSource");
utils.populateInputGroup("inputLang", Object.keys(langArr), "checkbox", "lang");

// const countryArr = utils.pullData("Country", "../data/data.json");
// utils.populateInputGroup("checkboxContainer2", countryArr, "checkbox");

// When Data Source is submitted, populate suggested biases 
document.getElementById("sourceSubmit").addEventListener("click", function(event){
    
    // TODO if resubmitting, clear out all previous html elements
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
    utils.populateInputGroup("inputSourceBias", unknownBiasTitles, "checkbox", "sourceBias");
})

// When data source biases are submitted, update database 
document.getElementById("sourceBiasSubmit").addEventListener("click", function(event){

    var parent = event.target.parentElement;
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    doCollapse(parent);

    if (document.getElementById("Age").checked){
        d.age = updateBias("Age");
    } 
    if (document.getElementById("Country").checked){
        d.country_list = updateBias("Country");
    }
    if (document.getElementById("Language").checked){
        d.lang_major = updateBias("Language");
    }
    if (document.getElementById("Race").checked){
        d.race = updateBias("Race");
    }
    if (document.getElementById("Socioeconomic Class").checked){
        d.class = updateBias("Socioeconomic Class");
    }
});

// Known issue in below function: 
// var str = formCheck.querySelector(".cite-text").textContent;
// When checking the boxes below citations, such as "Race" a null read error occurs
// Needs a check to not read cite-text of other checkboxes in div, or will eventually be a non-issue as all get citation

function updateBias(biasTitle){
    var formCheck = document.getElementById(biasTitle).parentElement;
    var str = formCheck.querySelector(".cite-text").textContent;
    return(str.substring(3, str.length));
};

var countryAll = [];

document.getElementById("langSubmit").addEventListener("click", function(event){

    // Language button was clicked, update dialect box using chosen language and dialect data stored

    var parent = event.target.parentElement;
    var parentName = parent.getAttribute("name");
    var empty = isEmpty(parent);

    // Cleaning up divs that get populated from this action
    // TODO utils.removeChildOfClass("inputDialect","SOME HEADER CLASS");
    utils.removeChildOfClass("inputDialect","form-check");
    // TODO utils.removeChildOfClass("inputCountry","SOME CLASS");

    // lang is blacklisted, so this requires an input checked to progress
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    doCollapse(parent);

    //TODO update Dataset
    var langsChecked = [];
    var formList = parent.querySelectorAll(`[name*="${parentName}"]`);

    for(var i=0; i<formList.length; i++) {
        if (formList[i].checked) {
            langsChecked.push(formList[i].value);
        }
    }
    // Not using set as that was not made for arrays
    // No null check is needed if we detect selections were made
    d.lang_major = langsChecked;

    // clear countries list in case of resubmission 
    countryAll = [];

    //TODO populate dialect section
    // To best populate dialect section, we may need to iterate through one at a time until we find our matches...
    for(var i=0; i<Object.keys(langArr).length; i++) {
        if(d.lang_major.includes(Object.keys(langArr)[i])) {

            if (!Object.values(langArr)[i].hasOwnProperty("Dialects")) {
                // no dialect data, break out early
                // console.log("No dialects, exit early");
                continue;
            }

            // Using match, create sub boxes for each dialect
            var dialectArr = Object.values(langArr)[i].Dialects;

            // Add to country list as we go through multiple dialects
            
            utils.populateDialectHeader("inputDialect", Object.keys(langArr)[i], "dialect");

            for(var y=0; y<Object.keys(dialectArr).length; y++) {
                var dialect = Object.keys(dialectArr)[y];
                var formality = Object.values(dialectArr)[y].Formality;;
                var countrySublist = Object.values(dialectArr)[y].Countries;

                // At this level we have each dialect object. and are iterating the indeces which sh             

                utils.populateDialectGroup("inputDialect", dialect, "dialect");


                if (!Object.values(dialectArr)[y].hasOwnProperty("Countries")) {
                    // no dialect data, break out early
                    console.log("Dialects, but no Countries, exit early");
                    continue;
                }

                // loop through list of countries, if it doesn't exist in all list, add it
                for(var x=0; x<countrySublist.length; x++) {
                    if (!countryAll.includes(countrySublist[x])) {
                        countryAll.push(countrySublist[x]);
                    }
                }

                if (!Object.values(dialectArr)[y].hasOwnProperty("Formality")) {
                    // no dialect data, break out early
                    console.log("Dialects, but no Formality, exit early");
                    continue;
                }

                // TODO Formality desires are vague, but should do here
                // Not sure if we want a checkbox, or if we want some other input format with this answer as a given. Multiple choice radios, etc...
                // utils.populateFormalityGroup("inputFormality", dialect, formality, "formality");

            }

            // TODO Populate all countries now that we have iterated through all dialects
            // Might want to sort alphabetically at some point
            // utils.populateCountryGroup("inputCountry", countryAll, "country");

        }
    }


});

document.getElementById("dialectSubmit").addEventListener("click", function(event){
    var parent = event.target.parentElement;
    var dialectNodes = parent.querySelectorAll(`[name*="dialect"]:checked`);
    var dialectSelected = Array.from(dialectNodes).map(checkbox => checkbox.value);
    var dialectCountries = langArr[d.lang_major].Dialects[dialectSelected[0]].Countries[0];
    dialectCountries = dialectCountries.split(", ");
    
    utils.removeChildOfClass("inputDialectBias","form-check");
    utils.populateCountryGroup("inputDialectBias", dialectSelected[0], dialectCountries, "countries");

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