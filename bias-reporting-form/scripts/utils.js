// Global Variables 


// Get all radio input of parent and return true if none are toggled
export function formEmpty(accordionParent){
    // TODO: Whitelist cases where this is acceptable, like if no radios exist in container
    var radios = accordionParent.querySelectorAll(`[name*="dataSource"]`);
    if (radios.length <= 0) {
        // Don't block submit button if there are no radio elements
        return false;
    }
    for (var i = 0; i < radios.length; i++) {
        console.log("THERE ARE RADIOS");

        if(radios[i].checked) {
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
    if (inputType == "radio") {
        checkBox.name = inputName;
    }

    label.appendChild(document.createTextNode(inputId));
    container.appendChild(formCheck);
    formCheck.appendChild(checkBox);
    formCheck.appendChild(label);
}
