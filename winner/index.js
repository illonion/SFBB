// Date
const dateNumberEl = document.getElementById("dateNumber")
let currentDate = new Date()
dateNumberEl.innerText = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`