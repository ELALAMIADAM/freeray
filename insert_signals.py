import mysql.connector

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

def insert_values(connection, values):
    try:
        cursor = connection.cursor()
        sql = "INSERT INTO signals (address_ip,signal_name,unity,quantity,slave_name) VALUES (%s, %s, %s, %s, %s)ON DUPLICATE KEY UPDATE signal_name = VALUES(signal_name), unity = VALUES(unity), quantity = VALUES(quantity), quantity = VALUES(quantity);"
        cursor.execute(sql, values)
        connection.commit()
        print("Values inserted successfully!")
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()

def close_connection(connection):
    connection.close()
    print("Connection closed.")

if __name__ == "__main__":
    # Connect to MySQL
    connection = connect_to_mysql()
    if connection:

        values = (50005,'Alarm 6','N/A',1, 'SmartLogger')
        
        # Insert values
        insert_values(connection, values)
        
        # Close connection
        close_connection(connection)
