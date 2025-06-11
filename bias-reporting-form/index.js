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

document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById('sourceSubmit');
  button.addEventListener('click', function() {
    
    // check that there is a selection 

    // add an "other" option with write in 

    // add data source to object 
    d.data_source = document.querySelector('input[name="dataSource"]:checked').value;

    // close accordion element -- this works, but does not show the animation 
    document.getElementById('headingDataSource').getElementsByClassName('accordion-button')[0].classList.add('collapsed');
    document.getElementById('collapseDataSource').classList.remove('show');

    // this should work according to documentation 
    // https://getbootstrap.com/docs/4.0/components/collapse/#accordion-example
    // document.getElementById('headingDataSource').collapse();


    // open the next accordion element 
    
    console.log("clicked");
  });
});