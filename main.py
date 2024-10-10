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
            print(modbus_address,logical_address)
            print("Failed to read data:", result)
            return [1]
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
    mycursor.execute("SELECT signals.address_ip, signals.Quantity,slaves.logical_address,signals.Unity,signals.type_data,signals.gain FROM slaves INNER JOIN signals ON signals.slave_name = slaves.slave_name;")
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
        sql = "INSERT INTO signal_slave (logical_address,address_ip,signal_value) VALUES (%s,%s,%s) ON DUPLICATE KEY UPDATE signal_value = VALUES(signal_value);"
        cursor.execute(sql, values)
        connection.commit()
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()
    finally:
        connection.close()

def convert_to_signed_value(type, combined_register):
    if type == 'I64':
        signed_value = combined_register if combined_register <= 0x7FFFFFFFFFFFFFFF else combined_register - 0x10000000000000000
        return signed_value
    elif type == 'I32':
        signed_value = combined_register if combined_register <= 0x7FFFFFFF else combined_register - 0x100000000
        return signed_value
    elif type == 'I16':
        signed_value = combined_register if combined_register <= 0x7FFF else combined_register - 0x10000
        return signed_value
    else:
        return combined_register

def combine_unsigned_values(unsigned_values):
    combined_register = 0
    for value in unsigned_values:
        combined_register = (combined_register << 16) | (value & 0xFFFF)
    return combined_register

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Smartlogger data reader.')
    parser.add_argument('database', type=str, help='Name of the MySQL database to use')
    args = parser.parse_args()

    data = get_ip(args.database)
    data_ip = [[row[0], row[1], row[2]] for row in data]

    values = [list(row) for row in data]
    for i in range(len(data)):
        result = read_smartlogger(*data_ip[i])
        values[i].append(list(result))        
        values[i][6] = combine_unsigned_values(values[i][6])
        values[i][6] = convert_to_signed_value(values[i][4], values[i][6]) / values[i][5]

    value = [[row[2], row[0], row[6]] for row in values]
    for val in value:
        connection = connect_to_mysql(args.database)
        insert_signal_values(connection, val)
    print(value)