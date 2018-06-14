﻿
function newCurrentBot() {

    var thisObject = {
        container: undefined,
        draw: draw,
        getContainer: getContainer,     // returns the inner most container that holds the point received by parameter.
        initialize: initialize
    };

    var container = newContainer();
    container.initialize();
    thisObject.container = container;

    thisObject.container.frame.width = 200;
    thisObject.container.frame.height = TOP_SPACE_HEIGHT;

    container.frame.position.x = viewPort.visibleArea.topRight.x - thisObject.container.frame.width * 3;
    container.frame.position.y = 0;

    container.isDraggeable = false;
    container.isClickeable = true;

    let sharedStatus;

    return thisObject;

    function initialize(pSharedStatus) {

        sharedStatus = pSharedStatus;

        if (window.USER_PROFILE.devTeams.length === 0) {
            window.CURRENT_BOT = "You have no Bots";
        } else {

            if (window.USER_PROFILE.devTeams[sharedStatus.currentDevTeamIndex].userBots.length === 0) {
                window.CURRENT_BOT = "You have no Bots";
            } else {
                window.CURRENT_BOT = window.USER_PROFILE.devTeams[sharedStatus.currentDevTeamIndex].userBots[sharedStatus.currentUserBotIndex].displayName;
            }
        }

        thisObject.container.eventHandler.listenToEvent("onMouseClick", onClick);
        sharedStatus.eventHandler.listenToEvent("devTeam Changed", onDevTeamChanged);
    }

    function onDevTeamChanged() {

        if (window.USER_PROFILE.devTeams[sharedStatus.currentDevTeamIndex].userBots.length > 0) {

            sharedStatus.currentUserBotIndex = 0;
            window.CURRENT_BOT = window.USER_PROFILE.devTeams[sharedStatus.currentDevTeamIndex].userBots[sharedStatus.currentUserBotIndex].displayName;

        } else {

            window.CURRENT_BOT = "You have no Bots";

        }
    }

    function onClick() {

        if (sharedStatus.currentUserBotIndex + 1 === window.USER_PROFILE.devTeams.length) {

            sharedStatus.currentUserBotIndex = 0;
            window.CURRENT_BOT = window.USER_PROFILE.devTeams[sharedStatus.currentDevTeamIndex].userBots[sharedStatus.currentUserBotIndex].displayName;
            return;
        }

        if (sharedStatus.currentUserBotIndex + 1 < window.USER_PROFILE.devTeams.length) {

            sharedStatus.currentUserBotIndex++;
            window.CURRENT_BOT = window.USER_PROFILE.devTeams[sharedStatus.currentDevTeamIndex].userBots[sharedStatus.currentUserBotIndex].displayName;
            return;
        }
    }

    function getContainer(point) {

        let container;

        /* First we check if this point is inside this object UI. */

        if (thisObject.container.frame.isThisPointHere(point, true) === true) {

            return this.container;

        } else {

            /* This point does not belong to this space. */

            return undefined;
        }

    }

    function draw() {

        thisObject.container.frame.draw(false, false);

        let fontSize = 12;
        let label = window.CURRENT_BOT;

        let point = {
            x: thisObject.container.frame.width * 1 / 3,
            y: (thisObject.container.frame.height / 2) + 4
        };

        point = thisObject.container.frame.frameThisPoint(point);

        browserCanvasContext.font = fontSize + 'px ' + UI_FONT.PRIMARY;
        browserCanvasContext.fillStyle = 'rgba(' + UI_COLOR.WHITE + ', 1)';
        browserCanvasContext.fillText(label, point.x, point.y);
    }
}