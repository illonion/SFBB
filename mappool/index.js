// Get mappool
let allTeams
async function getTeams() {
    const response = await fetch("../_data/teams.json")
    const responseJson = await response.json()
    allTeams = responseJson
}
getTeams()
const findTeamInTeamsJson = teamName => allTeams.find(team => team.team_name === teamName)

// Mod sections
const noModSectionEl = document.getElementById("noModSection")
const hiddenSectionEl = document.getElementById("hiddenSection")
const hardRockSectionEl = document.getElementById("hardRockSection")
const doubleTimeSectionEl = document.getElementById("doubleTimeSection")
const freemodSectionEl = document.getElementById("freemodSection")
const tiebreakerSectionEl = document.getElementById("tiebreakerSection")

// Get mappool
let allBeatmaps
async function getMappool() {
    const response = await fetch("../_data/beatmaps.json")
    const responseJson = await response.json()
    allBeatmaps = responseJson.beatmaps

    for (let i = 0; i < allBeatmaps.length; i++) {
        // Map information
        const mapInformation = document.createElement("div")
        mapInformation.classList.add("mapInformation")
        mapInformation.addEventListener("mousedown", mapClickEvent)
        mapInformation.addEventListener("contextmenu", function(event) {event.preventDefault()})
        mapInformation.dataset.id = allBeatmaps[i].beatmapID

        // Map text information
        const mapTextInformation = document.createElement("div")
        mapTextInformation.classList.add("mapTextInformation")

        const mapTextSongName = document.createElement("div")
        mapTextSongName.classList.add("mapTextSongName")
        mapTextSongName.innerText = allBeatmaps[i].songName

        const mapTextDifficultyName = document.createElement("div")
        mapTextDifficultyName.classList.add("mapTextDifficultyName")
        mapTextDifficultyName.innerText = allBeatmaps[i].difficultyname

        const mapTextAristName = document.createElement("div")
        mapTextAristName.classList.add("mapTextAristName")
        mapTextAristName.innerText = allBeatmaps[i].artist

        // Map star information
        const mapStarInformation = document.createElement("div")
        mapStarInformation.classList.add("mapStarInformation")
        mapStarInformation.innerText = Math.round(parseFloat(allBeatmaps[i].difficultyrating) * 100) / 100

        // Map out of order ban information
        const mapOutOfOrderInformation = document.createElement("div")
        mapOutOfOrderInformation.classList.add("mapOutOfOrderInformation")

        // Images
        const mapOutOfOrderBannerImage = document.createElement("img")
        mapOutOfOrderBannerImage.classList.add("mapOutOfOrderBannerImage")

        const mapOutOfOrderTextImage = document.createElement("img")
        mapOutOfOrderTextImage.classList.add("mapOutOfOrderTextImage")

        mapOutOfOrderInformation.append(mapOutOfOrderBannerImage, mapOutOfOrderTextImage)
        mapTextInformation.append(mapTextSongName, mapTextDifficultyName, mapTextAristName)
        mapInformation.append(mapTextInformation, mapStarInformation, mapOutOfOrderInformation)

        switch (allBeatmaps[i].mod) {
            case "NM":
                noModSectionEl.append(mapInformation)
                break
            case "HD":
                hiddenSectionEl.append(mapInformation)
                break
            case "HR":
                hardRockSectionEl.append(mapInformation)
                break
            case "DT":
                doubleTimeSectionEl.append(mapInformation)
                break
            case "FM":
                freemodSectionEl.append(mapInformation)
                break
            case "TB":
                mapInformation.style.alignItems = "center"
                mapInformation.style.height = "90px"
                tiebreakerSectionEl.append(mapInformation)
                break
        }
    }
}
getMappool()
const findMapInMappool = beatmapID => allBeatmaps.find(map => map.beatmapID === beatmapID)

// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
const socket = new ReconnectingWebSocket("ws://" + location.host + "/ws")
socket.onopen = () => { console.log("Successfully Connected") }
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!") }
socket.onerror = error => { console.log("Socket Error: ", error) }

// Team Name
const redTeamNameEl = document.getElementById("redTeamName")
const blueTeamNameEl = document.getElementById("blueTeamName")
let currentRedTeamName, currentBlueTeamName
// Team Players Container
const redTeamPlayersEl = document.getElementById("redTeamPlayers")
const blueTeamPlayersEl = document.getElementById("blueTeamPlayers")

