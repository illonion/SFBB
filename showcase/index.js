// ---------- Twitch Chat Section ----------
// Twitch Chat 
const chatDisplay = document.getElementById("chatDisplay")
ComfyJS.onChat = ( user, message, flags, self, extra ) => {
    console.log(user, message, flags, self, extra)

    // Get rid of nightbot messages
    if (user === "Nightbot") return

    // Message container 
    const messageContainer = document.createElement("div")
    messageContainer.classList.add("chatMessageContainer")
    messageContainer.setAttribute("id", extra.id)
    messageContainer.setAttribute("data-twitch-id", extra.userId)

    // Message user
    const messageUser = document.createElement("div")
    messageUser.classList.add("chatUser")
    messageUser.innerText = user

    // Message
    const chatMessage = document.createElement("div")
    chatMessage.classList.add("chatMessage")
    chatMessage.innerText = message

    // Append everything together
    messageContainer.append(messageUser, chatMessage)
    chatDisplay.append(messageContainer)
    chatDisplay.scrollTop = chatDisplay.scrollHeight
}

// Delete message
ComfyJS.onMessageDeleted = (id, extra) => document.getElementById(id).remove()

// Timeout
ComfyJS.onTimeout = ( timedOutUsername, durationInSeconds, extra ) => deleteAllMessagesFromUser(extra.timedOutUserId)

// Ban
ComfyJS.onBan = (bannedUsername, extra) => deleteAllMessagesFromUser(extra.bannedUserId)

// Delete all messages from user
function deleteAllMessagesFromUser(twitchId) {
    const allTwitchChatMessages = Array.from(document.getElementsByClassName("twitchChatMessage"))
    allTwitchChatMessages.forEach((message) => {
        if (message.dataset.twitchId === twitchId) {
            message.remove()
        }
    })
}

ComfyJS.Init( "shizunaa_tournaments" )

// ---------- Now Playing Information Section ----------
// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
const socket = new ReconnectingWebSocket("ws://" + location.host + "/ws")
socket.onopen = () => { console.log("Successfully Connected") }
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!") }
socket.onerror = error => { console.log("Socket Error: ", error) }

// Get mappool
let allBeatmaps
async function getMappool() {
    const response = await fetch("../_data/beatmaps.json")
    const responseJson = await response.json()
    allBeatmaps = responseJson.beatmaps
}
getMappool()
const findMapInMappool = beatmapID => allBeatmaps.find(map => map.beatmapID === beatmapID)

// Now playing information
const paperReceiptSectionModEl = document.getElementById("paperReceiptSectionMod")
const paperReceiptSectionSongNameDifficultyEl = document.getElementById("paperReceiptSectionSongNameDifficulty")
// Stats
const paperReceiptStatsSREl = document.getElementById("paperReceiptStatsSR")
const paperReceiptStatsBPMEl = document.getElementById("paperReceiptStatsBPM")
const paperReceiptStatsCSEl = document.getElementById("paperReceiptStatsCS")
const paperReceiptStatsAREl = document.getElementById("paperReceiptStatsAR")
const paperReceiptStatsLENEl = document.getElementById("paperReceiptStatsLEN")
// Replayer Name
const replayerNameEl = document.getElementById("replayerName")
// Styling attributes 
const paperReceiptStatsEl = document.getElementById("paperReceiptStats")
const paperReceiptSectionBelowInformationEl = document.getElementById("paperReceiptSectionBelowInformation")
const paperReceiptSectionTournamentNameTextEl = document.getElementById("paperReceiptSectionTournamentNameText")
const paperReceiptFullLineTopEl = document.getElementById("paperReceiptFullLineTop")
const paperReceiptFullLineBottomEl = document.getElementById("paperReceiptFullLineBottom")
const replaysTextEl = document.getElementById("replaysText")
// Variables
let currentMapId, currentMapMd5

socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    if (currentMapId !== data.menu.bm.id || currentMapMd5 !== data.menu.bm.md5 && allBeatmaps) {
        currentMapId = data.menu.bm.id
        currentMapMd5 = data.menu.bm.md5

        // Get name and difficulty of song
        paperReceiptSectionSongNameDifficultyEl.innerText = `${data.menu.bm.metadata.title} [${data.menu.bm.metadata.difficulty}]`
        adjustTops(paperReceiptSectionSongNameDifficultyEl.getBoundingClientRect().height)

        // Find map from mappool

    }
}

// Adjust heights and tops
function adjustTops(height) {
    paperReceiptStatsEl.style.top = `${66 + height}px`
    paperReceiptSectionBelowInformationEl.style.top = `${197 + height}px`
    paperReceiptSectionTournamentNameTextEl.style.top = `${235 + height}px`
    paperReceiptFullLineTopEl.style.top = `${265 + height}px`
    paperReceiptFullLineBottomEl.style.top = `${308 + height}px`
    replaysTextEl.style.top = `${278 + height}px`
}