
/* Text Area */
const textareaEl = document.getElementById("textarea")
let allObjects = []
function submit() {
    let textareaValue = textareaEl.value
    let textareaSplitLine = textareaValue.split("\n")
    allObjects = []
    
    for (let i = 0; i < textareaSplitLine.length; i++) {
        const textareaSplitCommas = textareaSplitLine[i].split(",")
        const object = {
            "team_name": textareaSplitCommas[0],
            "player_ids": [
                parseInt(textareaSplitCommas[1]),
                parseInt(textareaSplitCommas[3]),
                parseInt(textareaSplitCommas[5]),
                parseInt(textareaSplitCommas[7])
            ],
            "player_names": [
                textareaSplitCommas[2],
                textareaSplitCommas[4],
                textareaSplitCommas[6],
                textareaSplitCommas[8]
            ]
        }
        allObjects.push(object)
    }
    const teamsStr = "data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(allObjects))
    let mappoolAnchorElem = document.createElement("a")
    mappoolAnchorElem.setAttribute("href", teamsStr)
    mappoolAnchorElem.setAttribute("download", "teams.json")
    mappoolAnchorElem.click()
}