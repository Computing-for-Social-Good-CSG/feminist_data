// Global Variables 
var collapseBlacklist = ["lang"]; // Expand as needed

// Get all radio input of parent and return true if none are toggled
export function formEmpty(accordionParent){

    // Blacklist, if no checkboxes are clicked in specific scenarios do not progress
    var parentName = accordionParent.getAttribute("name");
    var blacklisted = collapseBlacklist.includes(parentName);
    var inputs = accordionParent.querySelectorAll(`[name*="${parentName}"]`);
    var radios = accordionParent.querySelectorAll(`[type*="radio"]`);
    
    // If no radio inputs and not blacklisted
    if (!blacklisted && radios.length <= 0) {
        // Don't block submit button if there are no radio elements and not blacklisted
        return false;
    }

    // Check for any toggled inputs
    for (var i = 0; i < inputs.length; i++) {
        if(inputs[i].checked) {
            return false;
        }
    }
    return true;
}

// Get current accordion when given a list and a button pressed
export function getCurrentAccordion(buttonParent, accordionList){
    var iter = 0;

    while(iter < accordionList.length) {
        if(buttonParent == accordionList[iter].querySelectorAll(`[class*="accordion-body"]`)[0])
        {
            return iter;
        }
        iter++
    }

    console.log("Warning, current accordion not found");
    return 0;
}

// JSON key value extractor
export function pullData(key, jsonPath){

    var request = new XMLHttpRequest();
    request.open("GET", jsonPath, false);
    request.send(null);
    var my_JSON_object = JSON.parse(request.responseText);

    // Return an array of strings matching the group keyword
    return my_JSON_object[key];
}

// Known issue in below function: 
// var str = formCheck.querySelector(".cite-text").textContent;
// When checking the boxes below citations, such as "Race" a null read error occurs
// Needs a check to not read cite-text of other checkboxes in div, or will eventually be a non-issue as all get citation

function updateBias(biasTitle){
    var formCheck = document.getElementById(biasTitle).parentElement;
    var str = formCheck.querySelector(".cite-text").textContent;
    return(str.substring(3, str.length));
};

// creates a group of inputs 
export function populateInputGroup(containerId, allItems, selectedItems, inputType, inputName, helpItem, helpPrefix) {

    // TODO update to handle selected items 

    for (var i=0; i<allItems.length; i++) {
        if (helpItem) {
            inputFactory(containerId, allItems[i], inputType, inputName, null, helpItem[i], helpPrefix);
        } else {
            inputFactory(containerId, allItems[i], inputType, inputName, null);
        }
    }
}

// creates an single HTML input object 
export function inputFactory(containerId, inputId, inputType, inputName, selected, helpItem, helpPrefix){

    var container = document.getElementById(containerId);

    var formCheck = document.createElement("div");
    formCheck.classList.add("form-check");
    container.appendChild(formCheck);

    var checkBox = document.createElement('input');
    checkBox.classList.add("form-check-input");
    checkBox.type = inputType;
    checkBox.value = inputId;
    checkBox.id = inputId;
    checkBox.name = inputName;
    if (selected == true) {
        checkBox.checked = true;
    }
    formCheck.appendChild(checkBox);

    var label = document.createElement('label');
    label.classList.add("form-check-label");
    label.setAttribute("for", inputId);
    label.appendChild(document.createTextNode(inputId));
    formCheck.appendChild(label);

    // create help text 
    if (helpItem || helpPrefix) {
        var helpText = document.createElement('p');
        if (helpPrefix) {
            helpText.innerText = helpPrefix;
        }
        if (typeof helpItem == 'undefined') {
            helpText.innerText += ' none';
        } else {
            helpText.innerText += helpItem.join(', ');
        }
        helpText.classList.add("help-title");
        formCheck.appendChild(helpText);
    }

    return formCheck;
}

// creates group of HTML objects with bias citation links 
export function populateCiteGroup(containerId, inputList, inputContent, inputName){

    var container = document.getElementById(containerId);

    for (var i=0; i<inputList.length; i++){
        if (i%3 == 0){
            var formCheck = inputFactory(containerId, inputList[i], "checkbox", inputName, true);

            var citeText = document.createElement("p");
            citeText.textContent = " : " + inputContent[i];
            citeText.classList.add("cite-text");
            formCheck.appendChild(citeText);

            var link = document.createElement("a");
            link.textContent = inputContent[i+1];
            link.setAttribute("href", inputContent[i+2]);
            link.classList.add("cite-link");
            formCheck.appendChild(link);
        }        
    }
}

// creates a header for suggested items 
export function populateSuggestedHeader(containerId, text) {
    var container = document.getElementById(containerId);
    var header = document.createElement("h6");
    header.innerText = text;
    header.classList.add("suggested-header");
    container.appendChild(header);
}

// TODO add a parameter to populateInputGroup to have a box checked or not and remove this function 
// TODO this can be renamed as a checkbox factory or similar, not specific to biasGroup
export function populateBiasGroup(containerId, entries, selected, inputName) {
    
    // TODO list all countries, but only have the suggested ones selected 
    // -- the dialect country lists need to be parsed into a single large array 
    // console.log("ALL COUNTRY LIST: "+ countryList);
    // console.log(countryList.length);

    var container = document.getElementById(containerId);

    // populate selected elements 
    for (var i=0; i<selected.length; i++) {
        inputFactory(selected[i], containerId, "checkbox", "country");
    }


    // for (var i=0; i<entries.length; i++) {
    //     var inputId = entries[i];

    //     var formCheck = document.createElement("div");
    //     formCheck.classList.add("form-check");
    //     var checkBox = document.createElement('input');
    //     checkBox.classList.add("form-check-input");
    //     var label = document.createElement('label');
    //     label.classList.add("form-check-label");

    //     checkBox.type = "checkbox";
    //     checkBox.value = inputId;
    //     checkBox.id = inputId;
    //     checkBox.name = inputName;
    //     // if(selected) {
    //     //     checkBox.checked = true;
    //     // }

    //     label.setAttribute("for", inputId);
    //     label.appendChild(document.createTextNode(inputId));
    //     container.appendChild(formCheck);
    //     formCheck.appendChild(checkBox);
    //     formCheck.appendChild(label);
    // }

}

// Known issue in below function: 
// If a checked box gets removed, and will be re-added, this value is lost. Need a way to preserve state or re-check boxes if they re-appear
export function removeChildOfClass(containerId, childClass) {
    var containerTarget = document.getElementById(containerId);
    var choppingBlock = containerTarget.querySelectorAll(`[class*="${childClass}"]`);
    for (var i = 0; i < choppingBlock.length; i++){
        choppingBlock[i].remove();
    }
}