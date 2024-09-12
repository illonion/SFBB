// Elements aboudt number of lives
// Front
const gameplayRed1LivesContainerFrontEl = document.getElementById("gameplayRed1LivesContainerFront")
const gameplayRed2LivesContainerFrontEl = document.getElementById("gameplayRed2LivesContainerFront")
const gameplayBlue1LivesContainerFrontEl = document.getElementById("gameplayBlue1LivesContainerFront")
const gameplayBlue2LivesContainerFrontEl = document.getElementById("gameplayBlue2LivesContainerFront")
// Back
const gameplayRed1LivesContainerBackEl = document.getElementById("gameplayRed1LivesContainerBack")
const gameplayRed2LivesContainerBackEl = document.getElementById("gameplayRed2LivesContainerBack")
const gameplayBlue1LivesContainerBackEl = document.getElementById("gameplayBlue1LivesContainerBack")
const gameplayBlue2LivesContainerBackEl = document.getElementById("gameplayBlue2LivesContainerBack")

// Information about number of lives
let leftTotalLives = 0
let rightTotalLives = 0
let red1NumberOfLives = 0
let red2NumberOfLives = 0
let blue1NumberOfLives = 0
let blue2NumberOfLives = 0

// Get mappool
let allBeatmaps
async function getMappool() {
    const response = await fetch("../_data/beatmaps.json")
    const responseJson = await response.json()
    allBeatmaps = responseJson.beatmaps

    // Set number of lives
    switch (responseJson.roundName) {
        case "QF": case "SF":
            leftTotalLives = 3
            rightTotalLives = 3
            break
        case "F": case "GF":
            leftTotalLives = 4
            rightTotalLives = 3
            break
    }
    red1NumberOfLives = leftTotalLives
    red2NumberOfLives = rightTotalLives
    blue1NumberOfLives = leftTotalLives
    blue2NumberOfLives = rightTotalLives

    // Set all the hearts in all the slots
    setDisplayForNumberOfLives()

    if (gameplayRed1LivesContainerFrontEl.childElementCount === 4) {
        gameplayRed1LivesContainerFrontEl.style.width = "209px"
        gameplayBlue1LivesContainerFrontEl.style.width = "209px"
        gameplayRed1LivesContainerBackEl.style.width = "209px"
        gameplayBlue1LivesContainerBackEl.style.width = "209px"
    } else {
        gameplayRed1LivesContainerFrontEl.style.width = "165px"
        gameplayBlue1LivesContainerFrontEl.style.width = "165px"
        gameplayRed1LivesContainerBackEl.style.width = "165px"
        gameplayBlue1LivesContainerBackEl.style.width = "165px"
    }
}
getMappool()

// Create heart full
function createHeart(heartStatus) {
    const newHeartFull = document.createElement("img")
    newHeartFull.setAttribute("src", `static/${heartStatus}.png`)
    return newHeartFull
}

// Set number of lives
function setNumberOfLives(team, number, action) {
    if (team === "red" && number === "1" && action === "plus") red1NumberOfLives++
    else if (team === "red" && number === "1" && action === "minus") red1NumberOfLives--
    else if (team === "red" && number === "2" && action === "plus") red2NumberOfLives++
    else if (team === "red" && number === "2" && action === "minus") red2NumberOfLives--
    else if (team === "blue" && number === "1" && action === "plus") blue1NumberOfLives++
    else if (team === "blue" && number === "1" && action === "minus") blue1NumberOfLives--
    else if (team === "blue" && number === "2" && action === "plus") blue2NumberOfLives++
    else if (team === "blue" && number === "2" && action === "minus") blue2NumberOfLives--

    // Set bounds
    if (red1NumberOfLives > leftTotalLives) red1NumberOfLives = leftTotalLives
    if (red2NumberOfLives > rightTotalLives) red2NumberOfLives = rightTotalLives
    if (blue1NumberOfLives > leftTotalLives) blue1NumberOfLives = leftTotalLives
    if (blue2NumberOfLives > rightTotalLives) blue2NumberOfLives = rightTotalLives

    setDisplayForNumberOfLives()
}

function setDisplayForNumberOfLives() {
    gameplayRed1LivesContainerFrontEl.innerHTML = ""
    gameplayRed2LivesContainerFrontEl.innerHTML = ""
    gameplayBlue1LivesContainerFrontEl.innerHTML = ""
    gameplayBlue2LivesContainerFrontEl.innerHTML = ""

    // Red 1 number
    let red1Number = 0
    for (red1Number; red1Number < red1NumberOfLives; red1Number++) {
        gameplayRed1LivesContainerFrontEl.append(createHeart('heartFull'))
    }
    for (red1Number; red1Number < leftTotalLives; red1Number++) {
        gameplayRed1LivesContainerFrontEl.append(createHeart('heartBroken'))
    }

    // Red 2 number
    let red2Number = 0
    for (red2Number; red2Number < red2NumberOfLives; red2Number++) {
        gameplayRed2LivesContainerFrontEl.append(createHeart('heartFull'))
    }
    for (red2Number; red2Number < leftTotalLives; red2Number++) {
        gameplayRed2LivesContainerFrontEl.append(createHeart('heartBroken'))
    }

    // Blue 1 number
    let blue1Number = 0
    for (blue1Number; blue1Number < blue1NumberOfLives; blue1Number++) {
        gameplayBlue1LivesContainerFrontEl.append(createHeart('heartFull'))
    }
    for (blue1Number; blue1Number < leftTotalLives; blue1Number++) {
        gameplayBlue1LivesContainerFrontEl.append(createHeart('heartBroken'))
    }

    // Blue 2 number
    let blue2Number = 0
    for (blue2Number; blue2Number < blue2NumberOfLives; blue2Number++) {
        gameplayBlue2LivesContainerFrontEl.append(createHeart('heartFull'))
    }
    for (blue2Number; blue2Number < leftTotalLives; blue2Number++) {
        gameplayBlue2LivesContainerFrontEl.append(createHeart('heartBroken'))
    }
}

