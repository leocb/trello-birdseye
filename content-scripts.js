/**
 * Adds a button to the toolbar and when activated, applies .birdseye class to body
 */

// Create the button and inject into to toolbar
function initApplication() {

  var buttonTarget = document.getElementsByClassName('board-header-btns mod-right')[0];

  var buttonContainer = document.createElement('a');
  buttonContainer.className = 'birdseye-button board-header-btn';
  buttonContainer.setAttribute('href', '#');
  buttonContainer.setAttribute('id', 'BirdseyeToggle');
  buttonContainer.setAttribute('state', false);
  buttonContainer.addEventListener('click', clickButton);

  var iconContainer = document.createElement('span');
  iconContainer.className = 'icon-sm icon-subscribe board-header-btn-icon';

  var textContainer = document.createElement('span');
  textContainer.className = 'board-header-btn-text u-text-underline';
  var text = document.createTextNode("Birds Eye");

  textContainer.appendChild(text);
  buttonContainer.appendChild(iconContainer);
  buttonContainer.appendChild(textContainer);

  buttonTarget.insertBefore(buttonContainer, buttonTarget.firstChild);

  // When switching pages/boards, the button loses its enabled class, so re-add it
  var body = document.getElementsByTagName('body')[0];
  if (body.classList.contains('birdseye')) {
    buttonContainer.classList.toggle('board-header-btn-enabled');
  }

  BirdseyeLoadState();
}

// Clicking on the button triggers the class toggling
function clickButton() {
  let button = document.getElementById('BirdseyeToggle');
  let currentState = button.getAttribute('state') == 'true' ? true : false;
  button.setAttribute('state', !currentState);

  var body = document.getElementsByTagName('body')[0];
  body.classList.toggle('birdseye');
  button.classList.toggle('board-header-btn-enabled');

  BirdseyeSaveState(button.getAttribute('state'));
}

// Checks whether the button element is present - if not (user switched page/board), then init
function shouldInit(event) {
  var buttonTarget = document.getElementsByClassName('board-header-btns mod-right');
  var buttonContainer = document.getElementsByClassName('birdseye-button');
  if (buttonTarget.length !== 0 && buttonContainer.length === 0) {
    initApplication();
  }
}

// Initializes on first page load +
// uggggllly hax to continiously check whether user has switched page/board
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    shouldInit();
    setInterval(shouldInit, 3000);
  }
};

function BirdseyeSaveState(state) {
  chrome.storage.sync.set({
    "BirdseyeState": state
  }, () => {});
}

function BirdseyeLoadState() {
  let button = document.getElementById('BirdseyeToggle');

  //Get the button state from chrome storage, if its different from what is set, set it to new state
  try {
    chrome.storage.sync.get("BirdseyeState", function (items) {
      if (button.getAttribute('state') != items.BirdseyeState) {
        clickButton();
      }
    });
  } catch (e) {
    button.setAttribute('state', false);
    chrome.storage.sync.set({
      "BirdseyeState": false
    })
  }
}