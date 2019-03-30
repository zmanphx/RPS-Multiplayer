// Initialize Firebase
var config = {
  apiKey: "AIzaSyBIMUU5wDFfu8g0Q0Cqkxn7dJQ_BYX6phk",
  authDomain: "rps-hw-445c1.firebaseapp.com",
  databaseURL: "https://rps-hw-445c1.firebaseio.com",
  projectId: "rps-hw-445c1",
  storageBucket: "rps-hw-445c1.appspot.com",
  messagingSenderId: "486101566827"
};
firebase.initializeApp(config);

var database = firebase.database();
// var databaseRef = firebase.database.ref();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var whichConnect = 0;
var isClicked = false; // insures button value only records once.
//When player connects
connectedRef.on("value", function(snap) {
  if (snap.val()) {
    // add player to connection list
    var con = connectionsRef.push(true);
    // remove player when they disconnect
    con.onDisconnect().remove();
  }
});
// When first connected

connectionsRef.on("value", function(snap) {
  // show connections count on page

  $("#connectionCount").text(snap.numChildren());

  if (snap.numChildren() == 1) {
    whichConnect = 1;
    database.ref("Players/player2").update({ message1: "" });
    database.ref("Players/player1").update({ message1: "" });
    database.ref("Players/player1").update({ Name: "" });
    database.ref("Players/player2").update({ Name: "" });
    database.ref("Players/player2").update({ Win: "0" });
    database.ref("Players/player1").update({ Win: "0" });
    database.ref("Players/player1").update({ ClickVal: "" });
    database.ref("Players/player2").update({ ClickVal: "" });
    database.ref("Players/rps_session").update({ game_count: "0" });
    database.ref("Players/rps_session").update({ game_started: "false" });
    database.ref("Players/rps_session").update({ game_ties: "0" });
    $("#idHolder1").text(
      "Welcome to Paper-Scissors-Rock ! Submit your name to play."
    );
  }

  if (snap.numChildren() == 2) {
    if (whichConnect == 0) {
      $("#idHolder1").text(
        "Submit your name to play, A player is waiting to play you!"
      );
    }
  }

  if (snap.numChildren() > 2) {
    playerNum = snap.numChildren();
  }
});
//**************************************submit name************************************************** */
$("#submitName").on("click", function() {
  event.preventDefault();
  var pName = $("#playerName")
    .val()
    .trim();
  // New user submit name.  Check firebase if  player 1 name exists or player 2 name exists.
  // if player 1 is blank populate , if player 2 is blank populate.
  // update values in HTML  for player 1 or player 2 name.

  var ref = firebase.database().ref("Players");
  ref.once("value").then(function(snapshot) {
    var p1name = snapshot.child("player1/Name").val();
    var p2name = snapshot.child("player2/Name").val();

    if (p1name == "") {
      database.ref("Players/player1").update({ Name: pName });

      $("#P1Name").text(pName);
      playerNum = 1;
      $("#idHolder1").text("You are player 1!");
      database.ref("Players/player2").update({ message1: "" });
    database.ref("Players/player1").update({ message1: "" });
      database.ref("Players/player2").update({ Name: "" });
      database.ref("Players/player2").update({ Win: "0" });
      database.ref("Players/player1").update({ Win: "0" });
      database.ref("Players/player1").update({ ClickVal: "" });
      database.ref("Players/player2").update({ ClickVal: "" });
      database.ref("Players/rps_session").update({ game_count: "0" });
      database.ref("Players/rps_session").update({ game_started: "false" });
      database.ref("Players/rps_session").update({ game_ties: "0" });
    } else if (p2name == "") {
      database.ref("Players/player2").update({ Name: pName });

      $("#P2Name").text(pName);
      playerNum = 2;
      $("#idHolder1").text("You are player 2!");
      database.ref("Players/rps_session").update({ game_started: "true" });
    }
  });
});

database.ref("Players").on("value", function(snapshot) {
  var response = snapshot.val();
  $("#P1score").text(response.player1.Win);
  $("#P2score").text(response.player2.Win);
  $("#P1Name").text(response.player1.Name);
  $("#P2Name").text(response.player2.Name);
  $("#P1WL").text(response.player1.message1);
  $("#P2WL").text(response.player2.message1);
});

// player chooses one of the p,r,s

$("#paperImg").on("click", function() {
  event.preventDefault();
  if (isClicked) {
    return;
  }
  isClicked = true;

  if (playerNum == 1 || playerNum == 2) {
    if (playerNum == 1) {
      database.ref("Players/player1").update({ ClickVal: "p" });
      database.ref("Players/player1").update({ message1: "player 1 clicked" });
    } else {
      database.ref("Players/player2").update({ ClickVal: "p" });
      database.ref("Players/player2").update({ message1: "player 2 clicked" });
    }
  }
});

