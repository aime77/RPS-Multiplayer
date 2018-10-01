// Initialize Firebase
var config = {
  apiKey: "AIzaSyBKzMGZwBDUzOvv0Hf8I8b4JqNwjv07pFg",
  authDomain: "rock-paper-scissors-615b1.firebaseapp.com",
  databaseURL: "https://rock-paper-scissors-615b1.firebaseio.com",
  projectId: "rock-paper-scissors-615b1",
  storageBucket: "",
  messagingSenderId: "169345664618"
};
firebase.initializeApp(config);
var database = firebase.database();

player1 = {
  playerTurn: null,
  wins: 0,
  losses: 0,
}
var snapshotP1;
var dataReqP1;
player2 = {
  playerTurn: null,
  wins: 0,
  losses: 0,
}
var snapshotP2;
var dataReqP2;
var player;
var numberPlayers = 0;
var active=true;
$("#msg").on("click", function(){
  event.preventDefault();
  var message=$("#messageBox").val().trim();
    database.ref("/chat").push({
      msg:message,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
  
    });

});

var height = 0;
database.ref("/chat").on("child_added", function(snapshot) {
  var data=snapshot.val();
  console.log(snapshot.val());
  $("#chatbox").append("<br>"+data.msg);
});

$("#chatbox").scroll(function() {
  $( "span" ).css( "display", "inline" ).fadeOut( "slow" );
});

function rps() {
  active=false;
  console.log("fnc works");
  database.ref("/users/player1").on("value", function (snapshot) {
    dataReqP1 = snapshot;
  }, function (errorObject) {
    console.log("ERROR: " + errorObject.code);
  });

  database.ref("/users/player2").on("value", function (snapshot) {
    dataReqP2 = snapshot;
  }, function (errorObject) {
    console.log("ERROR: " + errorObject.code);
  });
  //rock paper scissors function
  if (dataReqP1.val() !== null && dataReqP2.val() !== null) {
    var p1choice = dataReqP1.val().choice;
    var p2choice = dataReqP2.val().choice;
    console.log("p1"+p1choice);
    console.log("p2"+p2choice);

    if (p1choice === p2choice) {
      $("#p1selected").append(p1choice);
      $("#p2selected").append(p2choice);
      $("#results").text("It's a tie");
    }

    else if (p1choice === "Rock" && p2choice === "Scissors") {
      console.log("yes!");
      $("#p1selected").append(p1choice);
      $("#p2selected").append(p2choice);
      $("#results").text(player1.playerTurn+" is the winner!");
      player1.wins++;
      player2.losses++;
      console.log(player1.wins);
      console.log(player2.wins);
    }
    else if (p1choice === "Rock" && p2choice === "Paper") {
      $("#p1selected").append(p1choice);
      $("#p2selected").append(p2choice);
      $("#results").text(player2.playerTurn+" is the winner!");
      player2.wins++;
      player1.losses++;

    }
    else if (p1choice === "Scissors" && p2choice === "Paper") {
      $("#p1selected").append(p1choice);
      $("#p2selected").append(p2choice);
      $("#results").text(player1.playerTurn+" is the winner!");
      player1.wins++;
      player2.losses++;

    }
    else if (p1choice === "Scissors" && p2choice === "Rock") {
      $("#p1selected").append(p1choice);
      $("#p2selected").append(p2choice);
      $("#results").text(player2.playerTurn+" is the winner!");
      player2.wins++;
      player1.losses++;

    }
    else if (p1choice === "Paper" && p2choice === "Scissors") {
      $("#p1selected").append(p1choice);
      $("#p2selected").append(p2choice);
      $("#results").text(player2.playerTurn+" is the winner!");
      player2.wins++;
      player1.losses++;

    }
    else if (p1choice === "Paper" && p2choice === "Rock") {
      $("#p1selected").append(p1choice);
      $("#p2selected").append(p2choice);
      $("#results").text(player1.playerTurn+" is the winner!");
      player1.wins++;
      player2.losses++;
    };
    database.ref().update({
      selector:1
    });  

      database.ref("/users/player1").once("value", function(snapshot){
        dataReqP1=snapshot;
      }, function(errorObject){
        console.log("ERROR"+errorObject.code);
      });

      if(dataReqP1.val()!==null){
        database.ref("/users/player1").update({
          wins:player1.wins,
          losses:player1.losses
        });
      };
      database.ref("/users/player2").once("value", function(snapshot){
        dataReqP2=snapshot;
      }, function(errorObject){
        console.log("ERROR"+errorObject.code);
      });

      if(dataReqP2.val()!==null){
        database.ref("/users/player2").update({
          wins:player2.wins,
          losses:player2.losses
        });
      };

    
  };
};

