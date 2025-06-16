import * as utils from './utils.js';

// Global Variables
var currentAccordion = 0; 
const dataSourceArr = utils.pullData("Data Sources", "../data/data.json");

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

    set(varString, value) {
        if(varString != "" && varString != null && value != null && value != "") {
            this[varString] = value;
            return true;
        }

        if (typeof value == "boolean" && value == this[varString])
        {
            console.log("Value unchanged, ["+varString+":"+value+"], no action taken");
            return true;
        }

        console.log("Empty parameter found when setting database variable ["+varString+":"+value+"]");
        return false;
    }
}

const d = new Dataset;

// Add submit function to all buttons
// NOTE: I think buttons may be type "submit" in the future, when sending the radio values
document.addEventListener("click", function(event){
    if(event.target.name == "sourceSubmit"){
        console.log(event.target.name);

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
        currentAccordion++;
        var nextCollapsable = new bootstrap.Collapse(accordionList[currentAccordion], {
            toggle: false
        })
        nextCollapsable.show();
    }

    // On submit, modify the database with date variables
        // null checks built in to database class using set function
        // does not check for other garbage values before overwriting
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
}

// Populate initial form options
utils.populateInputGroup("inputDataSource", Object.keys(dataSourceArr), "radio", "dataSource");

const langArr = utils.pullData("Language", "../data/data.json");
utils.populateInputGroup("checkboxContainer1", langArr, "checkbox");
const countryArr = utils.pullData("Country", "../data/data.json");
utils.populateInputGroup("checkboxContainer2", countryArr, "checkbox");