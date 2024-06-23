let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))
const tabBtn = document.getElementById("tab-btn")
const messageEl = document.getElementById("message")
const searchEl = document.getElementById("search-el"); // New input field for search

// searchEl.addEventListener("input", function() {
//     const query = searchEl.value.toLowerCase();
//     const filteredLeads = myLeads.filter(lead => lead.url.toLowerCase().includes(query) || lead.category.toLowerCase().includes(query));
//     render(filteredLeads);
// });


if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function() {    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        const url = tabs[0].url
        if(myLeads.some((ele)=>ele === url)){
        showMessage("URL already exists");
        }else if (isValidUrl(url)) {
           console.log(myLeads);
            myLeads.push(url)
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render(myLeads)
            showMessage("URL saved")
        } else {
            showMessage("Invalid URL")
        }
    })
})

inputBtn.addEventListener("click", function() {
    const url = inputEl.value
    if(myLeads.some((ele)=>ele === url)){
        showMessage("URL already exists");
    }else if (url && isValidUrl(url)) {
        myLeads.push(url)
        inputEl.value = ""
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
        showMessage("URL saved")
    } else {
        showMessage("Please enter a valid URL")
    }

})

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
    showMessage("All URLs deleted")
})

function render(leads) {
    leads.sort()
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li class="fade-in">
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

function showMessage(message) {
    messageEl.textContent = message
    messageEl.classList.add("visible")
    setTimeout(() => messageEl.classList.remove("visible"), 3000)
}

function isValidUrl(string) {
    try {
        new URL(string)
        return true
    } catch (_) {
        return false
    }
}
