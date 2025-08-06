import * as utils from './utils.js';
import * as search from './searches.js';

// Global Variables
var currentAccordion = 0; 
const baseBiasList = ["Age","Country","Language","Gender","Race","Socioeconomic Class"];
const baseFormalityList = ["Honorific", "Formal", "Vernacular", "Informal/Slang"];
const baseContextList = ["Academia", "Education", "Encyclopedia", "Historical", "Law", "Literature", "News", "Religious", "Spoken (conversational)", "Social Media"];
 
var langArr = utils.pullData("Languages", "https://computing-for-social-good-csg.github.io/feminist_data/data/languages.json");
var dataSourceArr = utils.pullData("Data Sources", "https://computing-for-social-good-csg.github.io/feminist_data/data/data_sources.json");

class Dataset {
    constructor () {
        this.data_source = "";
        this.bias_from_source = null;
        this.lang = [];
        this.dialect = [];
        this.dialect_by_lang = [];
        this.country_arr = [];
        this.formality = "";
        this.collect_start = "";
        this.collect_start_est = false;
        this.collect_end = "";
        this.collect_end_est = false;
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

// populate Data Sources 
utils.populateInputGroup("inputDataSource", Object.keys(dataSourceArr), "radio", "dataSource");

// when Data Source is submitted, populate suggested biases 
document.getElementById("submitSource").addEventListener("click", function(event){
    
    // PATTERN -- for every submit button 
    // remove existing items (in case of resubmission)
    utils.removeChildOfClass("inputSourceBias","form-check");
    utils.removeChildOfClass("inputSourceBias", "suggested-h6");
    utils.removeChildOfClass("inputSourceBias", "form-group");
    // wipe stored data (in case of resubmission)
    d.bias_from_source = [];
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
        var headerText = "Suggested biases based on the data source: " + d.data_source;
        utils.populateSuggestedHeader("inputSourceBias", headerText);
        knownBiases = utils.populateCiteGroup("inputSourceBias", dataSourceArr[d.data_source].Biases, "sourceBias");
    } else {
        var headerText = "No suggested biases based on the data source: " + d.data_source;
        utils.populateSuggestedHeader("inputSourceBias", headerText);
    }

    // populate possible, unknown biases 
    var headerText = "Other possible bias categories"
    utils.populateSuggestedHeader("inputSourceBias", headerText);
    var unknownBiasTitles = search.removeItems(baseBiasList, knownBiases); 
    utils.populateOtherGroup("inputSourceBias", unknownBiasTitles, "sourceBias");

    doCollapse(parent);
});

// add "Other" Data Source Biases on click 
var sourceBiasOtherCounter = 0;
document.getElementById("sourceBiasAddOther").addEventListener("click", function() {
    sourceBiasOtherCounter++;
    utils.inputOtherCite("inputSourceBias", "Other", "sourceBias", sourceBiasOtherCounter);
})

// when Data Source Biases are submitted, update database and populate languages 
document.getElementById("submitSourceBias").addEventListener("click", function(event) {
    utils.removeChildOfClass("inputLang", "suggested-h6");
    utils.removeChildOfClass("inputLang", "form-check");
    var parent = event.target.parentElement;
    var selectedBiases = Array.from(parent.querySelectorAll(`[name*="sourceBias"]:checked`)).map(checkbox => checkbox.value);
    if (selectedBiases.length > 0) {
        var biasArr = dataSourceArr[d.data_source].Biases;
        d.bias_from_source = utils.updateBiases(biasArr, selectedBiases, sourceBiasOtherCounter);
    }

    var otherLangs = Object.keys(langArr);
    if (Object.keys(d.bias_from_source).includes("Language")) { 

        // populate suggested language 
        var headerText = "Suggested language(s) for the data source: " + d.data_source;
        utils.populateSuggestedHeader("inputLang", headerText);
        utils.inputFactory("inputLang", d.bias_from_source["Language"][0], "checkbox", "lang", null, null, true);
        otherLangs = search.removeItems(otherLangs, d.bias_from_source["Language"][0]);
    } 

    // populate other languages 
    var headerText = "Other languages:";
    utils.populateSuggestedHeader("inputLang", headerText);
    utils.populateInputGroup("inputLang", otherLangs, "checkbox", "lang");
    doCollapse(parent);
});

// add "Other" Language on click 
var langOtherCounter = 0;
document.getElementById("langAddOther").addEventListener("click", function() {
    langOtherCounter++;
    utils.inputOtherFactory("inputLang", "Other", "lang", langOtherCounter);
})

// when Macro Language submitted, update Dialect options
document.getElementById("submitLang").addEventListener("click", function(event) {
    utils.removeChildOfClass("inputDialect","form-check");
    utils.removeChildOfClass("inputDialect", "suggested-h6");
    utils.removeChildOfClass("inputDialect", "suggested-h5");
    var parent = event.target.parentElement;
    var langNodes = parent.querySelectorAll(`[name*="lang"]:checked`);
    langNodes = Array.from(langNodes).map(checkbox => checkbox.value);
    d.lang = [];

    // language suggested by data source
    if (Object.keys(d.bias_from_source).includes("Language") && langNodes.includes(d.bias_from_source["Language"][0])) { 
        d.lang[d.bias_from_source["Language"][0]] = [];
    } else {

        // TODO Ask for confirmation: deselect previously selected language bias based on data source? 
        
        delete d.bias_from_source["Language"];
    }

    // add other Languages 
    for (var i=0; i<langNodes.length; i++) {
        if (!Object.keys(d.lang).includes(langNodes[i])) {

            // if it's a user-entered language 
            if (langNodes[i].includes("Other")) { 
                var userLang = document.getElementById(langNodes[i] + "Entry").value;
                d.lang[userLang] = [];
            } else {
                d.lang[langNodes[i]] = [];
            }
        }
    }

    // require a language to be selected
    var empty = isEmpty(parent);
    if (empty) {
        console.log("No selection, not taking any action")
        return;
    }

    // populate Dialects based on Macro Languages 
    for(var i=0; i<Object.keys(d.lang).length; i++) {
        var l = Object.keys(d.lang)[i];

        // no dialect data, break out early 
        if (!Object.keys(langArr).includes(l) || !langArr[l].hasOwnProperty("Dialects")) {
            var headerText = "No suggested dialects for the language: " + l;
            utils.populateSuggestedHeader("inputDialect", headerText, "h5");
            continue; 
        }

        var headerText = "Suggested dialects based on the language: " + l;
        utils.populateSuggestedHeader("inputDialect", headerText, "h5");
        var dialectArr = langArr[l].Dialects;
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

    var suggestedCountries = [];

    if (Object.keys(d.bias_from_source).includes("Country")) {
        var headerText = "Suggested countries for the data source: " + d.data_source;
        utils.populateSuggestedHeader("inputCountry", headerText, "h5");
        utils.inputFactory("inputCountry", d.bias_from_source["Country"][0], "checkbox", "countries", null, null, true);
        suggestedCountries.push(d.bias_from_source["Country"][0]);
    }

    // loop through macro languages 
    for (var x=0; x<Object.keys(d.lang).length; x++) {
        var l = Object.keys(d.lang)[x];
        var suggestByLang = [];
        var suggestByDialects = [];
        d.dialect_by_lang[x] = [];

        // no country data for the language, break out early 
        if (!Object.keys(langArr).includes(l) || !langArr[l].hasOwnProperty("Countries")) {
            var headerText = "No suggested countries for the language: " + l;
            utils.populateSuggestedHeader("inputCountry", headerText, "h5");
            continue; 
        } else {
            var langCountries = langArr[l].Countries;
            var headerText = "For the language: " + l;
            utils.populateSuggestedHeader("inputCountry", headerText, "h5");

            // populate suggested Countries
            var noCountryDialects = [];
            for (var i=0; i<d.dialect.length; i++) {

                // if the dialect exists in this language 
                if (Object.keys(langArr[l].Dialects).includes(d.dialect[i])) {
                    d.dialect_by_lang[x] = d.dialect_by_lang[x].concat(d.dialect[i]);
                    if (langArr[l].Dialects[d.dialect[i]].Countries) {
                        suggestByDialects = suggestByDialects.concat(langArr[l].Dialects[d.dialect[i]].Countries);
                        langCountries = search.removeItems(langCountries, suggestByDialects);
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
                editedDialects = search.removeItems(editedDialects, noCountryDialects);
            }
            if (suggestByDialects.length > 0) {
                var headerText = "";
                if (suggestedCountries.length > 0) { 
                    headerText = "Additional suggested countries based on the dialect(s): ";
                } else { 
                    headerText = "Suggested countries based on the dialect(s): ";
                }
                if (editedDialects.length > 0) {
                    headerText = headerText + editedDialects.join(", ");
                } else {
                    headerText = headerText + d.dialect_by_lang[x].join(", ");
                }
                utils.populateSuggestedHeader("inputCountry", headerText);
                suggestByDialects = search.removeItems(suggestByDialects, suggestedCountries);
                suggestByDialects.sort();
                suggestByDialects = [... new Set(suggestByDialects)];
                utils.populateInputGroup("inputCountry", suggestByDialects, "checkbox", "countries", null, null, true);
                suggestedCountries.push(suggestByDialects);
            } 

            // populate all other Countries of language
            var otherCountries = [];
            for (var i=0; i<langCountries.length; i++) {
                if (!suggestedCountries.includes(langCountries[i])) {
                    otherCountries.push(langCountries[i]);
                }
            }
            if (otherCountries.length == 0) {
                var headerText = "No other countries based on the language: " + l;
                utils.populateSuggestedHeader("inputCountry", headerText);
            } else {
                if (d.dialect > 0) { 
                    var headerText = "Other countries based on the language: " + l;
                } else {
                    var headerText = "Suggested countries based on the language: " + l;
                }
                utils.populateSuggestedHeader("inputCountry", headerText);
                otherCountries.sort();
                utils.populateInputGroup("inputCountry", otherCountries, "checkbox", "countries");
            }  
        }
    }
    doCollapse(parent);
});

// add "Other" Country on click 
var countryOtherCounter = 0;
document.getElementById("countryAddOther").addEventListener("click", function() {
    countryOtherCounter++;
    utils.inputOtherFactory("inputCountry", "Other", "countries", countryOtherCounter);
})

// when Countries are submitted, populate Context and Formality 
document.getElementById("submitCountry").addEventListener("click", function(event){
    utils.removeChildOfClass("inputFormality", "form-check");
    utils.removeChildOfClass("inputFormality", "suggested-h6");
    utils.removeChildOfClass("inputContext", "form-check");
    utils.removeChildOfClass("inputContext", "suggested-h6");
    var parent = event.target.parentElement;
    var countryNodes = parent.querySelectorAll(`[name*="countries"]:checked`);
    d.country_arr = Array.from(countryNodes).map(checkbox => checkbox.value);

    // check for user-created countries 
    for (var i=0; i<d.country_arr.length; i++) {
        if(d.country_arr[i].includes("Other")) {
            d.country_arr[i] = document.getElementById(d.country_arr[i] + "Entry").value;
        }
    } 

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
        var xLang = d.lang[x][0];
        if (langArr[xLang].hasOwnProperty("Dialects")) {
            for (var i=0; i<d.dialect_by_lang[x].length; i++) {
                var xDialect = d.dialect_by_lang[x][i];
                if (langArr[xLang].Dialects[xDialect].Formality) {
                    var xForms = langArr[xLang].Dialects[xDialect].Formality;
                    if (!suggestForm.includes(xForms)) {
                        suggestForm = suggestForm.concat(xForms);
                    }
                    suggestFormFrom.push(xDialect);
                } 
                if (langArr[xLang].Dialects[xDialect].Context) {
                    suggestContext = suggestContext.concat(langArr[xLang].Dialects[xDialect].Context);
                    suggestContextFrom.push(xDialect);
                } 
            }
        } 
    }

    if (suggestForm.length > 0) {
        var headerText = "Suggested formalities from: " + suggestFormFrom.join(", ");
        utils.populateSuggestedHeader("inputFormality", headerText);
        utils.populateInputGroup("inputFormality", suggestForm, "checkbox", "formality", null, null, true);

        var headerText = "Other formalities: ";
        utils.populateSuggestedHeader("inputFormality", headerText);
        var otherForm = search.removeItems(baseFormalityList, suggestForm);
        utils.populateInputGroup("inputFormality", otherForm, "checkbox", "formality");
    } else {
        var headerText = "No suggested formalities based on selected data sources or dialects.";
        utils.populateSuggestedHeader("inputFormality", headerText);
        utils.populateInputGroup("inputFormality", baseFormalityList, "checkbox", "formality");
    }
    
    if (suggestContext.length > 0) {
        var headerText = "Suggested contexts from: " + suggestContextFrom.join(", ");
        utils.populateSuggestedHeader("inputContext", headerText);
        suggestContext = [... new Set(suggestContext)];
        utils.populateInputGroup("inputContext", suggestContext, "checkbox", "context", null, null, true);
        var otherContext = search.removeItems(baseContextList, suggestContext);
        utils.populateInputGroup("inputContext", otherContext, "checkbox", "context");
    } else { 
        var headerText = "No suggested contexts based on selected data sources or dialects.";
        utils.populateSuggestedHeader("inputContext", headerText);
        utils.populateInputGroup("inputContext", baseContextList, "checkbox", "context");
    }    
    doCollapse(parent);
});

// when Formality and Context are submitted, open dates 
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

// generate final report 
var reportOrder = ["Age","Gender","Race","Socioeconomic Class"]; 
document.getElementById("finish").addEventListener("click", function(event) {
    utils.removeChildOfClass("reportBody", "row");
    var parent = event.target.parentElement;
   
    // requires all dates filled
    var dates = parent.querySelectorAll(`[type*="date"]`);
    for (var i = 0; i < dates.length; i++) {
        if(dates[i].value == "") {
            console.log("Empty date, taking no action");
            return false;
        }
    }

    if(d.set('timestamp_start', document.getElementById('startTimestamp').value)) {
       d.set('timestamp_start_est', document.getElementById('startTimestampEst').checked);
    }
    if (d.set('timestamp_end', document.getElementById('endTimestamp').value)) {
        d.set('timestamp_end_est', document.getElementById('endTimestampEst').checked);
    }
    if (d.set('collect_start', document.getElementById('startCol').value)) {
        d.set('collect_start_est', document.getElementById('startColEst').checked);
    }
    if (d.set('collect_end', document.getElementById('endCol').value)) {
        d.set('collect_end_est', document.getElementById('endColEst').checked);
    }

    utils.populateReportItem("reportBody", "Data Source", d.data_source); 

    var sourceBiasKeys = Object.keys(d.bias_from_source);
    for (var i=0; i<reportOrder.length; i++) {
        if (d.bias_from_source != null && sourceBiasKeys.includes(reportOrder[i])) { 
            utils.populateReportBias("reportBody", reportOrder[i], d.bias_from_source[reportOrder[i]]);
        } else {
            utils.populateReportItem("reportBody", reportOrder[i], "unknown");
        }
    }
    for (var i=0; i<sourceBiasKeys.length; i++) {
        if (sourceBiasKeys[i].includes("Other")) {
            utils.populateReportBias("reportBody", "Other", d.bias_from_source[sourceBiasKeys[i]]);
        }
    }

    var langList = Object.keys(d.lang);
    if (sourceBiasKeys.includes("Language")) { 
        var val_div = utils.populateReportBias("reportBody", "Language", d.bias_from_source["Language"]);
        if (langList.length > 1) {
            var val = document.createElement("p");
            if (langList.slice(1).length > 1) {
                val.innerText = langList.slice(1).join(", ");
            } else {
                val.innerText = langList.slice(1);
            }
            val_div.appendChild(val);
        }
    } else { 
        utils.populateReportItem("reportBody", "Language", langList);
    }

    utils.populateReportItem("reportBody", "Dialect", d.dialect);  
    utils.populateReportItem("reportBody", "Country", d.country_arr);
    utils.populateReportItem("reportBody", "Formality", d.formality);
    utils.populateReportItem("reportBody", "Context", d.context);
    utils.populateReportItem("reportBody", "Timestamps", utils.dateRangeStr(d.timestamp_start, d.timestamp_start_est, d.timestamp_end, d.timestamp_end_est));
    utils.populateReportItem("reportBody", "Collected", utils.dateRangeStr(d.collect_start, d.collect_start_est, d.collect_end, d.collect_end_est));

    doCollapse(parent);
});

document.getElementById("exportPDF").addEventListener("click", function(event) {
    var report = document.getElementById("reportContainer");
    var opt = {
        margin: 1,
        filename: "Dataset Bias Report.pdf",
        html2canvas: { scale: 2 },
        jsPDF:{ unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(report).save();
});