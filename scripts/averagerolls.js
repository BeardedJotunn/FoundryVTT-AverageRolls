Hooks.once("init", function () {
    game.settings.register('averagerolls', "Enabled", {
        name: "Enabled",
        hint: "Enable this to calculate average rolls.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register('averagerolls', "JournalEntry", {
        name: "Create Journal Entry",
        hint: "Enable this to create a journal entry with average rolls.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register('averagerolls', "UpdateFrequency", {
        name: "Update Frequency",
        hint: "How often in seconds you want the journal entry to update, does nothing if create journal entry isn't enabled.",
        scope: "world",
        type: Number,
        default: 30,
        config: true
    });
    
    game.settings.register('averagerolls', "ResetRolls", {
        name: "Reset Rolls",
        hint: "Tick or untick to reset all rolls. No going back.",
        scope: "world",
        type: Boolean,
        config: true,
        default: true,
        onChange: () => {
            resetRolls()
        }
    });
});

Hooks.once("ready", function () { 
    if (game.settings.get("averagerolls", "Enabled")) {
        startUp();
    }
});

// Adding flags for rolls and average to all users
function startUp() {
    console.log("AverageRolls - Resetting session rolls");
    game.users.entries.forEach(user => {
        userid = user.id;
        plantFlag(userid, "sessionAverage", 0);
        plantFlag(userid, "sessionRolls", []);
        plantFlag(userid, "sessionNat1", 0);
        plantFlag(userid, "sessionNat20", 0);
        if (typeof bringFlag(userid, "lifetimeAverage") == "undefined") {
            plantFlag(userid, "lifetimeAverage", []);
        }
        if (typeof bringFlag(userid, "lifetimeRolls") == "undefined") {
            plantFlag(userid, "lifetimeRolls", 0);
        }
        if (typeof bringFlag(userid, "lifetimeRolls") == "undefined") {
            plantFlag(userid, "lifetimeRolls", 0);
        }
        if (typeof bringFlag(userid, "lifetimeRolls") == "undefined") {
            plantFlag(userid, "lifetimeRolls", 0);
        }
        console.log("AverageRolls - " + userid + " reset for session.");
    })
    if (game.settings.get("averagerolls", "JournalEntry")) {
        updateJournal();
    }
}
 // Resets all flags
function resetRolls() {
    console.log("AverageRolls - Resetting all rolls");
    game.users.entries.forEach(user => {
        userid = user.id;
        plantFlag(userid, "sessionAverage", 0);
        plantFlag(userid, "sessionRolls", []);
        plantFlag(userid, "sessionNat1", 0);
        plantFlag(userid, "sessionNat20", 0);
        plantFlag(userid, "lifetimeAverage", 0);
        plantFlag(userid, "lifetimeRolls", 0);
        plantFlag(userid, "lifetimeNat1", 0);
        plantFlag(userid, "lifetimeNat20", 0);
        console.log("AverageRolls - " + userid + " reset.");
    })
}

// Removes all flags
function cleanUp() {
    console.log("AverageRolls - Cleaning up all users");
    game.users.entries.forEach(user => {
        userid = user.id;
        unPlantFlag(userid, "sessionAverage");
        unPlantFlag(userid, "sessionRolls");
        unPlantFlag(userid, "sessionNat1");
        unPlantFlag(userid, "sessionNat20");
        unPlantFlag(userid, "lifetimeAverage");
        unPlantFlag(userid, "lifetimeRolls");
        unPlantFlag(userid, "lifetimeNat1");
        unPlantFlag(userid, "lifetimeNat20");
        if (user.isGM) {
            unPlantFlag(userid, "journalId");
        }
        console.log("AverageRolls - " + userid + " cleaned up.");
    })
}

// Get specified flag for userid
function bringFlag(userid, flag) {
    get = game.users.get(userid).getFlag("averagerolls", flag)
    if (typeof get == "undefined") {
        console.log("AverageRolls - Couldn't find flag " + flag) + " on user " + userid;
    }
    return get;
}

// Set specified flag for userid
function plantFlag(userid, flag, value) {
    return game.users.get(userid).setFlag("averagerolls", flag, value)
}

// Remove specified flag for userid
function unPlantFlag(userid, flag) {
    return game.users.get(userid).unSetFlag("averagerolls", flag)
}