//get the changes to value when reference points at player1
database.ref("/users/player1").on("value", function (snapshot) {
  var data = snapshot.val();
  if(data===null){
    $("#p1name").text("Waiting for player 1");
    $("#p1results").empty();
}
  else if (data !== null) {
    player1.playerTurn = data.player;
    player1.wins = data.wins;
    player1.losses = data.losses;
    //write on html
    $("#p1name").text(player1.playerTurn);
    console.log(player1.playerTurn);
    $("#p1results").html("<p>Wins " + player1.wins + " Losses: " + player1.losses + "</p>");
    //if snapshot (data in database) is empty
  } 
}, function (errorObject) {
  console.log("Error: " + errorObject.code);
});

database.ref("/users/player2").on("value", function (snapshot) {
  var data = snapshot.val();
  if(data===null){
    $("#p2name").text("Waiting for player 2");
    $("#p2results").empty();


  }
  else if (data !== null) {
    player2.playerTurn = data.player;
    player2.wins = data.wins;
    player2.losses = data.losses;
    //write on html
    $("#p2name").text(player2.playerTurn);
    $("#p2results").html("<p>Wins " + player2.wins + " Losses: " + player2.losses + "</p>");
    //if snapshot (data in database) is empty
  } 
}, function (errorObject) {
  console.log("Error: " + errorObject.code);
});

//enter name function
$("#submitB").on("click", function () {
  event.preventDefault();
  player = $("#playerName").val().trim();
  database.ref("/users/player1").on("value", function (snapshot) {
    snapshotP1 = snapshot;
  }, function (errorObject) {
    console.log("ERROR " + errorObject.code);
  });

  database.ref("/users/player2").on("value", function (snapshot) {
    snapshotP2 = snapshot;
  }, function (errorObject) {
    console.log("ERROR " + errorObject.code);
  });

  if (!(snapshotP1.exists())) {
    numberPlayers = 1;
    database.ref("/users/player1").onDisconnect().remove();
    database.ref("/users/player1").set({
      player:player,
      wins:0,
      losses:0
    });
    $("#pInfo").html("Hello " + player + " you are player 1.");
    $("#playerName").val("");
  
  }

  else if (!(snapshotP2.exists())) {
    $("#pTurn").html(" Waiting for 2");
    numberPlayers = 2;
    database.ref("/users/player2").onDisconnect().remove();
    database.ref("/users/player2").set({
      player:player,
      wins:0,
      losses:0
    });
    databse.ref().update({
      turn: 1
      });
    $("#pInfo").html("Hi " + player + "! You are player 2");
    $("#pTurn").html("Waiting for " + player1.playerTurn + " to choose");
    $("#playerName").val("");
  } else {
    $("#pInfo").text("Sorry 2 people already playing");
  };
});



database.ref().on("value", function(snapshot){
  var data=snapshot.val();
  if(!(data===null)){
if(data.selector===2 && numberPlayers===1){
  $("#pTurn").text("Waiting for "+ player2.playerTurn+" to choose");
}
else if(data.selector===1 &&numberPlayers===2){
  $("#pTurn").text("Waiting for "+ player1.playerTurn+" to choose");
}

if(data.selector===1&& numberPlayers===1){
 
  $("#playerTurn").html("It's your turn!");
}
else if(data.selector===2&&numberPlayers===2){
  
  $("#pTurn").html("It's your turn!");
}
else if(data.selector===3 && active===true){
  $("#pTurn").text("");
  rps();
};
};
});

$(".p1choices").on("click", function(){
  var choice=$(this).text();
  $("#p1choice").html("<h2>"+choice+"</h2>");
  database.ref("/users/player1").update({
    choice:choice
  });
database.ref().update({
  selector:2
});
})

$(".p2choices").on("click", function(){
  var choice=$(this).text();
  $("#p2choice").html("<h1>"+choice+"</h1>");
  database.ref("/users/player2").update({
    choice:choice
  });
database.ref().update({
  selector:3
});
})
//chat box

