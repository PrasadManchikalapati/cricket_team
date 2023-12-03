const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(8088, () => {
      console.log("Server Running at http://localhost:3030/");
    });
  } catch (e) {
    console.log(`DB error :${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const dbQuery = `SELECT * FROM cricket_team
                        ORDER BY player_id`;
  const playersArray = await db.all(dbQuery);
  response.send(playersArray);
});
app.use(express.json());

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES('${playerName}',${jerseyNumber},'${role}');`;
  const responseValue = await db.run(addQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dbSingleQuery = `SELECT * FROM cricket_team
                        WHERE player_id=${playerId};`;
  const playersArrayNew = await db.get(dbSingleQuery);
  response.send(playersArrayNew);
});

app.put("/players/:playerId/", async (request, response) => {
  const player_info = request.body;
  const { playerId, playerName, jerseyNumber, role } = player_info;
  const dbUpdQuery = `UPDATE cricket_team
  SET 
  player_name='${playerName}',
  jersey_number=${jerseyNumber},
  role='${role}'
  WHERE player_id=${playerId};`;
  const playersUpdArrayNew = await db.run(dbUpdQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team
                        WHERE player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
