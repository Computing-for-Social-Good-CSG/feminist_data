import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 
var dataSourceArr = utils.pullData("Data Sources", "../data/data.json");
const baseBiasList = ["Age","Country","Gender","Race","Socioeconomic Class"];

class Dataset {
    constructor () {
        this.data_source = "";
        this.lang_major = "";
        this.lang_dialect = "";
        this.country_list = "";
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
document.addEventListener("click", function(event){
    if(event.target.name == "submit"){
        clickSubmit(event.target.parentElement);
    }
});

function clickSubmit(buttonParent) {
    var accordionContainer = document.getElementById('accordionContainer');
    var accordionList = accordionContainer.querySelectorAll(`[class*="accordion-collapse"]`);
    currentAccordion = utils.getCurrentAccordion(buttonParent, accordionList);

    // check that there is a selection
    if(utils.formEmpty(buttonParent)){
        //TODO No option was selected in this form, display some warning and do not continue
        return;
    }

    //TODO add an "other" option with write in 
    
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

// const langArr = utils.pullData("Language", "../data/data.json");

const countryArr = utils.pullData("Country", "../data/data.json");
utils.populateInputGroup("checkboxContainer2", countryArr, "checkbox");

// When Data Source is submitted, populate suggested biases 
document.getElementById("sourceSubmit").addEventListener("click", function(){
    
    // TODO if resubmitting, clear out all previous html elements

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
    utils.populateCiteGroup("inputSourceBias", knownBiasKeys, Object.values(sourceArr));

    // populate unchecked blanks for the rest
    var unknownBiasTitles = [] 
    for (var i=0; i<baseBiasList.length; i++){
        if (!knownBiasTitles.includes(baseBiasList[i])){
            unknownBiasTitles.push(baseBiasList[i]);
        }
    }
    utils.populateInputGroup("inputSourceBias", unknownBiasTitles, "checkbox");
})

// On submit, modify the database with date variables 
    // null checks built in to database class using set function
    // does not check for other garbage values before overwriting
document.getElementById("dateSubmit").addEventListener("click", function(){

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