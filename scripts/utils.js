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
        if (inputs[i].checked) {
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

// creates a group of inputs 
export function populateInputGroup(containerId, inputItems, inputType, inputName, helpItem, helpPrefix, selected) {
    for (var i=0; i<inputItems.length; i++) {
        if (helpItem) {
            inputFactory(containerId, inputItems[i], inputType, inputName, helpItem[i], helpPrefix, selected);
        } else {
            inputFactory(containerId, inputItems[i], inputType, inputName, null, null, selected);
        }
    }
}

// creates an single HTML input object 
export function inputFactory(containerId, inputId, inputType, inputName, helpItem, helpPrefix, selected) {

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
    if (inputId.includes("Other")) {
        label.appendChild(document.createTextNode("Other:"));
    } else {
        label.appendChild(document.createTextNode(inputId));
    }
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
export function populateCiteGroup(containerId, biasArr, inputName){
    var container = document.getElementById(containerId);
    var arrKeys = Object.keys(biasArr);
    var knownBiases = [];

    for (var i=0; i<arrKeys.length; i++){
        if (i%3 == 0){
            knownBiases.push(arrKeys[i]);

            var formCheck = inputFactory(containerId, arrKeys[i], "checkbox", inputName, null, null, true);

            var citeText = document.createElement("p");
            citeText.textContent = " : " + Object.values(biasArr)[i];
            citeText.classList.add("cite-text");
            formCheck.appendChild(citeText);

            var link = document.createElement("a");
            link.textContent = Object.values(biasArr)[i+1];
            link.setAttribute("href", Object.values(biasArr)[i+2]);
            link.classList.add("cite-link");
            formCheck.appendChild(link);
        }        
    }
    return(knownBiases);
}

// creates "other" text entry option 
export function inputOtherFactory(containerId, inputId, inputName, otherCounter) {
    var container = document.getElementById(containerId);
    var entryDiv = document.createElement("div");
    var useId = inputId;

    if (otherCounter) {
        useId = inputId + otherCounter;
    } 

    entryDiv.id = useId + "_div";

    var formCheck = inputFactory(containerId, useId, "checkbox", inputName);
    formCheck.classList.add("text-entry-holder");
    if (!otherCounter) {
        formCheck.querySelector("label").innerText = useId + ":";
    }
    
    var textEntry = document.createElement("input");
    textEntry.name = inputName;
    textEntry.id = useId + "Entry";
    textEntry.setAttribute("type", "text");
    formCheck.appendChild(textEntry);

    var formGroup = document.createElement("div");
    formGroup.classList.add("form-group");
    formGroup.classList.add("text-entry-holder");
    entryDiv.appendChild(formGroup);
    
    var citeLabel = document.createElement("label");
    citeLabel.setAttribute("for", useId + "Cite");
    citeLabel.innerText = "Citation:";
    formGroup.appendChild(citeLabel);

    var citeInput = document.createElement("input");
    citeInput.id = useId + "Cite";
    citeInput.type = "text";
    formGroup.appendChild(citeInput);

    var formGroup2 = document.createElement("div");
    formGroup2.classList.add("form-group");
    formGroup2.classList.add("text-entry-holder");   
    entryDiv.appendChild(formGroup2);

    var linkLabel = document.createElement("label");
    linkLabel.setAttribute("for", useId + "Link");
    linkLabel.innerText = "Link:";
    formGroup2.appendChild(linkLabel);

    var linkInput = document.createElement("input");
    linkInput.id = useId + "Link";
    linkInput.type = "text";
    formGroup2.appendChild(linkInput);

    container.appendChild(entryDiv);
}

export function populateOtherGroup(containerId, titleList, inputName) {
    for (var i=0; i<titleList.length; i++) {
        inputOtherFactory(containerId, titleList[i], inputName);
    }
}

// Known issue in below function: 
// var str = formCheck.querySelector(".cite-text").textContent;
// When checking the boxes below citations, such as "Race" a null read error occurs
// Needs a check to not read cite-text of other checkboxes in div, or will eventually be a non-issue as all get citation

export function updateBiases(dataSourceArr, data_obj, otherCounter){
    var biasArr = dataSourceArr[data_obj.data_source].Biases;
    if (document.getElementById("Age").checked) {
        data_obj.age = biasArr["Age"];
        data_obj.age_cite = biasArr["age_cite"];
        data_obj.age_link = biasArr["age_link"];
    } 
    if (document.getElementById("Country").checked) {
        data_obj.country_arr = biasArr["Country"];
        data_obj.country_cite = biasArr["country_cite"];
        data_obj.country_link = biasArr["country_link"];
    }
    if (document.getElementById("Gender").checked) {
        data_obj.gender = biasArr["Gender"];
        data_obj.gender_cite = biasArr["gender_cite"];
        data_obj.gender_link = biasArr["gender_link"];
    }
    if (document.getElementById("Race").checked) {
        data_obj.race = biasArr["Race"];
        data_obj.race_cite = biasArr["race_cite"];
        data_obj.race_link = biasArr["race_link"];
    }
    if (document.getElementById("Socioeconomic Class").checked) {
        data_obj.class = biasArr["Class"];
        data_obj.class_cite = biasArr["class_cite"];
        data_obj.class_link = biasArr["class_link"];
    }
    if (document.getElementById("Other1")) { 

        // TODO check if the box is selected

        for (var i=1; i<=otherCounter; i++) {
            var useId = "Other" + i;
            var itemArr = [];
            itemArr.push(document.getElementById(useId + "Entry").value);
            itemArr.push(document.getElementById(useId + "Cite").value);
            itemArr.push(document.getElementById(useId + "Link").value);
            data_obj.bias_other.push(itemArr);
        }
    }
};

// creates a header for suggested items 
export function populateSuggestedHeader(containerId, text, type) {
    var container = document.getElementById(containerId);
    if (type == "h5") {
        var header = document.createElement("h5");
        header.classList.add("suggested-h5");
    } else {
        var header = document.createElement("h6");
        header.classList.add("suggested-h6");
    }
    header.innerText = text;
    container.appendChild(header);
}

// Known issue in below function: 
// If a checked box gets removed, and will be re-added, this value is lost. Need a way to preserve state or re-check boxes if they re-appear
export function removeChildOfClass(containerId, childClass) {
    var containerTarget = document.getElementById(containerId);
    var choppingBlock = containerTarget.querySelectorAll(`[class*="${childClass}"]`);
    for (var i=0; i<choppingBlock.length; i++){
        choppingBlock[i].remove();
    }
}

// remove items from an array
export function removeItems(arr, toRemove) {
    var result = [];

    for (var i=0; i<arr.length; i++) {
        var index = arr.indexOf(toRemove[i]);
        if (index == -1) {
            result.push(arr[i]);
        }
    }
    return result;
}

// generate an item in final report 
export function populateReportItem(containerId, itemName, itemValue) {
    var container = document.getElementById(containerId);

    var r = document.createElement("div");
    r.classList.add("row");
    container.appendChild(r);

    var title_div = document.createElement("div");
    title_div.classList.add("col-4");
    title_div.classList.add("report-title");
    r.appendChild(title_div);
    var title = document.createElement("p");
    title.innerText = itemName;
    title_div.appendChild(title);

    var val_div = document.createElement("div");
    val_div.classList.add("col");
    val_div.classList.add("report-value");
    r.appendChild(val_div);
    var val = document.createElement("p");
    if (Array.isArray(itemValue) & itemValue.length > 1) {
        val.innerText = itemValue.join(", ");
    } else if (itemValue.length == 0) {
        val.innerText = "none";
    } else {
        val.innerText = itemValue;
    }
    val_div.appendChild(val);

    return(val_div);
}

export function populateReportBias(containerId, itemName, itemValue, citation, url) {
    if (itemValue != null) {
        var val_div = populateReportItem(containerId, itemName, itemValue);

        val_div.querySelector("p").classList.add("cite-text");

        var link = document.createElement("a");
        link.innerText = citation;
        link.setAttribute("href", url);
        link.classList.add("cite-link");
        val_div.appendChild(link);

        return(val_div);
    }
}

export function dateRangeStr(startVal, startEst, endVal, endEst) {
    var date_range = "";
    if (startEst) {
        date_range = startVal + "* to "; 
    } else {
        date_range = startVal + " to ";
    }
    if (endEst) { 
        date_range = date_range+ endVal + "*";
    }  else {
        date_range = date_range + endVal;
    }
    return(date_range);
}