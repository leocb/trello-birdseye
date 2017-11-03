/**
 * Adds a button to the toolbar and when activated, applies .birdseye class to body
 */

// Create the button and inject into to toolbar
function initApplication() {

    var buttonTarget = document.getElementsByClassName('board-header-btns mod-right')[0];

    var buttonContainer = document.createElement('a');
    buttonContainer.className = 'business-button board-header-btn';
    buttonContainer.setAttribute('href', '#');
    buttonContainer.setAttribute('id', 'TrelloBusinessStyleToggle');
    buttonContainer.setAttribute('state', false);
    buttonContainer.addEventListener('click', clickButton);

    var iconContainer = document.createElement('span');
    iconContainer.className = 'icon-sm icon-business-class board-header-btn-icon';

    var textContainer = document.createElement('span');
    textContainer.className = 'board-header-btn-text u-text-underline';
    var text = document.createTextNode("Business Style");

    textContainer.appendChild(text);
    buttonContainer.appendChild(iconContainer);
    buttonContainer.appendChild(textContainer);

    buttonTarget.insertBefore(buttonContainer, buttonTarget.firstChild);

    // When switching pages/boards, the button loses its enabled class, so re-add it
    var body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('business')) {
        buttonContainer.classList.toggle('board-header-btn-enabled');
    }

    TBSloadState();

}

// Clicking on the button triggers the class toggling
function clickButton() {
    let button = document.getElementById('TrelloBusinessStyleToggle');
    let currentState = button.getAttribute('state') == 'true' ? true : false;
    button.setAttribute('state', !currentState);

    var body = document.getElementsByTagName('body')[0];
    body.classList.toggle('business');
    button.classList.toggle('board-header-btn-enabled');

    TBSsaveState(button.getAttribute('state'));
}

// Checks whether the button element is present - if not (user switched page/board), then init
function shouldInit(event) {
    var buttonTarget = document.getElementsByClassName('board-header-btns mod-right');
    var buttonContainer = document.getElementsByClassName('business-button');
    if (buttonTarget.length !== 0 && buttonContainer.length === 0) {
        initApplication();
    }
}

// Initializes on first page load +
// uggggllly hax to continiously check whether user has switched page/board
document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        shouldInit();
        setInterval(shouldInit, 3000);
    }
};

function TBSsaveState(state) {
    chrome.storage.sync.set({ "TrelloBusinessStyleState": state }, () => {});
}

function TBSloadState() {
    let button = document.getElementById('TrelloBusinessStyleToggle');

    //Get the button state from chrome storage, if its different from what is set, set it to new state
    try {
        chrome.storage.sync.get("TrelloBusinessStyleState", function(items) {
            if (button.getAttribute('state') != items.TrelloBusinessStyleState) {
                clickButton();
            }
        });
    } catch (e) {
        button.setAttribute('state', false);
        chrome.storage.sync.set({ "TrelloBusinessStyleState": state })
    }
}