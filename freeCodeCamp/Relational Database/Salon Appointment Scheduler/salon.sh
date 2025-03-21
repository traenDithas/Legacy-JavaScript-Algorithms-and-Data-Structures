#! /bin/bash

PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

echo -e "\n~~~~~ MY SALON ~~~~~\n"


echo -e "Welcome to My Salon, how can I help you?\n"

# Define the MAIN_MENU function
MAIN_MENU() {
  # Check if an argument was passed to the function
  if [[ $1 ]]
  then
    # Display the argument as an error message
    echo -e "\n$1"
  fi

  # Retrieve available services from the database
  AVAILABLE_SERVICES=$($PSQL "SELECT service_id, name FROM services ORDER BY service_id")

  # Check if any services are available
  if [[ -z $AVAILABLE_SERVICES ]]
  then
    # Display a message if no services are available
    echo "Sorry, we don't have any service available right now."
  else
    # Display the list of available services
    echo "$AVAILABLE_SERVICES" | while read SERVICE_ID BAR NAME
    do
      echo "$SERVICE_ID) $NAME"
    done

    # Read the selected service ID from the user
    read SERVICE_ID_SELECTED

    # Validate the selected service ID
    if [[ ! $SERVICE_ID_SELECTED =~ ^[0-9]+$ ]]
    then
      # Call the main menu again with an error message
      MAIN_MENU "That is not a valid number."
    else
      # Check if the selected service ID exists in the database
      SERV_AVAILABILITY=$($PSQL "SELECT service_id FROM services WHERE service_id = $SERVICE_ID_SELECTED ")
      NAME_SERV=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED ")

      # If the service does not exist
      if [[ -z $SERV_AVAILABILITY ]]
      then
        # Call the main menu again with an error message
        MAIN_MENU "I could not find that service. What would you like today?"
      else
        # Prompt the user for their phone number
        echo -e "\nWhat's your phone number?"
        read CUSTOMER_PHONE

        # Retrieve the customer's name from the database
        CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone = '$CUSTOMER_PHONE'")

        # If the customer does not exist
        if [[ -z $CUSTOMER_NAME ]]
        then
          # Prompt the user for their name
          echo -e "\nWhat's your name?"
          read CUSTOMER_NAME

          # Insert the new customer into the database
          INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(name, phone) VALUES('$CUSTOMER_NAME', '$CUSTOMER_PHONE')")

          # echo -e "\nWhat's your name?"
        fi

        # Prompt the user for the appointment time
        echo -e "\nWhat time would you like your $NAME_SERV, $CUSTOMER_NAME?"
        read SERVICE_TIME

        # Retrieve the customer ID from the database
        CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")

        # If the service time is provided
        if [[ $SERVICE_TIME ]]
        then
          # Insert the appointment into the database
          INSERT_SERV_RESULT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID_SELECTED,'$SERVICE_TIME')")

          # If the appointment insertion was successful
          if [[ $INSERT_SERV_RESULT ]]
          then
            # Display the appointment confirmation message
            echo -e "\nI have put you down for a $NAME_SERV at $SERVICE_TIME, $(echo $CUSTOMER_NAME | sed -r 's/^ *| *$//g')."
          fi
        else
          # Call the main menu again with an error message
          MAIN_MENU "That is not a valid number."
        fi
      fi
    fi
  fi
}

# Call the MAIN_MENU function
MAIN_MENU