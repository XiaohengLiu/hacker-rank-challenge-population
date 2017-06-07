/* requirement:
 *  - Use api provided by http://api.population.io:80/1.0. Get all the countries names
 *  - find the shortest names of the countries.
 *  - get top five population of the shortest names (by using API which you think is best on the api agent)
 *  - Display them in the UI with blue box
 *  - Click the name, change the color of box from blue to red, and send another api call to get the information of population of that country which are female of 18 in 2017
 *  - display the number next to the box with green color box
 *
 *  note:
 *  - no hard-code code
 *  - try to use javascript ONLY
 *  - you may not finish the whole project in 60 mins, do your best.
 */

// Add your javascript here
// To hit the API, replace the protocol and domain portion, as well as the API protocol with: https://population.simonsfoundation.org/
//IE http://api.population.io:80/1.0/countries becomes https://population.simonsfoundation.org/countries
// A sample can be seen below
// Notice the use of jsonp instead of json for dataType. This is required, as this is how our backend api proxy works

getCountries()
let countryPopu = [];
let shortestNames = [];
window.setTimeout(function() {
    if (countryPopu.length === 0 ) {
        countryPopu = shortestNames.slice(0,5);
    }
    insertHtml(countryPopu);
},3000);


function getCountries(){
    let apiData = {};
    let url = 'https://population.simonsfoundation.org/countries';

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data){
            shortestNames = getShortestNames(data.countries);
            console.log('shortestNames: ', shortestNames);
            getTopFive(shortestNames);
        },
        dataType: "jsonp"
    });
}

function getShortestNames(countries) {
    let minLength = 99;
    let shortestName = [];
    for (let country of countries) {
        minLength = country.length < minLength ? country.length : minLength;
    }
    for (let country of countries) {
        if (country.length === minLength) {
            shortestName.push(country);
        }
    }
    return shortestName;
}

/*
 * try to use 'promise', and promise.all to do the async, but browser didn't support (Nodejs feature)
 * So used some very ugly way (setTimeout....I know it is very bad...)
 * */
function getTopFive(countries) {
    let promises = [];
    for (let country of countries) {
        getPopulationForCountry(country);
    }

    function getPopulationForCountry(country) {
        //spend too much time figure out why the api didnt work so cannot finish the work.....
        let baseUrl = 'https://api.population.io:80/1.0/population/2017/';
        // let baseUrl = 'https://population.simonsfoundation.org/population/2017/';
        let url = baseUrl + country;
        console.log('url: ', url);

        $.ajax({
            url: url,
            method: 'GET',
            /* ------------- Can figure out why no response here, ignored --------------*/
            success: function(data){
                console.log('population back: ', data);
                let population = 0;
                for (let ele of data) {
                    population += ele.total;
                }
                countryPopu.push({name: country, total: population});
            },
            dataType: "jsonp"
        });
    }
}

function insertHtml(array) {
    let myDiv = document.getElementById('app');
    for (let country of array) {
        let cur = document.createElement("DIV");
        cur.className = 'unClick';
        cur.innerHTML = country;
        cur.onclick = function(event) {
            let name = event.target.innerHTML;
            let baseUrl = 'https://api.population.io:80/1.0/population/2017/18/';
            let url = baseUrl + name;
            console.log('getting countries population of age 18: ', url);

            $.ajax({
                url: url,
                method: 'GET',
                /* ------------- Can figure out why no response here, ignored --------------*/
                success: function(data){
                    console.log('age 18 data back: ', data);
                    let population = 0;
                    for (let ele of data) {
                        population += ele.total;
                    }
                    countryPopu.push({name: country, total: population});
                },
                dataType: "jsonp"
            });
        }
        myDiv.appendChild(cur);
    }
}