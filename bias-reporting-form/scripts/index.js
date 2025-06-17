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
        this.lang_major = "";
        this.lang_dialect = "";
        this.country_list = "";
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

function updateBias(biasTitle){
    var formCheck = document.getElementById(biasTitle).parentElement;
    var str = formCheck.querySelector(".cite-text").textContent;
    return(str.substring(3, str.length));
};

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



document.getElementById("langSubmit").addEventListener("click", function(event){

    // Language button was clicked, update dialect box using chosen language and dialect data stored

    var parent = event.target.parentElement;
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    doCollapse(parent);

    //? Should we block progression if nothing is clicked?
    //? If nothing is clicked, what is the desired behavior



});