// Output stats for all users as a chat message
function outputAverages(userid = "") {
    if (!userid == "") {
        user = game.users.get(userid);
        msg = new ChatMessage();
        msg.user = user;
        msg.data.user = userid;
        lifetimeNat20 = bringFlag(userid, "lifetimeNat20");
        lifetimeNat1 = bringFlag(userid, "lifetimeNat1");
        sessionNat20 = bringFlag(userid, "sessionNat20");
        sessionNat1 = bringFlag(userid, "sessionNat1");
        sessAverage = bringFlag(userid, "sessionAverage");
        lifeAverage = bringFlag(userid, "lifetimeAverage");
        sessionAverage = Math.round((sessAverage + Number.EPSILON) * 100) / 100;
        lifetimeAverage = Math.round((lifeAverage + Number.EPSILON) * 100) / 100;

        msg.data.content = `<table style="height: 68px;" border="1">
        <tbody>
        <tr style="height: 17px;">
        <td style="height: 17px; width: 234px;">&nbsp;</td>
        <td style="height: 17px; width: 220px;"><strong>Session</strong></td>
        <td style="height: 17px; width: 240px;"><strong>Lifetime</strong></td>
        </tr>
        <tr style="height: 17px;">
        <td style="height: 17px; width: 234px;"><strong>Nat1</strong></td>
        <td style="height: 17px; width: 220px;">${sessionNat1}</td>
        <td style="height: 17px; width: 240px;">${lifetimeNat1}</td>
        </tr>
        <tr style="height: 17px;">
        <td style="height: 17px; width: 234px;"><strong>Nat20</strong></td>
        <td style="height: 17px; width: 220px;">${sessionNat20}</td>
        <td style="height: 17px; width: 240px;">${lifetimeNat20}</td>
        </tr>
        <tr style="height: 17px;">
        <td style="height: 17px; width: 234px;"><strong>Average</strong></td>
        <td style="height: 17px; width: 220px;">${sessionAverage}</td>
        <td style="height: 17px; width: 240px;">${lifetimeAverage}</td>
        </tr>
        </tbody>
        </table>`;

        ChatMessage.create(msg);
    } else {
        game.users.entries.forEach(user => {
            userid = user.id;
            msg = new ChatMessage();
            msg.user = user;
            msg.data.user = userid;
            lifetimeNat20 = bringFlag(userid, "lifetimeNat20");
            lifetimeNat1 = bringFlag(userid, "lifetimeNat1");
            sessionNat20 = bringFlag(userid, "sessionNat20");
            sessionNat1 = bringFlag(userid, "sessionNat1");
            sessAverage = bringFlag(userid, "sessionAverage");
            lifeAverage = bringFlag(userid, "lifetimeAverage");
            sessionAverage = Math.round((sessAverage + Number.EPSILON) * 100) / 100;
            lifetimeAverage = Math.round((lifeAverage + Number.EPSILON) * 100) / 100;

            msg.data.content = `<table style="height: 68px;" border="1">
            <tbody>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;">&nbsp;</td>
            <td style="height: 17px; width: 220px;"><strong>Session</strong></td>
            <td style="height: 17px; width: 240px;"><strong>Lifetime</strong></td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Nat1</strong></td>
            <td style="height: 17px; width: 220px;">${sessionNat1}</td>
            <td style="height: 17px; width: 240px;">${lifetimeNat1}</td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Nat20</strong></td>
            <td style="height: 17px; width: 220px;">${sessionNat20}</td>
            <td style="height: 17px; width: 240px;">${lifetimeNat20}</td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Average</strong></td>
            <td style="height: 17px; width: 220px;">${sessionAverage}</td>
            <td style="height: 17px; width: 240px;">${lifetimeAverage}</td>
            </tr>
            </tbody>
            </table>`;

            ChatMessage.create(msg);
        })
    }
}

