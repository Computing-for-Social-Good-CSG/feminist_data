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

// creates a group of inputs given the container, list of items, and type 
export function populateInputGroup(containerId, inputList, inputType, inputName) {

    // For each entry, create an element
    for (var i=0; i<inputList.length; i++)
    {
        inputFactory(inputList[i], containerId, inputType, inputName);
    }
}

// creates an HTML input object 
export function inputFactory(inputId, containerId, inputType, inputName){

    var container = document.getElementById(containerId);
    var formCheck = document.createElement("div")
    formCheck.classList.add("form-check");
    var checkBox = document.createElement('input');
    checkBox.classList.add("form-check-input");
    var label = document.createElement('label');
    label.classList.add("form-check-label");

    checkBox.type = inputType;
    checkBox.value = inputId;
    checkBox.id = inputId;
    label.setAttribute("for", inputId);

    // if it's a radio button, set the name attribute (prevents duplicate selection) 
    // if (inputType == "radio") {
    checkBox.name = inputName; // Always setting name currently, no downside
    // }

    label.appendChild(document.createTextNode(inputId));
    container.appendChild(formCheck);
    formCheck.appendChild(checkBox);
    formCheck.appendChild(label);
}

// creates group of HTML objects with bias citation links 
export function populateCiteGroup(containerId, inputList, inputContent, inputName){

    for (var i=0; i<inputList.length; i++){
        if (i%3 == 0){
            var inputId = inputList[i];
            var container = document.getElementById(containerId);
            var formCheck = document.createElement("div")
            formCheck.classList.add("form-check");
            var checkBox = document.createElement('input');
            checkBox.classList.add("form-check-input");
            var label = document.createElement('label');
            label.classList.add("form-check-label");
            var citeText = document.createElement("p");
            var link = document.createElement("a");

            checkBox.type = "checkbox";
            checkBox.value = inputId;
            checkBox.id = inputId;
            checkBox.checked = true;
            checkBox.name = inputName;
            citeText.textContent = " : " + inputContent[i];
            citeText.classList.add("cite-text");
            link.textContent = inputContent[i+1];
            link.setAttribute("href", inputContent[i+2]);
            link.classList.add("cite-link");
            label.setAttribute("for", inputId);

            label.appendChild(document.createTextNode(inputId));
            container.appendChild(formCheck);
            formCheck.appendChild(checkBox);
            formCheck.appendChild(label);
            formCheck.appendChild(citeText);
            formCheck.appendChild(link);
        }        
    }
}

export function populateDialectHeader(containerId, languageHeader, inputName) {
    // console.log("LANGUAGE HEADER: "+ languageHeader);
}

export function populateDialectGroup(containerId, inputDialect, inputName) {
    // console.log("DIALECT: "+ inputDialect);
   
        var container = document.getElementById(containerId);
        var formCheck = document.createElement("div")
        formCheck.classList.add("form-check");
        var checkBox = document.createElement('input');
        checkBox.classList.add("form-check-input");
        var label = document.createElement('label');
        label.classList.add("form-check-label");

        checkBox.type = "checkbox";
        checkBox.value = inputDialect;
        checkBox.id = inputDialect;
        checkBox.checked = false;
        checkBox.name = inputName;

        label.setAttribute("for", inputDialect);

        label.appendChild(document.createTextNode(inputDialect));
        container.appendChild(formCheck);
        formCheck.appendChild(checkBox);
        formCheck.appendChild(label);
}

export function populateCountryGroup(containerId, countryList, inputName) {
    // console.log("COUNTRY LIST: "+ countryList);
}

export function populateFormalityGroup(containerId, dialectHeader, inputFormality, inputName) {
    // console.log("DIALECT: "+ dialectHeader);
    // console.log("FORMALITY: "+ inputFormality);
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