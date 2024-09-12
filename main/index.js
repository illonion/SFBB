// Get mappool
let allBeatmaps
async function getMappool() {
    const response = await fetch("../_data/beatmaps.json")
    const responseJson = await response.json()
    allBeatmaps = responseJson.beatmaps
}
getMappool()

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
