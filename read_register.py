from pymodbus.client import ModbusTcpClient

smartlogger_ip= '192.168.0.10' # IP address
smartlogger_port = 502  # TCP port  

class read_register:
    def __init__(self,modbus_address,num_registers,logical_address) -> None:    
        self.modbus_address=modbus_address      # Address for data
        self.num_registers=num_registers        # Number of registers 
        self.logical_address=logical_address    # Address for slave

    def read_smartlogger(self):
        try:
            # Connect to the Smartlogger
            client = ModbusTcpClient(smartlogger_ip, port=smartlogger_port)
            client.connect()
            print(0)
            # Read data from the specified Modbus address using the slave ID
            result = client.read_holding_registers(self.modbus_address, self.num_registers, self.logical_address) #read holding register !!!!
            if result.isError():
                print("Failed to read data:", result)
                return  [0]
            else:
                print(result.registers)
                return(result.registers)
                
        finally:
            # Close the connection
            client.close()

    
