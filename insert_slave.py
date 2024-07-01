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

# Insert values into a table
def insert_values(connection, values):
    try:
        cursor = connection.cursor()
        sql = "INSERT INTO slaves (logical_address,slave_name) VALUES (%s, %s)"
        cursor.execute(sql, values)
        connection.commit()
        print("Values inserted successfully!")
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()

# Close the connection
def close_connection(connection):
    connection.close()
    print("Connection closed.")

if __name__ == "__main__":
    # Connect to MySQL
    connection = connect_to_mysql()
    if connection:

        values = (1,'nb')
        
        # Insert values
        insert_values(connection, values)
        
        # Close connection
        close_connection(connection)
