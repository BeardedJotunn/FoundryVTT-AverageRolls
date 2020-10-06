# Average Rolls
###### A module for Foundry VTT.

A module to display dice rolling stats in Foundry. Shows lifetime and session averages, Nat1's and Nat20's per user. Currently only uses the first dice in a roll, as that is what's needed for 5e, so to make it work the first dice rolled has to be the D20. Could be changed to track all D20 rolls or a setting could be added to choose what dice to track if requested.

## How to:
 - Install, activate and make sure it is enabled in settings, if it isn't enabled restart Foundry after enabling it. You can use https://raw.githubusercontent.com/BeardedJotunn/FoundryVTT-AverageRolls/master/module.json for manual install.
 - If enabled a Journal Entry called "Average Rolls" will be created where you can see everyone's stats updated at a set frequency.
 - Make a macro with the following script or run it in the console if to send chat messages with player stats: outputAverages();
 - To reset all rolls make a macro with the following script or run it in the console, cannot be undone: resetRolls();

## Future Plans:
 - ~~Add lifetime averages.~~ Added, waiting to see how it works long term.
 - ~~Better way to display averages.~~ Added journal entry.
 - ~~Nat1 and Nat20 counter.~~ Added.
 - Setting to reset rolls.
 - More tracking options.