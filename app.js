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

getCountriesInfo();
let countryPopu = [];
window.setTimeout(function() {
    countryPopu.sort(function(first, second) {
        return second.total - first.total;
    });
    countryPopu = countryPopu.slice(0,5);
    console.log('sorted: ', countryPopu);
    insertHtml(countryPopu);
},3000);


function getCountriesInfo(){
    let url = 'https://population.simonsfoundation.org/countries';

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data){
            let shortestNames = getShortestNames(data.countries);
            getPopulationForShortestName(shortestNames);
        },
        dataType: "jsonp"
    });


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
     * Maybe the best way to do this is to use Javascript Promise module:
     *   - Promise.all(PROMISE_QUEUE): when everything in the promise queue has return, then start doing something else.
     *   - but it needs API to return promise.
     * So I used a nasty way "setTimeout" to wait for all the data ready.
     * We can also do nested AJAX call
     */
    function getPopulationForShortestName(countries) {
        let promiseQueue = [];
        for (let country of countries) {
            getPopulationByName(country);
        }

        function getPopulationByName(country) {
            let baseUrl = 'https://population.simonsfoundation.org/population/2017/';
            let url = baseUrl + country;
            console.log('url: ', url);

            $.ajax({
                url: url,
                method: 'GET',
                success: function(data){
                    let countryObj = {name: country};
                    let population = 0;
                    for (let ele of data) {
                        if (ele.age === 18) {
                            countryObj.female18 = ele.females;
                            countryObj.male18 = ele.males;
                        }
                        population += ele.total;
                    }
                    countryObj.total = population;
                    console.log(countryObj);
                    countryPopu.push(countryObj);
                },
                dataType: "jsonp"
            });
        }
    }
}

function insertHtml(array) {
    let myDiv = document.getElementById('app');
    myDiv.innerHTML = "";

    let nameColumn = document.createElement("DIV");
    nameColumn.className = 'columnTitle';
    nameColumn.innerHTML = "NAME";
    myDiv.appendChild(nameColumn);

    let totalColumn = genereateColumnTitle('TOTAL');
    let maleColumn = genereateColumnTitle("MALE 18")
    let femaleColumn = genereateColumnTitle("FEMALE 18")

    myDiv.appendChild(totalColumn);
    myDiv.appendChild(maleColumn);
    myDiv.appendChild(femaleColumn);
    myDiv.appendChild(document.createElement("BR"));

    for (let country of array) {
        let nameDiv = document.createElement("DIV");
        nameDiv.className = 'notClicked';
        nameDiv.innerHTML = country.name;

        let populationDiv = genereatePopulationDiv()
        let femaleDiv = genereatePopulationDiv()
        let maleDiv = genereatePopulationDiv()

        myDiv.appendChild(nameDiv);
        myDiv.appendChild(populationDiv);
        myDiv.appendChild(femaleDiv);
        myDiv.appendChild(maleDiv);
        myDiv.appendChild(document.createElement("BR"));

        nameDiv.onclick = function(event) {
            nameDiv.className = "clicked";
            populationDiv.innerHTML = country.total;
            femaleDiv.innerHTML = country.female18;
            maleDiv.innerHTML = country.male18;
        }
    }

    function genereatePopulationDiv() {
        let result = document.createElement("DIV");
        result.className = "population";
        result.innerHTML = "N/A"
        return result;
    }

    function genereateColumnTitle(title) {
        let column = document.createElement("DIV");
        column.className = 'columnTitle';
        column.innerHTML = title;
        return column;
    }
}