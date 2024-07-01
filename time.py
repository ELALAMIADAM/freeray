import mysql.connector
from datetime import datetime

def insert_signal_values(connection, value):
    try:
        cursor = connection.cursor()
        sql = """
        INSERT INTO signal_slave (logical_address, address_ip, signal_value) 
        VALUES (100, 40000, %s) 
        ON DUPLICATE KEY UPDATE signal_value = VALUES(signal_value);
        """
        cursor.execute(sql, (value,))
        connection.commit()
        print("Values inserted successfully!")
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()
    finally:
        cursor.close()  # Close the cursor

def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="RAJAWIalami@2002",
            database="ip"
        )
        print("Connected to MySQL!")
        return connection
    except mysql.connector.Error as err:
        print("Error:", err)
        return None

connection = connect_to_mysql()
if connection:
    # Get the current date and time
    now = datetime.now()

    # Convert to timestamp
    timestamp = now.timestamp()

    # Print the timestamp
    print("Timestamp:", timestamp)

    # Insert the timestamp into the database
    insert_signal_values(connection, timestamp)

    # Close the connection
    connection.close()
