// Elements aboudt number of lives
// Container
const gameplayRed1LivesContainerEl = document.getElementById("gameplayRed1LivesContainer")
const gameplayRed2LivesContainerEl = document.getElementById("gameplayRed2LivesContainer")
const gameplayBlue1LivesContainerEl = document.getElementById("gameplayBlue1LivesContainer")
const gameplayBlue2LivesContainerEl = document.getElementById("gameplayBlue2LivesContainer")
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
        gameplayRed1LivesContainerEl.style.width = "209px"
        gameplayRed2LivesContainerEl.style.width = "209px"
        gameplayBlue1LivesContainerEl.style.width = "209px"
        gameplayBlue2LivesContainerEl.style.width = "209px"
    } else {
        gameplayRed1LivesContainerFrontEl.style.width = "165px"
        gameplayBlue1LivesContainerFrontEl.style.width = "165px"
        gameplayRed1LivesContainerBackEl.style.width = "165px"
        gameplayBlue1LivesContainerBackEl.style.width = "165px"
        gameplayRed1LivesContainerEl.style.width = "165px"
        gameplayRed2LivesContainerEl.style.width = "165px"
        gameplayBlue1LivesContainerEl.style.width = "165px"
        gameplayBlue2LivesContainerEl.style.width = "165px"
    }
}
getMappool()

// Create heart full
function createHeart(heartStatus) {
    const newHeartFull = document.createElement("img")
    newHeartFull.setAttribute("src", `static/${heartStatus}.png`)
    return newHeartFull
}

