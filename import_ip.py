import mysql.connector

# MySQL connection configuration
source_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'RAJAWIalami@2002',
    'database': 'ip',
    'raise_on_warnings': True
}

target_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'RAJAWIalami@2002',
    'database': 'ip2',
    'raise_on_warnings': True
}

# Function to copy a single table
def copy_table(target_database, table):
    try:
        # Connect to source and target databases
        source_conn = mysql.connector.connect(**source_config)
        target_conn = mysql.connector.connect(**target_config)

        source_cursor = source_conn.cursor()
        target_cursor = target_conn.cursor()

        # SQL query to create target table and copy data
        sql_query = f"CREATE TABLE `{target_database}`.`{table}` AS SELECT * FROM `{source_config['database']}`.`{table}`"

        # Execute query
        target_cursor.execute(sql_query)
        print(f"Table '{table}' copied to '{target_database}.{table}' successfully.")

        # Commit changes
        target_conn.commit()

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
    except Exception as ex:
        print(f"Error: {ex}")

    finally:
        # Close cursors and connections
        if source_cursor:
            source_cursor.close()
        if target_cursor:
            target_cursor.close()
        if source_conn:
            source_conn.close()
        if target_conn:
            target_conn.close()

# Example usage
if __name__ == "__main__":
    target_database = 'ip2'
    tables_to_copy = ['users', 'signal_slave','chartdata','alarms','signals','slaves','dashboard','dashboard_group','data_dashboard','emi_register_remapped','emi_registers','inverter_register','inverter_register_remapped','linechart','power_meter_registers','public_registers','smartlogger_registers','sun200_inverter_registers'] 

    for table in tables_to_copy:
        copy_table(target_database, table)

    print('All tables copied successfully.')