// Create a journal entry with stats
function createJournal() {
    gm = "";
    gmFound = false;
    game.users.entries.some(function(user, index) {
        if (user.isGM) {
            gm = user;
            gmFound = true;
        }
        return gmFound;
    })
    userid = gm.id;
    entry = new JournalEntry();
    entry.user = gm;
    entry.data.user = userid;
    entry.name = "Average Rolls";
    entry.data.name = "Average Rolls";

    content = "AverageRolls";
    game.users.entries.forEach(user => {
        userid = user.id;
        sessAverage = bringFlag(userid, "sessionAverage");
        lifeAverage = bringFlag(userid, "lifetimeAverage");
        sessionAverage = Math.round((sessAverage + Number.EPSILON) * 100) / 100;
        lifetimeAverage = Math.round((lifeAverage + Number.EPSILON) * 100) / 100;
        sessionNat1 = bringFlag(userid, "sessionNat1");
        sessionNat20 = bringFlag(userid, "sessionNat20");
        lifetimeNat1 = bringFlag(userid, "lifetimeNat1");
        lifetimeNat20 = bringFlag(userid, "lifetimeNat20");

        content += `<h3 style="text-align: center;">&nbsp;</h3>
            <h3 style="text-align: center;">${user.name}</h3>
            <table style="height: 68px;" border="1">
            <tbody>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;">&nbsp;</td>
            <td style="height: 17px; width: 220px;"><strong>Session</strong></td>
            <td style="height: 17px; width: 240px;"><strong>Lifetime</strong></td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Nat1</strong></td>
            <td style="height: 17px; width: 220px;">${sessionNat1}</td>
            <td style="height: 17px; width: 240px;">${lifetimeNat1}</td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Nat20</strong></td>
            <td style="height: 17px; width: 220px;">${sessionNat20}</td>
            <td style="height: 17px; width: 240px;">${lifetimeNat20}</td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Average</strong></td>
            <td style="height: 17px; width: 220px;">${sessionAverage}</td>
            <td style="height: 17px; width: 240px;">${lifetimeAverage}</td>
            </tr>
            </tbody>
            </table>`;

        if (user.isGM) {
            plantFlag(userid, "journalId", entry.id);
        }
    })
    
    entry.data.content = content;
    return JournalEntry.create(entry);
}

// Update the journal entry with stats
function updateJournal() {
    entry = null;
    
    content = "";
    
    game.users.entries.forEach(user => {
        userid = user.id;
        sessAverage = bringFlag(userid, "sessionAverage");
        lifeAverage = bringFlag(userid, "lifetimeAverage");
        sessionAverage = Math.round((sessAverage + Number.EPSILON) * 100) / 100;
        lifetimeAverage = Math.round((lifeAverage + Number.EPSILON) * 100) / 100;
        sessionNat1 = bringFlag(userid, "sessionNat1");
        sessionNat20 = bringFlag(userid, "sessionNat20");
        lifetimeNat1 = bringFlag(userid, "lifetimeNat1");
        lifetimeNat20 = bringFlag(userid, "lifetimeNat20");

        content += `<h3 style="text-align: center;">&nbsp;</h3>
            <h3 style="text-align: center;">${user.name}</h3>
            <table style="height: 68px;" border="1">
            <tbody>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;">&nbsp;</td>
            <td style="height: 17px; width: 220px;"><strong>Session</strong></td>
            <td style="height: 17px; width: 240px;"><strong>Lifetime</strong></td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Nat1</strong></td>
            <td style="height: 17px; width: 220px;">${sessionNat1}</td>
            <td style="height: 17px; width: 240px;">${lifetimeNat1}</td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Nat20</strong></td>
            <td style="height: 17px; width: 220px;">${sessionNat20}</td>
            <td style="height: 17px; width: 240px;">${lifetimeNat20}</td>
            </tr>
            <tr style="height: 17px;">
            <td style="height: 17px; width: 234px;"><strong>Average</strong></td>
            <td style="height: 17px; width: 220px;">${sessionAverage}</td>
            <td style="height: 17px; width: 240px;">${lifetimeAverage}</td>
            </tr>
            </tbody>
            </table>`;

        if (user.isGM) {
            entry = getJournal(bringFlag(user.id, "journalId"));
        }
    })

    if (typeof entry == "undefined" || entry == null) {
        return createJournal();
    }

    entry.data.content = content;
    return entry.update(entry.data);
}

// Search through all journal entries to find the one named Average Rolls
function findJournal() {
    gmFound = false;
    journalEntry = null;
    game.journal.entries.forEach(entry => {
        if (entry.name == "Average Rolls") {
            journalEntry = entry;
            game.users.entries.some(function(user, index) {
                if (user.isGM) {
                    plantFlag(user.id, "journalId", entry.id);
                    gmFound = true;
                }
                return gmFound;
            })
        }
    })
    if (journalEntry == null) {
        console.log("AverageRolls - Couldn't find journal entry. Creating one.");
    }
    return journalEntry;
}