// Gameplay screens
const gameplayRed1ScreenEl = document.getElementById("gameplayRed1Screen")
const gameplayRed2ScreenEl = document.getElementById("gameplayRed2Screen")
const gameplayBlue1ScreenEl = document.getElementById("gameplayBlue1Screen")
const gameplayBlue2ScreenEl = document.getElementById("gameplayBlue2Screen")
// No Lives Left
const gameplayRed1NoLivesLeftEl = document.getElementById("gameplayRed1NoLivesLeft")
const gameplayRed2NoLivesLeftEl = document.getElementById("gameplayRed2NoLivesLeft")
const gameplayBlue1NoLivesLeftEl = document.getElementById("gameplayBlue1NoLivesLeft")
const gameplayBlue2NoLivesLeftEl = document.getElementById("gameplayBlue2NoLivesLeft")

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
    if (red1NumberOfLives < 0) red1NumberOfLives = 0
    if (red2NumberOfLives < 0) red2NumberOfLives = 0
    if (blue1NumberOfLives < 0) blue1NumberOfLives = 0
    if (blue2NumberOfLives < 0) blue2NumberOfLives = 0

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
    for (red2Number; red2Number < rightTotalLives; red2Number++) {
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
    for (blue2Number; blue2Number < rightTotalLives; blue2Number++) {
        gameplayBlue2LivesContainerFrontEl.append(createHeart('heartBroken'))
    }

    // Set cookies
    document.cookie = `leftTotalLives=${leftTotalLives}; path=/`
    document.cookie = `rightTotalLives=${rightTotalLives}; path=/`
    document.cookie = `red1NumberOfLives=${red1NumberOfLives}; path=/`
    document.cookie = `red2NumberOfLives=${red2NumberOfLives}; path=/`
    document.cookie = `blue1NumberOfLives=${blue1NumberOfLives}; path=/`
    document.cookie = `blue2NumberOfLives=${blue2NumberOfLives}; path=/`
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

// Right hand side score details
const playingScoresEl = document.getElementById("playingScores")
let scoreVisible
/* Play Screens */
const playScreen1El = document.getElementById("playScreen1")
const playScreen2El = document.getElementById("playScreen2")
const playScreen3El = document.getElementById("playScreen3")
const playScreen4El = document.getElementById("playScreen4")
const playScreens = [playScreen1El, playScreen2El, playScreen3El, playScreen4El]
let ids = [0,0,0,0]
/* Play Screen Scores */
const playScreen1ScoreEl = document.getElementById("playScreen1Score")
const playScreen2ScoreEl = document.getElementById("playScreen2Score")
const playScreen3ScoreEl = document.getElementById("playScreen3Score")
const playScreen4ScoreEl = document.getElementById("playScreen4Score")
let playScores = [0,0,0,0]

const scoreAnimation = {
    playScreen1Score: new CountUp(playScreen1ScoreEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    playScreen2Score: new CountUp(playScreen2ScoreEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    playScreen3Score: new CountUp(playScreen3ScoreEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    playScreen4Score: new CountUp(playScreen4ScoreEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
}

// IPC State
let ipcState, matchResultDisplayed

// Chat Display
const chatDisplayContainerEl = document.getElementById("chatDisplayContainer")
const chatDisplayEl = document.getElementById("chatDisplay")
let chatLen = 0

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

    // Score visibility
    if (scoreVisible !== data.tourney.manager.bools.scoreVisible) {
        scoreVisible = data.tourney.manager.bools.scoreVisible
        if (scoreVisible) {
            playingScoresEl.style.opacity = 1
            chatDisplayContainerEl.style.opacity = 0
        } else {
            playingScoresEl.style.opacity = 0
            chatDisplayContainerEl.style.opacity = 1
        }
    }

    // Update frames, positions, and scores
    if (scoreVisible) {
        // 1st - Populate all the details, remove the play screens if they do not exist.
        for (let i = 0; i < data.tourney.ipcClients.length; i++) {
            const currentPlayer = data.tourney.ipcClients[i]
            ids[i] = currentPlayer.spectating.userID
            if (ids[i] !== 0) {
                playScreens[i].style.display = "block"
                playScreens[i].setAttribute("class", (currentPlayer.team === "left") ? "redTeam" : "blueTeam")
                playScreens[i].children[0].setAttribute("src", `https://a.ppy.sh/${ids[i]}`)
                playScreens[i].children[1].innerText = currentPlayer.spectating.name
                playScores[i] = currentPlayer.gameplay.score * ((currentPlayer.gameplay.mods.str.includes("EZ"))? 2 : 1)
                scoreAnimation[`playScreen${i + 1}Score`].update(playScores[i])
            } else {
                playScreens[i].style.display = "none"
                playScores[i] = 0
            }
        }

        // Go through all scores
        playScores = playScores.sort((a, b) => b - a)
        let currentPlayerRank = 0

        // Sort all the panels
        while (currentPlayerRank < 4) {
            for (let i = 0; i < data.tourney.ipcClients.length; i++) {
                const currentPlayer = data.tourney.ipcClients[i]
                const currentScore = currentPlayer.gameplay.score * ((currentPlayer.gameplay.mods.str.includes("EZ"))? 2 : 1)
                if (currentScore === playScores[currentPlayerRank]) {
                    playScreens[i].style.top = `${currentPlayerRank * 110}px`
                    break
                }
            }
            currentPlayerRank++
        }
    }

    // IPC state
    if (ipcState !== data.tourney.manager.ipcState) {
        ipcState = data.tourney.manager.ipcState
        if (ipcState === 4 && !matchResultDisplayed) {
            matchResultDisplayed = true
            let finalMinimumPlayScore = Math.min(...playScores.filter(score => score !== 0))
            console.log(finalMinimumPlayScore)
            for (let i = 0; i < data.tourney.ipcClients.length; i++) {
                const currentPlayer = data.tourney.ipcClients[i]
                const currentScore = currentPlayer.gameplay.score * ((currentPlayer.gameplay.mods.str.includes("EZ"))? 2 : 1)
                if (currentScore === finalMinimumPlayScore) {
                    console.log(currentScore)
                    let team = (i < data.tourney.ipcClients.length / 2)? "red" : "blue"
                    let number = (i % 2 === 0)? "1" : "2"
                    setNumberOfLives(team, number, "minus")
                    break
                }
            }
        } else {
            matchResultDisplayed = false
        }
    }

    if (!scoreVisible) {
        // Chat Stuff
        // This is also mostly taken from Victim Crasher: https://github.com/VictimCrasher/static/tree/master/WaveTournament
        if (chatLen !== data.tourney.manager.chat.length) {
            (chatLen === 0 || chatLen > data.tourney.manager.chat.length) ? (chatDisplayEl.innerHTML = "", chatLen = 0) : null;
            const fragment = document.createDocumentFragment();

            for (let i = chatLen; i < data.tourney.manager.chat.length; i++) {
                const chatColour = data.tourney.manager.chat[i].team;

                // Chat message container
                const chatMessageContainer = document.createElement("div")
                chatMessageContainer.classList.add("chatMessageContainer")
                chatMessageContainer.classList.add(`${chatColour}Chat`)

                // Name
                const chatUser = document.createElement("div")
                chatUser.classList.add("chatUser")
                chatUser.innerText = data.tourney.manager.chat[i].name;

                // Message
                const chatMessage = document.createElement("div")
                chatMessage.classList.add("chatMessage")
                chatMessage.innerText = data.tourney.manager.chat[i].messageBody

                chatMessageContainer.append(chatUser, chatMessage)
                fragment.append(chatMessageContainer)
            }

            chatDisplayEl.append(fragment)
            chatLen = data.tourney.manager.chat.length;
            chatDisplayEl.scrollTop = chatDisplayEl.scrollHeight;
        }
    }
}

function displayLength(songLengthSeconds) {
    // Length
    let totalSeconds = songLengthSeconds
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
}

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

// Set current picker
let currentPicker = "red"
function setCurrentPicker() {
    paperReceiptSectionPickerTextEl.innerText = currentPicker.toUpperCase()
    if (currentPicker === "red") {
        paperReceiptSectionPickerTextEl.classList.remove("mainBlueColour")
        paperReceiptSectionPickerTextEl.classList.add("mainRedColour")
        paperReceiptStatsEl.classList.remove("mainBlueColour")
        paperReceiptStatsEl.classList.add("mainRedColour")
    } else {
        paperReceiptSectionPickerTextEl.classList.add("mainBlueColour")
        paperReceiptSectionPickerTextEl.classList.remove("mainRedColour")
        paperReceiptStatsEl.classList.add("mainBlueColour")
        paperReceiptStatsEl.classList.remove("mainRedColour")
    }
    document.cookie= `currentPicker=${currentPicker}; path=/`
}

// Set current picker from mappool
setInterval(() => {
    currentPicker = getCookie("currentPicker")
    setCurrentPicker()
}, 500)

// Manually set current picker
function manualSetCurrentPicker(colour) {
    document.cookie= `currentPicker=${colour}; path=/`
    currentPicker = colour
    setCurrentPicker()
}