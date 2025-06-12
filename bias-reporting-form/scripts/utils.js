// global variables here



// Get all radio input of parent and return true if none are toggled
export function formEmpty(accordionParent){
    var radios = accordionParent.querySelectorAll(`[name*="dataSource"]`);
    for (var i = 0; i < radios.length; i++) {
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