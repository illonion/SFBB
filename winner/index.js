// Get mappool
let allBeatmaps
async function getMappool() {
    const response = await fetch("../_data/beatmaps.json")
    const responseJson = await response.json()
    allBeatmaps = responseJson.beatmaps
}
getMappool()
const findMapInMappool = beatmapID => allBeatmaps.find(map => map.beatmapID === beatmapID)

// Date
const dateNumberEl = document.getElementById("dateNumber")
let currentDate = new Date()
dateNumberEl.innerText = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`

// Team name
const teamNameTextEl = document.getElementById("teamNameText")
let redTeamName, blueTeamName, red1NumberOfLives, red2NumberOfLives, blue1NumberOfLives, blue2NumberOfLives

// Get Cookie
function getCookie(cname) {
    let name = cname + "="
    let ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1)
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// Main map section
const mainMapSectionEl = document.getElementById("mainMapSection")
let currentMapString, previousMapString
let currentWinnerString, previousWinnerString

// Change styling only
const mainReceiptEl = document.getElementById("mainReceipt")
const performationsBottomEl = document.getElementById("performationsBottom")

window.setInterval(() => {
    // Team name
    redTeamName = getCookie("redTeamName")
    blueTeamName = getCookie("blueTeamName")

    // Number of lives
    red1NumberOfLives = parseInt(getCookie("red1NumberOfLives"))
    red2NumberOfLives = parseInt(getCookie("red2NumberOfLives"))
    blue1NumberOfLives =parseInt(getCookie("blue1NumberOfLives"))
    blue2NumberOfLives = parseInt(getCookie("blue2NumberOfLives"))
    let redTotalLives = red1NumberOfLives + red2NumberOfLives
    let blueTotalLives = blue1NumberOfLives + blue2NumberOfLives

    // Set winning team
    let currentWinningTeam
    if (redTotalLives > blueTotalLives) {
        currentWinningTeam = "red"
        teamNameTextEl.innerText = redTeamName
    }
    else if (redTotalLives < blueTotalLives) {
        currentWinningTeam = "blue"
        teamNameTextEl.innerText = blueTeamName
    } else teamNameTextEl.innerText = ""
    teamNameTextEl.style.color = `var(--${currentWinningTeam}Win)`

    // if no maps, don't do anything
    if (!allBeatmaps) return

    // Get current maps
    currentMapString = getCookie("allPicks")
    mainMapSectionEl.innerHTML = ""
    let currentMaps = currentMapString.split(",")
    if (currentMapString !== previousMapString) {
        for (let i = 0; i < currentMaps.length; i++) {
            const currentMap = findMapInMappool(parseInt(currentMaps[i]))
            if (!currentMap) continue

            const newMapDiv = document.createElement("div")
            newMapDiv.innerText = `${currentMap.mod.toUpperCase()}${currentMap.order} - ${currentMap.songName} [${currentMap.difficultyname}]`
            
            const newDiv2Div = document.createElement("div")
            newDiv2Div.innerText = `${Math.round(parseFloat(currentMap.difficultyrating) * 100) / 100}`

            mainMapSectionEl.append(newMapDiv, newDiv2Div)
        }

        previousMapString = currentMapString
    }

    // Get current winners
    currentWinnerString = getCookie("allWinners")
    let currentWinners = currentWinnerString.split(",")
    if (currentWinnerString !== previousMapString) {
        let lowIterationNumber = Math.min(currentMaps.length, currentWinners.length)
        
        for (let i = 0; i < lowIterationNumber * 2; i += 2) {
            mainMapSectionEl.style.color = `var(--${currentWinners[Math.floor(i / 2)]}Win)`
        }
        previousMapString = currentWinnerString
    }

    // Set styles
    mainReceiptEl.style.height = `${mainMapSectionEl.getBoundingClientRect().height + 618.5}px`
    performationsBottomEl.style.top = `${mainMapSectionEl.getBoundingClientRect().height + 680}px`
}, 500)