$("#scissorImg").on("click", function() {
  event.preventDefault();
  if (isClicked) {
    return;
  }
  isClicked = true;

  if (playerNum == 1 || playerNum == 2) {
    if (playerNum == 1) {
      database.ref("Players/player1").update({ ClickVal: "s" });
      database.ref("Players/player1").update({ message1: "player 1 clicked" });
    } else {
      database.ref("Players/player2").update({ ClickVal: "s" });
      database.ref("Players/player2").update({ message1: "player 2 clicked" });
    }
  }
});

$("#rockImg").on("click", function() {
  event.preventDefault();
  if (isClicked) {
    return;
  }
  isClicked = true;

  if (playerNum == 1 || playerNum == 2) {
    if (playerNum == 1) {
      database.ref("Players/player1").update({ ClickVal: "r" });
      database.ref("Players/player1").update({ message1: "player 1 clicked" });
    } else {
      database.ref("Players/player2").update({ ClickVal: "r" });
      database.ref("Players/player2").update({ message1: "player 2 clicked" });
    }
  }
});

$("#submitChat").on("click", function() {
  event.preventDefault();
});

database.ref("Players").on("value", function(snapshot) {
  event.preventDefault();
  var response = snapshot.val();
  var prsArr = ["p", "r", "s"];

  var p1Pick = response.player1.ClickVal;
  var p2Pick = response.player2.ClickVal;

  if (prsArr.indexOf(p1Pick) > -1 && prsArr.indexOf(p2Pick) > -1) {
    $("#idHolder1").text("Player1 :" + p1Pick + " Player2 " + p2Pick);

    // now do the logic after both players have picked.
    //*********************************************************** */
    database.ref("Players/player1").update({ ClickVal: "" });
    database.ref("Players/player2").update({ ClickVal: "" });

    $("#P1choise").text("");
    $("#P2choise").text("");

    if (p1Pick === p2Pick) {
      var dispText =
        response.player1.Name +
        " chose " +
        rpsTranslate(p1Pick) +
        ", " +
        response.player2.Name +
        " chose " +
        rpsTranslate(p2Pick) +
        "  Tie!!!";

      $("#idHolder1").text(dispText);

      var ties = parseInt(response.rps_session.game_ties);
      ties++;
      database.ref("rps_session").update({ game_ties: ties });
    } else if (
      (p1Pick === "r" && p2Pick === "p") ||
      (p1Pick === "s" && p2Pick === "r") ||
      (p1Pick === "p" && p2Pick === "s")
    ) {
      //Player2 wins
      var p2win = parseInt(response.player2.Win);
      p2win++;
      database.ref("Players/player2").update({ Win: p2win });
      var dispText =
        response.player1.Name +
        " chose " +
        rpsTranslate(p1Pick) +
        ", " +
        response.player2.Name +
        " chose " +
        rpsTranslate(p2Pick) +
        ": " +
        response.player2.Name +
        " Wins!!";
      $("#idHolder1").text(dispText);
    } else {
      //Play1 wins

      var p1win = parseInt(response.player1.Win);
      p1win++;
      database.ref("Players/player1").update({ Win: p1win });
      var dispText =
        response.player1.Name +
        " chose " +
        rpsTranslate(p1Pick) +
        ", " +
        response.player2.Name +
        " chose " +
        rpsTranslate(p2Pick) +
        ": " +
        response.player1.Name +
        " Wins!!";
      $("#idHolder1").text(dispText);
    }

    database.ref("Players/player2").update({ message1: "Play Again" });
    database.ref("Players/player1").update({ message1: "Play Again" });
    isClicked = false;
    
    setTimeout(function(){  
      $("#idHolder1").text("Choose Image for Paper Scissors Rock");
  
  
  }, 7000);
    //******************************************************************** */
  }
});

function rpsTranslate(pick) {
  if (pick == "p") {
    return "paper";
  } else if (pick == "s") {
    return "scissors";
  } else if (pick == "r") {
    return "rock";
  }
}

function rpsFunction(p1, p2) {
  var rpsVal = p1 + p2;
  var rpsSentence = "";

  switch (rpsVal) {
    case "rp":
      rpsSentence = " Paper Covers Rock!";
      break;
    case "pr":
      rpsSentence = " Paper Covers Rock!";
      break;

    case "ps":
      rpsSentence = "Scissors cuts paper";
      break;

    case "sp":
      rpsSentence = "Scissors cuts paper";
      break;

    case "rs":
      rpsSentence = "Rock breaks Scissors ";
      break;
    case "sr":
      rpsSentence = "Rock breaks Scissors ";
      break;
  }

  return rpsSentence;
}
