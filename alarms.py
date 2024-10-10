import argparse
import mysql.connector
from pymodbus.client import ModbusTcpClient

smartlogger_ip= '192.168.0.10' # IP address
smartlogger_port = 502  # TCP port  

def read_smartlogger(modbus_address, num_registers, logical_address):
    try:
        # Connect to the Smartlogger
        client = ModbusTcpClient(smartlogger_ip, port=smartlogger_port)
        client.connect()
        # Read data from the specified Modbus address using the slave ID
        result = client.read_holding_registers(modbus_address, num_registers, logical_address) #read holding register !!!!
        if result.isError():
            return [0]
        else:
            return result.registers
    finally:
        # Close the connection
        client.close()

def get_ip(database):
    mydb = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="RAJAWIalami@2002",
        database=database
    )

    mycursor = mydb.cursor()
    mycursor.execute("SELECT alarms_signal.address_ip, alarms_signal.Quantity,slaves.logical_address,alarms_signal.Unity,alarms_signal.type_data FROM slaves INNER JOIN alarms_signal ON alarms_signal.slave_name = slaves.slave_name;")
    result = mycursor.fetchall()
    
    mycursor.close()
    mydb.close()

    return result

def connect_to_mysql(database):
    try:
        connection = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="RAJAWIalami@2002",
            database=database
        )
        return connection
    except mysql.connector.Error as err:
        print("Error:", err)
        return None

def insert_signal_values(connection, values):
    try:
        cursor = connection.cursor()
        sql = "INSERT INTO alarms_active (address_ip,bit,active_alarm) VALUES (%s,%s,%s) ON DUPLICATE KEY UPDATE active_alarm = VALUES(active_alarm);"
        cursor.execute(sql, values)
        connection.commit()
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()
    finally:
        connection.close()

def decimal_to_16bit_unsigned_array(decimal):
    if not (0 <= decimal <= 65535):
        raise ValueError("The number must be between 0 and 65535 for a 16-bit unsigned integer.")
    
    binary_representation = format(decimal, '016b')
    binary_array = [int(bit) for bit in binary_representation]
    
    return binary_array

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Smartlogger data reader.')
    parser.add_argument('database', type=str, help='Name of the MySQL database to use')
    args = parser.parse_args()

    data = get_ip(args.database)
    data_ip = [[row[0], row[1], row[2]] for row in data]

    values = [[row[0], 0] for row in data]

    for i in range(len(data_ip)):
        result = read_smartlogger(*data_ip[i])
        res = decimal_to_16bit_unsigned_array(result[0])
        values[i][1] = res

    for i in range(len(data)):
        for j in range(16):
            connection = connect_to_mysql(args.database)
            value = [values[i][0], j, values[i][1][15-j]]
            print(value)
            insert_signal_values(connection, value)
