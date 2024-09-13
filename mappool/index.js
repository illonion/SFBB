// Get mappool
let allTeams
async function getTeams() {
    const response = await fetch("../_data/teams.json")
    const responseJson = await response.json()
    allTeams = responseJson
}
getTeams()
const findTeamInTeamsJson = teamName => allTeams.find(team => team.team_name === teamName)

// Get mappool
let allBeatmaps
async function getMappool() {
    const response = await fetch("../_data/beatmaps.json")
    const responseJson = await response.json()
    allBeatmaps = responseJson.beatmaps
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