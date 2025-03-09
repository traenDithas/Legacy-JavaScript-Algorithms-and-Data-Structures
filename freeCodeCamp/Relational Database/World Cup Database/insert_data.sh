#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.

# Clear existing data
echo $($PSQL "TRUNCATE TABLE games, teams")

#year,round,winner,opponent,winner_goals,opponent_goals
cat games.csv | while IFS="," read Y R W O WG OP
do
  # Get or insert winner
  TEAM=$($PSQL "SELECT name FROM teams WHERE name='$W'")
  if [[ $W != "winner" ]]
  then
  if [[ -z $TEAM ]]
  then
  INSERT_MAJOR_RESULT=$($PSQL "INSERT INTO teams(name) VALUES('$W')")
  if [[ $INSERT_MAJOR_RESULT == "INSERT 0 1" ]]
  then   
  echo Inserted into teams, $W
  fi
  fi
  fi
    # Get or insert opponent
    TEAM2=$($PSQL "SELECT name FROM teams WHERE name='$O'")
    if [[ $O != "opponent" ]]
    then
    if [[ -z $TEAM2 ]]
    then
    INSERT_MAJOR_RESULT1=$($PSQL "INSERT INTO teams(name) VALUES('$O')")
    if [[ $INSERT_MAJOR_RESULT1 == "INSERT 0 1" ]]
    then   
    echo Inserted into teams, $O
    fi
    fi
    fi
      # Insert game
      TEAM_IDW=$($PSQL "SELECT team_id FROM teams WHERE name='$W'")
      TEAM_IDO=$($PSQL "SELECT team_id FROM teams WHERE name='$O'")
      if [[ -n $TEAM_IDO || -n $TEAM_IDW ]]
      then
      if [[ $Y != "year" ]]
      then
      INSERT_MAJORS_COURSES_RESULT=$($PSQL "INSERT INTO games(year, round, winner_id, opponent_id, winner_goals, opponent_goals) VALUES($Y, '$R', $TEAM_IDW, $TEAM_IDO,$WG, $OP)")
      if [[ $INSERT_MAJORS_COURSES_RESULT == "INSERT 0 1" ]]
      then
      echo Inserted into games, $Y
      fi
      fi
      fi

done