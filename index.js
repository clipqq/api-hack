// const searchUrl = ''
// const apiKey = 'X1-ZWz1gmnxdi26tn_8tgid'
// EXAMPLE ----- 
// http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz1gmnxdi26tn_8tgid&state=wa&city=seattle&childtype=neighborhood

// https://api.jquery.com/jQuery.parseXML/

//// School Digger API Info
const apiKey = 'appID=5ae53d01&appKey=f3150e7d786a6d5de5cd3232ee0b4119'
const searchUrl = `https://api.schooldigger.com/v1.2/schools?${apiKey}&sortBy=rank&`
const schoolRankUrl = `${searchUrl}/v1.2/schools?`
// https://api.schooldigger.com/v1.2/schools?st=ca&city=san%20francisco&appID=5ae53d01&appKey=f3150e7d786a6d5de5cd3232ee0b4119


//// Google Maps API Info
const googleApiKey = 'AIzaSyDnrutrppg3LubVZPkD9uo0a1Jme-l0V6E'


//=====================================================

function apiStandardRequest(state, city, school_name, level, min_rank, max_rank) {
    const urlString = createStandardApiString(state, city, school_name, level, min_rank, max_rank)
    makeFetchRequest(urlString)
}

function createStandardApiString(state, city, school_name, level, min_rank, max_rank) {
    const rawInput = [state, city, school_name, level, min_rank, max_rank]

    const userInput = rawInput.filter(Boolean);
    console.log(userInput)

    let urlString = ''

    // switch cases for various user inputs
    switch (userInput.length) {
        case 1:
            urlString = `${searchUrl}st=${userInput[0]}`
        case 2:
            urlString = `${searchUrl}st=${userInput[0]}&city=${userInput[1]}`
            // case 3:
            //     urlString = `${searchUrl}st=${userInput[0]}&city=${userInput[1]}&q=${userInput[2]}&qSearchSchoolNameOnly=true`
            // case 4:
            //     urlString = `${searchUrl}st=${userInput[0]}&city=${userInput[1]}&q=${userInput[2]}`
    }

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
    $('.results').empty()
    for (let i = 0; i < jsonResult.schoolList.length; i++) {
        const name = jsonResult.schoolList[i].schoolName
        const url = jsonResult.schoolList[i].url
        const schoolId = jsonResult.schoolList[i].schoolid
        const address = jsonResult.schoolList[i].address.html
        // const score = (jsonResult.schoolList[i].rankHistory[0].averageStandardScore).toFixed(0)
        // <div class='name' id='${score}'>Score: ${score}</div>

        const level = jsonResult.schoolList[i].schoolLevel
        const streetAddress = jsonResult.schoolList[i].address.street
        const zipCode = jsonResult.schoolList[i].address.zip

        $('.results').append(`
        <div class='name' id='${name}'>${name}</div>
        <div class='name' id='${level}'>${level}</div>
        <div class='id' id='${schoolId}'>ID: ${schoolId}</div>
        <div class='address' id='${address}'>${address}</div>
        <div class='url' id='${url}'>${url}</div>
        <br>
    `)

        
    }
}

function renderMap(address) {
    console.log(address)
    const cleanAddress = address.replace(/ /g, '+')
    const searchItem = `https://www.google.com/maps/embed/v1/search?q=${cleanAddress}&key=${googleApiKey}`
    console.log(searchItem)

    $('.google-map').attr('src', searchItem)


    // console.log('rendered map')
    // const map = new google.maps.Map($('#map-box'), {
    //         center: {
    //             lat: -34.397,
    //             lng: 150.644
    //         },
    //         zoom: 8
    //     })
    }

    function getSchoolDetails(schoolId) {
        // apiRequest(schoolId)
    }

    function listenSubmit() {
        $('form').submit(function (e) {
            e.preventDefault();
            const state = $('#state').val()
            const city = $('#city').val()
            const schoolName = $('#school-name').val()

            console.log(state)
            apiStandardRequest(state, city, schoolName)
        });
    }

    function listenSchoolNameClick() {
        $('.results').on('click', $('.name'), function (e) {
            const detailClicked = e.target.id
            console.log(detailClicked)

            // update static map box
            renderMap(detailClicked)
        })
    }

    function main() {
        listenSubmit()
        listenSchoolNameClick()
    }

    $(main)