import Empirica from "meteor/empirica:core";
import { randomizeRoles, checkToGoNextStage, getPuzzles, assignRequestsToAdvisors, updateScore, checkEveryoneFinishedSurvey } from "./util";



// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart(game => {
  game.players.forEach(player => {
    player.set("recentSLConnections", []);
  })
  game.set("score", 0);
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {
  const {
    treatment: {
      networkStructure,
      numSLPairs,
      reqMutual,
    }
  } = game;
  // Initiate all roles to None, then randomly assign speaker-listener roles
  game.players.forEach(player => {
    player.round.set("role", "None");
    // player.round.set("activeChats", []);
  })

  if (round.get("roundType") === "Task") {
    randomizeRoles(game, round, networkStructure, numSLPairs, reqMutual);
    getPuzzles(game, round);
  }

  if (round.get("roundType") === "Survey") {
    game.players.forEach(player => {
      player.round.set("surveyStageNumber", 1);
    })
  }


});

// onStageStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  game.players.forEach(player => {
    player.stage.get("submitted", false);
    if (stage.displayName === "Tell") {
      // If it's a task round, get all the roles and puzzles
      if (player.round.get("role") !== "Speaker") {
        player.stage.set("submitted", true);
      }
   }

    else if (stage.displayName === "Listen") {
      if (player.round.get("role") === "Speaker") {
        player.stage.set("submitted", true);
      }
    }

  })

  if (stage.displayName === "Listen") {
    assignRequestsToAdvisors(game, round);
  }
});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage) => {
  if (stage.displayName === "Listen") {
    updateScore(game, round);
  }

});

// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round) => {

  if (round.get("roundType") === "Survey") { // Reset a player's connections for next interval of tasks
    game.players.forEach((player) => {
      player.set("recentSLConnections", []);
    })
  }
});

// onGameEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd(game => {});

// ===========================================================================
// => onSet, onAppend and onChange ==========================================
// ===========================================================================

// onSet, onAppend and onChange are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// onSet is called when the experiment code call the .set() method
// on games, rounds, stages, players, playerRounds or playerStages.
Empirica.onSet((
  game,
  round,
  stage,
  player, // Player who made the change
  target, // Object on which the change was made (eg. player.set() => player)
  targetType, // Type of object on which the change was made (eg. player.set() => "player")
  key, // Key of changed value (e.g. player.set("score", 1) => "score")
  value, // New value
  prevValue // Previous value
) => {
  const allPlayers = game.players;

  if (stage.displayName === "Choose" && key === "submitted") {
    console.log("Choose Submitted")
    const role = "Listener";
    checkToGoNextStage(allPlayers, role);

  }
  else if (stage.displayName === "Tell" && key === "submitted") {
    console.log("Tell Submitted");
    const role = "Speaker";
    checkToGoNextStage(allPlayers, role);

  } else if (stage.displayName === "Listen" && key === "submitted") {
    console.log("Listen Submitted");
    const role = "Listener";
    checkToGoNextStage(allPlayers, role);
  } else if (stage.displayName === "Survey" && key === "submitted") {
    console.log("Survey Submitted");
    checkEveryoneFinishedSurvey(allPlayers, round);
  }
  // // Example filtering
  // if (key !== "value") {
  //   return;
  // }
});

// // onAppend is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
//    Game.set("lastChangeAt", new Date().toString())
// });

// // onSubmit is called when the player submits a stage.
// Empirica.onSubmit((
//   game,
//   round,
//   stage,
//   player // Player who submitted
// ) => {
// });
