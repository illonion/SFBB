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

socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)
}