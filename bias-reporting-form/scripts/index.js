import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 
var dataSourceArr = utils.pullData("Data Sources", "../data/data.json");

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
}

const d = new Dataset;

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
const langArr = utils.pullData("Language", "../data/data.json");
utils.populateInputGroup("checkboxContainer1", langArr, "checkbox");
const countryArr = utils.pullData("Country", "../data/data.json");
utils.populateInputGroup("checkboxContainer2", countryArr, "checkbox");

// When Data Source is submitted, populate suggested biases 
document.getElementById("sourceSubmit").addEventListener("click", function(){
    
    // TODO if resubmitting, clear out all previous html elements

    d.data_source = document.querySelector('input[name="dataSource"]:checked').value;
    var biasItems = dataSourceArr[d.data_source];
    utils.populateCiteGroup("inputSourceBias", Object.keys(biasItems), Object.values(biasItems));

})