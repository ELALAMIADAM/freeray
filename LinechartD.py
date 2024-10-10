import mysql.connector
from datetime import datetime

# Function to insert a single row into Linechart
def insert_signal_values(connection, value):
    try:
        cursor = connection.cursor()
        sql = """
        INSERT INTO Linechart (logical_address, address_ip, signal_value, date_takeen, type_date,group_id)
    VALUES (%s, %s, %s, %s, 'hour',%s) AS new_val
    ON DUPLICATE KEY UPDATE 
    date_takeen = new_val.date_takeen,
    signal_value = new_val.signal_value,
    type_date = new_val.type_date;
        """
        cursor.execute(sql, value)
        connection.commit()
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()
    finally:
        cursor.close()

# Function to connect to MySQL
def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="RAJAWIalami@2002",
            database="ip"
        )
        return connection
    except mysql.connector.Error as err:
        print("Error:", err)
        return None

# Function to select signals from database
def select_signals(connection):
    try:
        cursor = connection.cursor()
        sql = """
        SELECT d.logical_address, d.address_ip, ds.signal_value,d.group_id
        FROM dashboard d
        JOIN dashboard_group dg ON d.group_id = dg.group_id
        JOIN signal_slave ds ON ds.logical_address = d.logical_address AND ds.address_ip = d.address_ip
        WHERE dg.group_name = "GraphYield";
        """
        cursor.execute(sql)
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()
        return []
    finally:
        cursor.close()

# Function to add current time to each row
def add_time_to_rows(rows):
    now = datetime.now()
    time_without_seconds_and_minutes = now.strftime("%Y-%m-%d %H:00")
    return [(row[0], row[1], row[2], time_without_seconds_and_minutes) for row in rows]

# Main execution
connection = connect_to_mysql()
if connection:
    res = select_signals(connection)
    if res:
        res_with_time = add_time_to_rows(res)
        print(res_with_time)

        # Insert each row with time into the Linechart table
        for row in res_with_time:
            insert_signal_values(connection, row)

    connection.close()
