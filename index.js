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

    const userInput = rawInput.filter(Boolean);
    console.log(userInput)

    let urlString = ''

    // switch cases for various user inputs
    switch (userInput.length) {
        case 1:
            urlString = `${baseWeatherUrl}${userInput[0]}`
        case 2:
            urlString = `${baseWeatherUrl}${userInput[0]},${userInput[1]}`
    }

    urlString = `${urlString}${apiKey}`

    // `${searchUrl}${userInput}${apiKey}`
    console.log(`making URL  ${urlString.trim()}`)
    return urlString.trim()

}

function makeFetchRequest(urlString) {
    fetch(urlString)
        .then(function (response) {
            if (response.ok === true) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(function (jsonResult) {
            renderHTML(jsonResult)
        })
        .catch(function (error) {
            console.log("hey something broke", error)
        })
}

function renderHTML(jsonResult) {
    console.log(jsonResult)
    // const resultArray = JSON.parse(jsonResult)
    // console.log(`PARSED ARRAY`, resultArray)

    $('.results').empty()
    for (let i = 0; i < jsonResult.data.length; i++) {
        const date = jsonResult.data[i].datetime
        const temp = jsonResult.data[i].temp
        const descrip = jsonResult.data[i].weather.description


        $('.results').append(`
        <div class='date' id='${date}'>${date}</div>
        <div class='temp' id='${temp}'>${temp}</div>
        <div class='descrip' id='${descrip}'>${descrip}</div>

        <br>
    `)
    }
}

function renderMap(address) {
    console.log(address)
    const cleanAddress = address.replace(/ /g, '+')
    const mapUrl = `${googleMapEmbedQueryUrl}${cleanAddress}&key=${googleApiKey}`
    console.log(mapUrl)

    $('.google-map').attr('src', mapUrl)


    // console.log('rendered map')
    // const map = new google.maps.Map($('#map-box'), {
    //         center: {
    //             lat: -34.397,
    //             lng: 150.644
    //         },
    //         zoom: 8
    //     })
}
//// Google's code || sets map to user's location

function listenSubmit() {
    $('form').submit(function (e) {
        e.preventDefault();
        const state = $('#state').val()
        const city = $('#city').val()

        renderMap(`${city}+${state}`)
        apiStandardRequest(city, state)

    });
}

// function listenSchoolNameClick() {
//     $('.results').on('click', $('.name'), function (e) {
//         const detailClicked = e.target.id
//         console.log(detailClicked)

//         // update static map box
//         renderMap(detailClicked)
//     })
// }

function main() {
    listenSubmit()
    // listenSchoolNameClick()
}

$(main)