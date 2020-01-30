//// Weather API
const apiKey = '&key=99646a4685984166bf6dae4cdc8c41c1'
const baseWeatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=`
// &city=Raleigh,NC

//// Google Maps API Info
const googleApiKey = 'AIzaSyDnrutrppg3LubVZPkD9uo0a1Jme-l0V6E'
const googleMapEmbedQueryUrl = `https://www.google.com/maps/embed/v1/search?q=`

//=====================================================

function apiStandardRequest(city, state) {
    const urlString = createStandardApiString(city, state)
    makeFetchRequest(urlString)
}

function createStandardApiString(city, state) {
    const rawInput = [city, state]

    const userInput = rawInput.filter(Boolean)

    let urlString = ''

    // switch cases for various user inputs
    switch (userInput.length) {
        case 2:
            console.log('case 2 fired')
            urlString = `${baseWeatherUrl}${userInput[0]},${userInput[1]}`
            break
        case 1:
            console.log('case 1 fired')
            urlString = `${baseWeatherUrl}${userInput[0]}`
    }

    urlString = `${urlString}${apiKey}`

    // `${searchUrl}${userInput}${apiKey}`
    console.log(`making URL  ${urlString.trim()}`)
    return urlString.trim()
}

function makeFetchRequest(urlString) {
    fetch(urlString)
        .then(function(response) {
            if (response.ok === true) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(function(jsonResult) {
            renderHTML(jsonResult)
        })
        .catch(function(error) {
            console.log('hey something broke', error)
        })
}

function renderHTML(jsonResult) {
    console.log(`JSON res: ${jsonResult}`)
    // const resultArray = JSON.parse(jsonResult)
    // console.log(`PARSED ARRAY`, resultArray)

    $('.results').empty()
    const cityName = jsonResult.city_name
    const stateCode = jsonResult.state_code
    const countryCode = jsonResult.country_code

    console.log(cityName, stateCode, countryCode)

    $('.results').append(`
    <div class='targetGeo' id='targetGeo'>
    <h2>${cityName}, ${stateCode}, ${countryCode}</h2>
    </div>

    `)

    for (let i = 0; i < jsonResult.data.length; i++) {
        const date = jsonResult.data[i].datetime
        const temp = jsonResult.data[i].temp
        const descrip = jsonResult.data[i].weather.description
        const lowTemp = jsonResult.data[i].low_temp
        const highTemp = jsonResult.data[i].high_temp
        const precip = jsonResult.data[i].precip
        const snow = jsonResult.data[i].snow
        const windDirection = jsonResult.data[i].wind_cdir

        $('.results').append(`
        <section class='weather-tile'
        <div class='date' id='${date}'>${date}</div>
        <div class='temp' id='${temp}'>Average Temperature: ${temp}°C</div>
        <div class='descrip' id='${descrip}'>${descrip}</div>

        
        <div class='hidden-details' id='hidden-details'

        <div class='lowTemp' id='${lowTemp}'>Low: ${lowTemp}°C</div>
        <div class='highTemp' id='${highTemp}'>High: ${highTemp}°C</div>
        <div class='precip' id='${precip}'>Precipitation: ${precip} mm</div>
        <div class='snow' id='${snow}'>Snow: ${snow} mm</div>
        <div class='windDirection' id='${windDirection}'>Wind Direction: ${windDirection} </div>

        </div>

        </section>
        <br>
    `)
    }
}

function renderMap(address) {
    console.log(`sending to GoogleMaps: ${address}`)
    const cleanAddress = address.replace(/ /g, '+')
    const mapUrl = `${googleMapEmbedQueryUrl}${cleanAddress}&key=${googleApiKey}`

    $('.google-map').attr('src', mapUrl)
}

function listenSubmit() {
    $('form').submit(function(e) {
        e.preventDefault()
        const state = $('#state').val()
        const city = $('#city').val()

        renderMap(`${city}+${state}`)
        apiStandardRequest(city, state)
    })
}

function listenSchoolNameClick() {
    // $('.results').on('click', $('.name'), function (e) {
    //     const targetContainer = e.target.id
    //     console.log(targetContainer)
    // })
}

function main() {
    listenSubmit()
    listenTileClick()
}

$(main)
