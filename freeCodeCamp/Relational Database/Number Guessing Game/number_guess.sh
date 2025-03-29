#!/bin/bash

# Database setup (create database and tables)
PSQL="psql --username=freecodecamp --dbname=postgres --no-align --tuples-only -c" #connect to postgres to create the database.
DATABASE_EXISTS=$($PSQL "SELECT 1 FROM pg_database WHERE datname='number_guess'")

if [[ -z $DATABASE_EXISTS ]]; then
  echo "Creating database number_guess..."
  $PSQL "CREATE DATABASE number_guess"
  if [[ $? -ne 0 ]]; then
    echo "Error creating database."
    exit 1
  fi

  PSQL="psql --username=freecodecamp --dbname=number_guess --no-align --tuples-only -c" #connect to the newly created database.

  # Add database interaction functions
  echo "Creating tables..."
  $PSQL "CREATE TABLE users (user_id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL)"
  if [[ $? -ne 0 ]]; then
    echo "Error creating users table."
    exit 1
  fi

  $PSQL "CREATE TABLE games (game_id SERIAL PRIMARY KEY, number_guesses INT NOT NULL, user_id INT REFERENCES users(user_id))"
  if [[ $? -ne 0 ]]; then
    echo "Error creating games table."
    exit 1
  fi

  echo "Database and tables created."
else
  echo "Database number_guess already exists."
  PSQL="psql --username=freecodecamp --dbname=number_guess --no-align --tuples-only -c" #connect to the database.
fi

# Implement main game logic, including user authentication, number guessing, and game statistics
echo "Enter your username:"
read USERNAME

USERNAME_AVAIL=$($PSQL "SELECT username FROM users WHERE username = '$USERNAME'")

GAMES_PLAYED=$($PSQL "SELECT COUNT(*) FROM users INNER JOIN games USING(user_id) WHERE username = '$USERNAME'")
BEST_GAME=$($PSQL "SELECT MIN(number_guesses) FROM users INNER JOIN games USING(user_id) WHERE username = '$USERNAME'")

if [[ -z $USERNAME_AVAIL ]]; then
  INSERT_USERNAME=$($PSQL "INSERT INTO users(username) VALUES('$USERNAME')")
  echo "Welcome, $USERNAME! It looks like this is your first time here."
else
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

guess=1

RAMDON_NU=$((1 + $RANDOM % 1000))
echo "Guess the secret number between 1 and 1000:"
while read n2; do
  if [[ ! $n2 =~ ^[0-9]+$ ]]; then
    echo "That is not an integer, guess again:"
  else
    if [[ $n2 -eq $RAMDON_NU ]]; then
      break;
    else
      if [[ $n2 -gt $RAMDON_NU ]]; then
        echo -n "It's lower than that, guess again:"
      elif [[ $n2 -lt $RAMDON_NU ]]; then
        echo -n "It's higher than that, guess again:"
      fi
    fi
  fi
  guess=$(( $guess + 1 ))
done

if [[ $guess == 1 ]]; then
  echo "You guessed it in $guess tries. The secret number was $RAMDON_NU. Nice job!"
else
  echo "You guessed it in $guess tries. The secret number was $RAMDON_NU. Nice job!"
fi

# Add game result output and insert game data into the database
USERNAME_ID=$($PSQL "SELECT user_id FROM users WHERE username = '$USERNAME'")
INSERT_GAME=$($PSQL "INSERT INTO games(number_guesses, user_id) VALUES($guess, $USERNAME_ID)")