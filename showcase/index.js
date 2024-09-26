// Twitch Chat
const twitchChatContainer = document.getElementById("twitchChatContainer")
const badgeTypes = ["broadcaster", "mod", "vip", "founder", "subscriber"]
ComfyJS.onChat = ( user, message, flags, self, extra ) => {
    console.log(user, message, flags, self, extra)
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