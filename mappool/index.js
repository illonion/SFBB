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

        // Pick images
        const mapPickImage = document.createElement("img")
        mapPickImage.classList.add("mapPickImage")

        // Append everything together
        mapOutOfOrderInformation.append(mapOutOfOrderBannerImage, mapOutOfOrderTextImage)
        mapTextInformation.append(mapTextSongName, mapTextDifficultyName, mapTextAristName)
        mapInformation.append(mapTextInformation, mapStarInformation, mapOutOfOrderInformation, mapPickImage)

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

// Current beatmaps
let currentBeatmapId, currentBeatmapMd5

// Chat display
const chatDisplayEl = document.getElementById("chatDisplay")
let chatLen = 0

// IPC State
let ipcState
let setWinnerYet = false
let ids = [0,0,0,0]
let playScores = [0,0,0,0]

// Referesh everything
socket.onmessage = event => {
    const data = JSON.parse(event.data)

    if (currentRedTeamName !== data.tourney.manager.teamName.left && allTeams) {
        currentRedTeamName = data.tourney.manager.teamName.left
        redTeamNameEl.innerText = currentRedTeamName
        document.cookie = `redTeamName=${currentRedTeamName}; path=/`

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
        document.cookie = `blueTeamName=${currentBlueTeamName}; path=/`

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

    // Autopicking
    if (currentBeatmapId !== data.menu.bm.id || currentBeatmapMd5 !== data.menu.bm.md5 && allBeatmaps) {
        currentBeatmapId = data.menu.bm.id
        currentBeatmapMd5 = data.menu.bm.md5
        
        if (isAutopickEnabled) {
            // Find button to click on
            let element = document.querySelector(`[data-id="${currentBeatmapId}"]`)
    
            // Check if autopicked already
            if (!element.hasAttribute("data-is-autopicked") || element.getAttribute("data-is-autopicked") !== "true") {
                const event = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: (currentNextPicker === "red")? 0 : 2
                })
                element.dispatchEvent(event)
                element.setAttribute("data-is-autopicked", "true")
    
                if (currentNextPicker === "red") {
                    setNextPicker("blue")
                } else if (currentNextPicker === "blue") {
                    setNextPicker("red")
                }
            }
        }
    }

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

    // Get current score
    for (let i = 0; i < data.tourney.ipcClients.length; i++) {
        const currentPlayer = data.tourney.ipcClients[i]
        ids[i] = currentPlayer.spectating.userID
        playScores[i] = 0
        if (ids[i] !== 0) playScores[i] = currentPlayer.gameplay.score * ((currentPlayer.gameplay.mods.str.includes("EZ"))? 2 : 1)
    }

    // Winner stuff
    if (ipcState !== data.tourney.manager.ipcState) {
        ipcState = data.tourney.manager.ipcState
        if (ipcState === 4) {
            if (!setWinnerYet) {
                matchResultDisplayed = true
                let finalMinimumPlayScore = Math.min(...playScores.filter(score => score !== 0))
                for (let i = 0; i < data.tourney.ipcClients.length; i++) {
                    const currentPlayer = data.tourney.ipcClients[i]
                    const currentScore = currentPlayer.gameplay.score * ((currentPlayer.gameplay.mods.str.includes("EZ"))? 2 : 1)
                    if (currentScore === finalMinimumPlayScore) {
                        allWinners.push((i < data.tourney.ipcClients.length / 2)? "blue" : "red")
                        // Set all picks cookie information
                        document.cookie = `allWinners=${allWinners.join(",")} ; path=/`
                        break
                    }
                }
                setWinnerYet = true
            }
        } else {
            setWinnerYet = false
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
    newHeartFull.setAttribute("src", `static/hearts/${heartStatus}.png`)
    return newHeartFull
}

// Store picks somewhere
let allPicks = []
let allWinners = []
document.cookie = `allPicks=${allPicks.join(";")} ; path=/`
document.cookie = `allWinners=${allWinners.join(";")} ; path=/`

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
        this.children[3].style.display = "none"
        this.removeAttribute("data-is-autopicked")
        const index = allPicks.indexOf(parseInt(this.dataset.id))
        if (index !== -1) {
            allPicks.splice(index, 1)
            allWinners.splice(index, 1)
        }
    }
    // If map is banned
    if (action === "ban") {
        // Ban section 
        this.children[3].style.display = "none"
        this.children[2].style.display = "block"
        this.children[2].children[0].setAttribute("src", `static/out-of-stock/out-of-stock-${team}-background.png`)
        this.children[2].children[1].setAttribute("src", `static/out-of-stock/out-of-stock-${team}.png`)
    }
    // If map is picked
    if (action === "pick") {
        this.children[2].style.display = "none"
        this.children[3].style.display = "block"
        this.children[3].setAttribute("src", `static/picks/pick${team[0].toUpperCase() + team.substring(1)}.svg`)
        document.cookie= `currentPicker=${team}; path=/`
        console.log(this.dataset.id)
        allPicks.push(parseInt(this.dataset.id))
    }

    // Set all picks cookie information
    document.cookie = `allPicks=${allPicks.join(",")} ; path=/`
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