// Referesh everything
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    if (currentRedTeamName !== data.tourney.manager.teamName.left && allTeams) {
        currentRedTeamName = data.tourney.manager.teamName.left
        redTeamNameEl.innerText = currentRedTeamName

        const currentTeam = findTeamInTeamsJson(currentRedTeamName)
        if (currentTeam) {
            redTeamPlayersEl.innerHTML = ""
            for (let i = 0; i < currentTeam.player_ids.length; i++) {
                const teamPlayerContainer = document.createElement("div")
                teamPlayerContainer.classList.add("teamPlayerContainer")

                const teamPlayerProfile = document.createElement("div")
                teamPlayerProfile.classList.add("teamPlayerProfile", "redTeamPlayerProfile")
                teamPlayerProfile.style.backgroundImage = `url("https://a.ppy.sh/${currentTeam.player_ids[i]}")`

                const teamPlayerName = document.createElement("div")
                teamPlayerName.classList.add("teamPlayerName")
                teamPlayerName.innerText = currentTeam.player_names[i]

                teamPlayerContainer.append(teamPlayerProfile, teamPlayerName)
                redTeamPlayersEl.append(teamPlayerContainer)
            }
        }
    }
    if (currentBlueTeamName !== data.tourney.manager.teamName.right && allTeams) {
        currentBlueTeamName = data.tourney.manager.teamName.right
        blueTeamNameEl.innerText = currentBlueTeamName

        const currentTeam = findTeamInTeamsJson(currentBlueTeamName)
        if (currentTeam) {
            blueTeamPlayersEl.innerHTML = ""
            for (let i = 0; i < currentTeam.player_ids.length; i++) {
                const teamPlayerContainer = document.createElement("div")
                teamPlayerContainer.classList.add("teamPlayerContainer")

                const teamPlayerProfile = document.createElement("div")
                teamPlayerProfile.classList.add("teamPlayerProfile", "blueTeamPlayerProfile")
                teamPlayerProfile.style.backgroundImage = `url("https://a.ppy.sh/${currentTeam.player_ids[i]}")`

                const teamPlayerName = document.createElement("div")
                teamPlayerName.classList.add("teamPlayerName")
                teamPlayerName.innerText = currentTeam.player_names[i]

                teamPlayerContainer.append(teamPlayerProfile, teamPlayerName)
                blueTeamPlayersEl.append(teamPlayerContainer)
            }
        }
    }
}

// Information about number of lives
let leftTotalLives = 0
let rightTotalLives = 0
let red1NumberOfLives = 0
let red2NumberOfLives = 0
let blue1NumberOfLives = 0
let blue2NumberOfLives = 0

// Number of lives
const redSlot1LivesEl = document.getElementById("redSlot1Lives")
const redSlot2LivesEl = document.getElementById("redSlot2Lives")
const blueSlot1LivesEl = document.getElementById("blueSlot1Lives")
const blueSlot2LivesEl = document.getElementById("blueSlot2Lives")

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

setInterval(() => {
    // Setting the number of lives
    leftTotalLives = getCookie("leftTotalLives")
    rightTotalLives = getCookie("rightTotalLives")
    red1NumberOfLives = getCookie("red1NumberOfLives")
    red2NumberOfLives = getCookie("red2NumberOfLives")
    blue1NumberOfLives = getCookie("blue1NumberOfLives")
    blue2NumberOfLives = getCookie("blue2NumberOfLives")

    redSlot1LivesEl.innerHTML = ""
    redSlot2LivesEl.innerHTML = ""
    blueSlot1LivesEl.innerHTML = ""
    blueSlot2LivesEl.innerHTML = ""

    // Red 1 number
    let red1Number = 0
    for (red1Number; red1Number < red1NumberOfLives; red1Number++) {
        redSlot1LivesEl.append(createHeart('heartFull'))
    }
    for (red1Number; red1Number < leftTotalLives; red1Number++) {
        redSlot1LivesEl.append(createHeart('heartBroken'))
    }

    // Red 2 number
    let red2Number = 0
    for (red2Number; red2Number < red2NumberOfLives; red2Number++) {
        redSlot2LivesEl.append(createHeart('heartFull'))
    }
    for (red2Number; red2Number < rightTotalLives; red2Number++) {
        redSlot2LivesEl.append(createHeart('heartBroken'))
    }

    // Blue 1 number
    let blue1Number = 0
    for (blue1Number; blue1Number < blue1NumberOfLives; blue1Number++) {
        blueSlot1LivesEl.append(createHeart('heartFull'))
    }
    for (blue1Number; blue1Number < leftTotalLives; blue1Number++) {
        blueSlot1LivesEl.append(createHeart('heartBroken'))
    }

    // Blue 2 number
    let blue2Number = 0
    for (blue2Number; blue2Number < blue2NumberOfLives; blue2Number++) {
        blueSlot2LivesEl.append(createHeart('heartFull'))
    }
    for (blue2Number; blue2Number < rightTotalLives; blue2Number++) {
        blueSlot2LivesEl.append(createHeart('heartBroken'))
    }
}, 500)

// Create heart full
function createHeart(heartStatus) {
    const newHeartFull = document.createElement("img")
    newHeartFull.setAttribute("src", `static/${heartStatus}.png`)
    return newHeartFull
}

// Map click event
function mapClickEvent() {
    // Team
    let team
    if (event.button === 0) team = "red"
    else if (event.button === 2) team = "blue"
    if (!team) return

    // Action
    let action = "pick"
    if (event.ctrlKey) action = "ban"
    if (event.shiftKey) action = "reset"

    // Current map
    const currentMap = findMapInMappool(parseInt(this.dataset.id))
    if (!currentMap) return

    // If map is reset
    if (action === "reset") {
        this.children[2].style.display = "none"
    }
    // If map is banned
    if (action === "ban") {
        // Ban section 
        this.children[2].style.display = "block"
        this.children[2].children[0].setAttribute("src", `static/out-of-stock-${team}-background.png`)
        this.children[2].children[1].setAttribute("src", `static/out-of-stock-${team}.png`)
    }
    // If map is picked
    if (action === "pick") {

    }
}

// Setting the next picker
const nextPickerEl = document.getElementById("nextPicker")
let currentNextPicker = "red"
function setNextPicker(colour) {
    nextPickerEl.innerText = colour[0].toUpperCase() + colour.substring(1)
    currentNextPicker = colour
}

// Toggle autopick
const autopickingButtonEl = document.getElementById("autopickingButton")
let isAutopickEnabled = false
function toggleAutopick() {
    isAutopickEnabled = !isAutopickEnabled
    autopickingButtonEl.innerText = `Toggle Autopick: ${(isAutopickEnabled)? "ON": "OFF"}`
}