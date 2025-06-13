import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 

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

    indexHandler(req, res) {
        if (!req.isAuthenticated()) {
            return res.end(`
            <body>
                <h3>Hello stranger!</h3>
                <p>You're not authenticated, you need to <a href="/login">authenticate via Typeform</a>.
            </body>
            `)
        }

        if (this.DEFAULT_FORM_ID) {
            return res.redirect(`/results/${this.DEFAULT_FORM_ID}`);
        }

        let data = JSON.stringify(req.user);
        return res.end(`
        <body>
            <h3>Hello, %username%!</h3>
            <p>Here's your token:</p><p style="color: blue;">${data}</p>
            <p>Maybe you want to <a href="/logout">log out</a>?</p>
        </body>
        `);
    }
}

const d = new Dataset;

// Not necessary when scripts are loaded as modules
// document.addEventListener("DOMContentLoaded", function() {
// });

// Add submit function to all buttons
// NOTE: I think buttons may be type "submit" in the future, when sending the radio values
document.addEventListener("click", function(event){
    if(event.target.name == "sourceSubmit"){
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
        console.log("Empty Form, you must select one option to continue");
        return;
    }

    //TODO add an "other" option with write in 

    // add data source to object 
    d.data_source = document.querySelector('input[name="dataSource"]:checked').value;


    // close current accordion element
    var currentCollapsable = new bootstrap.Collapse(accordionList[currentAccordion], {
        toggle: false
    })
    currentCollapsable.hide();

    // If there is a next section
    if(currentAccordion+1 < accordionList.length) {

        // open the next accordion element
        // TODO, fix issue where it closes the next element if it is open
        currentAccordion++;
        var nextCollapsable = new bootstrap.Collapse(accordionList[currentAccordion], {
            toggle: true
        })
        nextCollapsable.show();
    }
}

// Just a test, can place wherever
utils.populateCheckboxAccordion("checkboxContainer1", "Language", "../data/data.json");
utils.populateCheckboxAccordion("checkboxContainer2", "Country", "../data/data.json");