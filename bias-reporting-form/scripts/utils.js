// global variables here



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

// Populate an accordion with check boxes given key, json, and accordion to target
export function populateCheckboxAccordion(containerId, key, jsonPath, inputType) {
    // Util call to parse json
    var checkBoxStrings = pullData(key, jsonPath);

    // For each entry, create an element
    for (var i=0; i<checkBoxStrings.length; i++)
    {
        checkboxFactory(checkBoxStrings[i], containerId, inputType);
    }
}


// Checkbox creator
export function checkboxFactory(description, containerId, inputType, inputName){

    var container = document.getElementById(containerId);
    var formCheck = document.createElement("div")
    formCheck.classList.add("form-check");
    var checkBox = document.createElement('input');
    checkBox.classList.add("form-check-input");
    var label = document.createElement('label');
    label.classList.add("form-check-label");

    checkBox.type = inputType;
    checkBox.value = description;
    checkBox.id = description;
    label.setAttribute("for", description);

    // if it's a radio button, set the name attribute 
    if (inputType == "radio") {
        checkBox.name = inputName;
    }


    label.appendChild(document.createTextNode(description));
    container.appendChild(formCheck);
    formCheck.appendChild(checkBox);
    formCheck.appendChild(label);
}