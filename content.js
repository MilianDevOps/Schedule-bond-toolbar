let twitterPages = ["home", "explore", "notifications", "i", "settings"];
let addedData = false;

function insertDataNextToUsername() {
    let usernames = document.querySelectorAll('[data-testid="User-Name"]'); 
    usernames.forEach(usernameElement => {
        let username = getUsernameFromElement(usernameElement); 
        if(username) {
            chrome.storage.sync.get(username, function(result) {
                let customData = result[username];
                let placeholderText = customData ? `(${customData})` : "Placeholder text";
                let newDiv = document.createElement('div');
                newDiv.textContent = placeholderText;
                newDiv.className = "custom-data";
                usernameElement.appendChild(newDiv);
            });
        }
    });
}

function addPriceToHome() {
    let currentPath = window.location.pathname.slice(1);
    if (currentPath === "home" || currentPath === "" || window.location.pathname.includes('status')) {
        let userDivs = document.querySelectorAll('div[data-testid="User-Name"]');
        userDivs.forEach(userDiv => {

            //let usernameDiv = userDiv.querySelector('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
            let usernameDivs = userDiv.querySelectorAll('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
            let usernameDiv = Array.from(usernameDivs).find(div => div.innerText.startsWith('@'));
            if (usernameDiv && !usernameDiv.hasAttribute('data-ft')) {
                let username = (usernameDiv.innerText).substring(1);
                console.log(username);
                usernameDiv.setAttribute('data-ft', "FriendTech");
                chrome.runtime.sendMessage({action: "fetchData", url: `https://frentech.octav.fi/api/users/search?query=${username}`}, (data) => {
                    if (data && data[0] && data[0].displayPrice) {
                        if(data[0].twitterUsername == username)
                        {
                        let priceDiv = document.createElement('div');
                        priceDiv.innerText = "🗝️" + (data[0].displayPrice / 10**18).toFixed(2) + "Ξ" + "📈" + ((data[0].displayPrice / 10**18) * data[0].shareSupply).toFixed(2) + "Ξ MCAP";
                        priceDiv.style.color = "#00bbfa";
                        userDiv.insertAdjacentElement('afterend', priceDiv);
                        }
                    }
                });
            }
            else
            {
                let FTPrices = userDiv.querySelectorAll('div[data-ft="FriendTech"]');
                if(FTPrices.length > 1)
                {
                    for (let i = 1; i < divs.length; i++) {
                        FTPrices[i].remove();
                    }
                }
            }
        });
    }
}


function addPriceToPage() {
    let currentPath = window.location.pathname.slice(1);
    if (!twitterPages.includes(currentPath) && !currentPath.includes('/')) {
        let div = document.querySelectorAll('div[data-testid="UserName"]')[0];
            chrome.runtime.sendMessage({action: "fetchData", url: `https://frentech.octav.fi/api/users/search?query=${currentPath}`}, (data) => {
                if (data && data[0].displayPrice && data[0].twitterUsername == currentPath) {
                    // Check if the <p> element has already been added
                    if (!div.querySelector('p')) {
                        let p = document.createElement('p');
                        let str = document.createElement('strong');
                        str.innerText = "Friend.tech \n🔗Key Price: " + (data[0].displayPrice / 10**18).toFixed(2) + "Ξ \n🔗Market Cap: " + ((data[0].displayPrice / 10**18) * data[0].shareSupply).toFixed(2) + "Ξ";
                        str.style.color = "#00bbfa";
                        p.appendChild(str);
                        div.appendChild(p);
                        let link = document.createElement('a');
                        link.innerText = "🔗Purchase Key";
                        link.href = "https://www.friend.tech/rooms/" + data[0].address;
                        link.style.color = "#00bbfa";  // You can style the link similarly
                        link.target = "_blank";  // Open the link in a new tab
                        div.appendChild(link);
                    }
                } else if (data.error) {
                    console.error("Error fetching data: ", data.error);
            };
        });
    }
}


function observeDOM() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let divs = document.querySelectorAll('div[data-testid="UserName"]');
                if (divs.length > 0) {
                    addPriceToPage();
                }
                if(window.location.pathname.slice(1) === "home" || window.location.pathname.includes('status'))
                    addPriceToHome();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}


function getUsernameFromElement(element) {
    // You will need to inspect the Twitter page structure to find a reliable way to extract the username from the element
    // This is a placeholder function and likely will not work as-is
    return element.querySelector('.css-901oao.css-1hf3ou5.r-1bwzh9t.r-18u37iz.r-37j5jr.r-1wvb978.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0 > .css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0'); // replace '.username-selector' with the actual selector
}

window.onload = () => {
    insertDataNextToUsername();
    observeDOM();
};
