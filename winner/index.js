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

}, 500)