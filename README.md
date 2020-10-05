# Average Rolls
###### A module for Foundry VTT.

A module to display dice rolling stats in Foundry. Shows lifetime and session averages, Nat1's and Nat20's per user. Currently only uses the first dice in a roll, as that is what's needed for 5e, so to make it work the first dice rolled has to be the D20. Could be changed to track all D20 rolls or a setting could be added to choose what dice to track if requested.

## How to:
 - Install, activate and make sure it is enabled in settings, if it isn't enabled restart Foundry after enabling. You can use https://raw.githubusercontent.com/BeardedJotunn/FoundryVTT-AverageRolls/master/module.json for manual install.
 - If enabled a Journal Entry called "Average Rolls" will be created where you can see everyone's stats updated at a set frequency.
 - Make a macro with the following script if you want to send a message to chat with everybody's stats: outputAverages();

## Future Plans:
 - ~~Add lifetime averages.~~ Added, waiting to see how it works long term.
 - ~~Better way to display averages.~~ Added.
 - Nat1 and Nat20 counter.
 - More tracking options.
 - Perhaps some Discord connection. 

Was originally going to be a Discord Bot module which is why I forked DiscordBridge by nearlyNonexistent. However I ended up quickly diverging from that but maybe it will return one day.