// Get journal entry by id, if it isn't found use findJournal to search for it
function getJournal(journalId) {
    entry = game.journal.get(journalId);
    if (typeof entry == "undefined" || entry == null) {
        console.log("AverageRolls - Journal not found, looking through all journals.")
        return findJournal();
    }
    return entry;
}

// Class for updating journal entry on a timer
class timeOut {
    constructor(fn, interval) {
        var id = setTimeout(fn, interval);
        this.cleared = false;
        this.clear = function () {
            this.cleared = true;
            clearTimeout(id);
        };
    }
}


// Hooks the chat message and if it's a D20 roll adds it to the roll flag and calculates averages for user that sent it
Hooks.on("createChatMessage", (message, options, user) => 
{
    
    if (!game.settings.get("averagerolls", "Enabled") || !message.isRoll || !parseInt(message.roll.dice[0].faces) == 20) {
        console.log("not a d20 roll")
        return;
    }

    console.log("roll found " + parseInt(message.roll.dice[0].faces))
    console.log ("d20 roll : " + parseInt(message.roll.dice[0].faces) == 20)
    console.log(message);
    rolls = []
    nat20s = 0;
    nat1s = 0;
    lifetimeNat20 = 0;
    lifetimeNat1 = 0;
    sessionNat20 = 0;
    sessionNat1 = 0;

    message.roll.dice[0].rolls.forEach(diceRoll => {
        roll = diceRoll.roll;
        rolls.push(parseInt(roll));

        if (roll == 20) {
            if (lifetimeNat20 == 0 || sessionNat20 == 0) {
                lifetimeNat20 = parseInt(bringFlag(user, "lifetimeNat20"));
                sessionNat20 = parseInt(bringFlag(user, "sessionNat20"));
            }
            nat20s++;
        } else if (roll == 1) {
            if (lifetimeNat1 == 0 || sessionNat1 == 0) {
                lifetimeNat1 = parseInt(bringFlag(user, "lifetimeNat1"));
                sessionNat1 = parseInt(bringFlag(user, "sessionNat1"));
            }
            nat1s++;
        }
    }); 
    name = message.user.name;



    oldSessionRolls = bringFlag(user, "sessionRolls");
    sessionRolls = oldSessionRolls.concat(rolls);
    plantFlag(user, "sessionRolls", sessionRolls);
    sessionSum = sessionRolls.reduce((a, b) => a + b, 0);
    sessionAverage = sessionSum/sessionRolls.length;
    plantFlag(user, "sessionAverage", sessionAverage);

    result = rolls.reduce((a, b) => a + b, 0);
    lifetimeRolls = bringFlag(user, "lifetimeRolls");
    lifetimeAverage = bringFlag(user, "lifetimeAverage");
    newRolls = parseInt(lifetimeRolls) + rolls.length;
    newAverage = ((lifetimeAverage * lifetimeRolls) + result) / (newRolls);
    plantFlag(user, "lifetimeRolls", newRolls);
    plantFlag(user, "lifetimeAverage", newAverage);

    if (nat20s > 0) {
        newLifetimeNat20 = lifetimeNat20 + nat20s;
        newSessionNat20 = sessionNat20 + nat20s;
        plantFlag(user, "lifetimeNat20", newLifetimeNat20);
        plantFlag(user, "sessionNat20", newSessionNat20);

    }

    if (nat1s > 0) {
        newLifetimeNat1 = lifetimeNat1 + nat1s;
        newSessionNat1 = sessionNat1 + nat1s;
        plantFlag(user, "lifetimeNat1", newLifetimeNat1);
        plantFlag(user, "sessionNat1", newSessionNat1);
    }
    
    
    if (game.settings.get("averagerolls", "JournalEntry")) {
        time = parseInt(game.settings.get("averagerolls", "UpdateFrequency")) * 1000;
        if (typeof timer == "undefined" || timer.cleared) {
            timer = new timeOut(function () {
                console.log("AverageRolls - Updating Average Rolls Journal Entry.")
                updateJournal();
                timer.clear();
            }, time);
        }
    }
});