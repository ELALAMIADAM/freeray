# from read_register import read_register
import mysql.connector
import datetime
import json
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
                # print("Failed to read data:", result)
                return  [0]
            else:
                return(result.registers)
                
        finally:
            # Close the connection
            client.close()
def get_ip():
    mydb = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="RAJAWIalami@2002",
        database="ip"
    )

    # cursor object to execute SQL queries
    mycursor = mydb.cursor()

    # Execute a SELECT query
    mycursor.execute("SELECT signals.address_ip, signals.Quantity,slaves.logical_address,signals.Unity,signals.type_data,signals.gain FROM slaves INNER JOIN signals ON signals.slave_name = slaves.slave_name;")

    # Fetch all rows from the result set
    result = mycursor.fetchall()

    
    

    # Close the cursor and connection
    mycursor.close()
    mydb.close()

    return result
def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="RAJAWIalami@2002",
            database="ip"
        )
        # print("Connected to MySQL!")
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
        # print("Values inserted successfully!")
    except mysql.connector.Error as err:
        print("Error:", err)
        connection.rollback()
    finally:
            # Close the connection
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

    
def convert_combined_to_signed(combined_register):
    # Interpret the combined register as a signed value
    signed_value = combined_register if combined_register <= 0x7FFFFFFF else combined_register - 0x100000000
    return signed_value


def combine_unsigned_values(unsigned_values):
    # Combine unsigned values into a single 64-bit register
    combined_register = 0
    for value in unsigned_values:
        combined_register = (combined_register << 16) | (value & 0xFFFF)
    return combined_register

# def convert_data(values):
#     if values[3]=='date_time':
#         epoch_date = datetime.datetime(1952, 9, 5, 22, 50, 16)
#         delta = datetime.timedelta(days=values[4][0]) + datetime.timedelta(seconds=values[4][1])
#         new_date=epoch_date + delta
#         values[4] = new_date.strftime('%Y-%m-%d %H:%M:%S')
#     if values[1]==2:
#     values[4]=json.dumps(values[4])
#         print(values[4][1])
    

if __name__ == "__main__":


    # Call the function to get ip 

    data=get_ip()
    data_ip=[]

    for row in data:
        data_ip.append(list([row[0],row[1],row[2]]))
    # print(data_ip[0])


    # Call the function to read data

# date_time=read_smartlogger(*data_ip[0])
# print(date_time)
    values=[]
    for row in data:
        values.append(list(row))
    for i in range(len(data)):
        
        result=read_smartlogger(*data_ip[i])

        values[i].append(list(result))        
        # print(values[i])
        values[i][6]=combine_unsigned_values(values[i][6]) 
        values[i][6]=convert_to_signed_value(values[i][4],values[i][6])/values[i][5]
        print(values[i])

    # print(convert_to_signed_value('I32',values[0][6]))

   
    value=[]
    for row in values:
        value.append(list([row[2],row[0],row[6]]))
    print(value)
    for i in range(len(data)):

        connection = connect_to_mysql()
        # Call the function to insert value
        insert_signal_values(connection, value[i]) 
        