// Find maps in mappool
const findMapInMapool = beatmapID => allBeatmaps.find(beatmap => beatmap.beatmapID === beatmapID)

// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
const socket = new ReconnectingWebSocket("ws://" + location.host + "/ws")
socket.onopen = () => { console.log("Successfully Connected") }
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!") }
socket.onerror = error => { console.log("Socket Error: ", error) }

// Now Playing Receipt Section
const paperReceiptSectionPickerTextEl = document.getElementById("paperReceiptSectionPickerText")
const paperReceiptSectionModEl = document.getElementById("paperReceiptSectionMod")
const paperReceiptSectionSongNameDifficultyEl = document.getElementById("paperReceiptSectionSongNameDifficulty")
const paperReceiptStatsSREl = document.getElementById("paperReceiptStatsSR")
const paperReceiptStatsBPMEl = document.getElementById("paperReceiptStatsBPM")
const paperReceiptStatsCSEl = document.getElementById("paperReceiptStatsCS")
const paperReceiptStatsAREl = document.getElementById("paperReceiptStatsAR")
const paperReceiptStatsLENEl = document.getElementById("paperReceiptStatsLEN")
let currentMapID, currentMapMd5, foundMapInMappool = false

// Styling elements for now playing
const paperReceiptStatsEl = document.getElementById("paperReceiptStats")
const paperReceiptSectionBelowInformationEl = document.getElementById("paperReceiptSectionBelowInformation")
const paperReceiptSectionTournamentNameTextEl = document.getElementById("paperReceiptSectionTournamentNameText")

// Referesh everything
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Beatmap information
    if ((currentMapID !== data.menu.bm.id || currentMapMd5 !== data.menu.bm.md5) && allBeatmaps) {
        currentMapID = data.menu.bm.id
        currentMapMd5 = data.menu.bm.md5
        foundMapInMappool = false

        // Set song name and difficulty
        paperReceiptSectionSongNameDifficultyEl.innerText = `${data.menu.bm.metadata.title} [${data.menu.bm.metadata.difficulty}]`
        // Set heights / tops of certain elements
        const paperReceiptSectionSongNameDifficultyElHeight = paperReceiptSectionSongNameDifficultyEl.getBoundingClientRect().height
        paperReceiptStatsEl.style.top = `${154 + paperReceiptSectionSongNameDifficultyElHeight}px`
        paperReceiptSectionBelowInformationEl.style.top = `${285 + paperReceiptSectionSongNameDifficultyElHeight}px`
        paperReceiptSectionTournamentNameTextEl.style.top = `${322 + paperReceiptSectionSongNameDifficultyElHeight}px`

        const currentMap = findMapInMapool(currentMapID)
        if (currentMap) {
            foundMapInMappool = true

            // Set stats for found maps
            paperReceiptStatsSREl.innerText = `+ ${Math.round(parseFloat(currentMap.difficultyrating) * 100) / 100}★`
            paperReceiptStatsBPMEl.innerText = `+ ${parseFloat(currentMap.bpm)} BPM`
            paperReceiptStatsCSEl.innerText = `+ CS ${Math.round(parseFloat(currentMap.cs) * 10) / 10}`
            paperReceiptStatsAREl.innerText = `+ AR ${Math.round(parseFloat(currentMap.ar) * 10) / 10}`
            paperReceiptStatsLENEl.innerText = `+ ${displayLength(parseInt(currentMap.songLength))}`

            // Set mod text
            let modText = ""
            switch (currentMap.mod) {
                case "NM":
                    modText = `NO MOD ${currentMap.order}`
                    break
                case "HD":
                    modText = `HIDDEN ${currentMap.order}`
                    break
                case "HR":
                    modText = `HARD ROCK ${currentMap.order}`
                    break
                case "DT":
                    modText = `DOUBLE TIME ${currentMap.order}`
                    break
                case "FM":
                    modText = `FREE MOD ${currentMap.order}`
                    break
                case "TB":
                    modText = "TIEBREAKER"
                    break
            }
            paperReceiptSectionModEl.innerText = modText
        } else {
            paperReceiptSectionModEl.innerText = ""
        }
    }

    // If beatmap is not found
    if (!foundMapInMappool) {
        paperReceiptStatsSREl.innerText = `+ ${data.menu.bm.stats.fullSR}★`
        paperReceiptStatsBPMEl.innerText = `+ ${data.menu.bm.stats.BPM.common} BPM`
        paperReceiptStatsCSEl.innerText = `+ CS ${data.menu.bm.stats.CS}`
        paperReceiptStatsAREl.innerText = `+ AR ${data.menu.bm.stats.AR}`
        paperReceiptStatsLENEl.innerText = `+ ${displayLength(parseInt(data.menu.bm.time.full / 1000))}`
    }
}

function displayLength(songLengthSeconds) {
    // Length
    let totalSeconds = songLengthSeconds
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
}