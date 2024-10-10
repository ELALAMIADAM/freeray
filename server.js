const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const cron = require('node-cron');
const bodyParser = require('body-parser');


const app = express();
const port = 3001;
let databaseName = 'ip'; 

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_secret_key', // Secret used to sign the session ID cookie
  resave: false,
  saveUninitialized: true
}));

let pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'RAJAWIalami@2002',
  database: 'ip',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0 
});
const users = mysql.createPool({
  host: '127.0.0.1', 
  user: 'root', 
  password: 'RAJAWIalami@2002', 
  database: 'users',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0 
});

async function createDatabase(databaseName) {
  return new Promise((resolve, reject) => {
    pool.query(`CREATE DATABASE ??`, [databaseName], (err, results) => {
      if (err) {
        console.error(`Error creating database ${databaseName}: ${err}`);
        return reject(err);
      }
      resolve(results);
    });
  });
}




async function getTableSchema(table) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT 
        COLUMN_NAME, 
        COLUMN_KEY, 
        DATA_TYPE, 
        IS_NULLABLE, 
        COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'ip' AND TABLE_NAME = ?;
    `;
    pool.query(sqlQuery, [table], (err, results) => {
      if (err) {
        console.error(`Error retrieving schema for table ${table}: ${err}`);
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getPrimaryKeyColumns(table) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT 
        COLUMN_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = 'ip' 
        AND TABLE_NAME = ? 
        AND CONSTRAINT_NAME = 'PRIMARY';
    `;
    pool.query(sqlQuery, [table], (err, results) => {
      if (err) {
        console.error(`Error retrieving primary key columns for table ${table}: ${err}`);
        return reject(err);
      }
      resolve(results.map(row => row.COLUMN_NAME));
    });
  });
}



app.post('/createProject', async (req, res) => {
  const projectName = req.body.projectName;
  const tablesToCopy = [
    'alarms', 'alarms_active','alarms_signal', 'users', 'signal_slave', 'chartdata', 'signals', 'slaves', 'dashboard', 
    'dashboard_group', 'emi_register_remapped', 'emi_registers', 
    'inverter_register', 'inverter_register_remapped', 'performance_data_sl', 'power_meter_registers', 
    'public_registers', 'smartlogger_registers', 'sun200_inverter_registers'
  ];

  try {
    await createDatabase(projectName);

    for (const table of tablesToCopy) {
      await createAndCopyTable(projectName, table);
    }

    // Insert project name into db table
    const sql = 'INSERT INTO db (db_name) VALUES (?)';
    users.query(sql, [projectName], (err, result) => {
      if (err) {
        console.error(`Error inserting project name into db table: ${err}`);
        return res.status(500).send(err);
      }
      res.send('Project created and tables copied successfully!');
    });
  } catch (error) {
    console.error(`Error creating project and copying tables: ${error}`);
    res.status(500).json({ error: 'Error creating project and copying tables' });
  }
});

async function createAndCopyTable(targetDatabase, table) {
  try {
    // Create the table in the target database with the same structure as the source table
    const createTableSQL = `CREATE TABLE ${targetDatabase}.${table} LIKE ip.${table}`;
    await new Promise((resolve, reject) => {
      pool.query(createTableSQL, (err, results) => {
        if (err) {
          console.error(`Error creating table ${targetDatabase}.${table}: ${err}`);
          return reject(err);
        }
        resolve(results);
      });
    });

    // Copy data into the newly created table
    const copyDataSQL = `INSERT INTO ${targetDatabase}.${table} SELECT * FROM ip.${table}`;
    await new Promise((resolve, reject) => {
      pool.query(copyDataSQL, (err, results) => {
        if (err) {
          console.error(`Error copying data from table ${table} to ${targetDatabase}: ${err}`);
          return reject(err);
        }
        resolve(results);
      });
    });

  } catch (err) {
    console.error(`Error creating and copying table ${table}: ${err}`);
    throw err;
  }
}




app.delete('/projects/:id', (req, res) => {
  const projectId = req.params.id;

  // First, find the project to get the database name
  users.query('SELECT db_name FROM db WHERE db_id = ?', [projectId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching project');
    }

    if (results.length === 0) {
      return res.status(404).send('Project not found');
    }

    const dbName = results[0].db_name;

    // Delete the project from the db table
    users.query('DELETE FROM db WHERE db_id = ?', [projectId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error deleting project');
      }

      // Drop the database
      users.query(`DROP DATABASE \`${dbName}\``, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error dropping database');
        }

        res.sendStatus(200);
      });
    });
  });
});

app.post('/switchDatabase', (req, res) => {
  const { dbId, dbName } = req.body;

  // Update the db_now table
  users.query('UPDATE db_now SET db_id = ? ', [dbId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating db_now table');
    }

    // Recreate the pool with the new database
    pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: 'RAJAWIalami@2002',
      database: dbName ,
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0 
    });
    databaseName = pool.config.connectionConfig.database; 

    res.send('Database switched successfully');
  });
});

app.get('/projects', (req, res) => {
  const sql = 'SELECT * FROM db';
  users.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, NOW())';
  users.query(query, [username, password, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  users.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];

    // For simplicity, compare plain text password (not recommended for production)
    if (password !== user.password) {
      return res.status(401).send('Invalid password');
    }

    // Store user in session
    req.session.user = user;

    res.status(200).send({ auth: true });
  });
});


app.get('/api/signal-names', (req, res) => {
  const query = `select * from smartlogger_registers 
                 union select * from public_registers`;
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const signalNames = results.map(row => row.Signal_name);
    res.json(signalNames);
  });
});
app.get('/api/signal-namesSL', (req, res) => {
  const query = `select * from smartlogger_registers 
                 union select * from public_registers`;
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const signalNames = results.map(row => row.Signal_name);
    res.json(signalNames);
  });
});
app.get('/api/signal-namesEMI', (req, res) => {
  const query = `select * from emi_registers 
                 union select * from public_registers`;
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const signalNames = results.map(row => row.Signal_name);
    res.json(signalNames);
  });
});
app.get('/api/signal-namesPM', (req, res) => {
  const query = `select * from power_meter_registers 
                 union select * from public_registers`;
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const signalNames = results.map(row => row.Signal_name);
    res.json(signalNames);
  });
});
app.get('/api/signal-namesIN', (req, res) => {
  const query = `select * from inverter_register_remapped 
                 union select * from public_registers`;
  
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const signalNames = results.map(row => row.Signal_name);
    res.json(signalNames);
  });
});


app.get('/alarm', (req, res) => {
  
    const sql = `SELECT 
    SUM(CASE WHEN Severity = 'Major' THEN active_alarm ELSE 0 END) AS Majeur,
    SUM(CASE WHEN Severity = 'Minor' THEN active_alarm ELSE 0 END) AS Mineur,
    SUM(CASE WHEN Severity = 'Adaptable' THEN active_alarm ELSE 0 END) AS Averts,
    SUM(CASE WHEN Severity = 'Warning' THEN active_alarm ELSE 0 END) AS Critique
FROM (
    SELECT a.address_ip, a.bit, a.Severity, aa.active_alarm
    FROM alarms a
    JOIN alarms_active aa
    ON a.address_ip = aa.address_ip
    AND a.bit = aa.bit
) AS subquery;
`;
    pool.execute(sql,(err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
});

app.post('/insert_slave', (req, res) => {
  const { logical_address, slave_name } = req.body;
  if(slave_name!=='SmartLogger'){
    const insertSlaveSql = `
    INSERT INTO slaves (logical_address, slave_name)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE slave_name = VALUES(slave_name)
  `;
  pool.execute(insertSlaveSql, [logical_address, slave_name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Values inserted or updated successfully!' });
  });
  }
  if(slave_name==='SmartLogger'){
    const insertSlaveSql = `
    INSERT INTO slaves (logical_address, slave_name)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE slave_name = VALUES(slave_name)
  `;
  pool.execute(insertSlaveSql, [logical_address, slave_name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Values inserted or updated successfully!' });
  });
  }
});







app.post('/insert_signal', (req, res) => {
  const { signal_name, slave_name } = req.body;

  if (!signal_name || !slave_name) {
    return res.status(400).json({ error: 'signal_name and slave_name are required' });
  }

  let tableName;
  switch (slave_name) {
    case 'SmartLogger':
      tableName = 'smartlogger_registers';
      break;
    case 'EMI':
      tableName = 'emi_registers';
      break;
    case 'POWER METER':
      tableName = 'power_meter_registers';
      break;
    default:
      return res.status(400).json({ error: 'Invalid slave_name' });
  }

  const selectSql = `SELECT * FROM (
    SELECT * FROM public_registers
    UNION
    SELECT * FROM ${tableName}
) AS combined_registers
WHERE signal_name = ?`;
  pool.execute(selectSql, [signal_name], (err, results) => {
    if (err) {
      console.error('Error executing selectSql:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: `Signal not found in ${tableName}` });
    }

    const signalData = results[0];
    const address_ip = signalData.address_ip || null;
    const Unity = signalData.Unity != null ? signalData.Unity : null;
    const quantity = signalData.quantity || null;
    const gain = signalData.gain || null;
    const type_data = signalData.type_data || null;

    const insertSignalSql = `
      INSERT INTO signals (address_ip, signal_name, Unity, quantity, slave_name, gain, type_data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        signal_name = VALUES(signal_name),
        Unity = VALUES(Unity),
        quantity = VALUES(quantity),
        gain = VALUES(gain),
        type_data = VALUES(type_data)
    `;
    pool.execute(insertSignalSql, [address_ip, signal_name, Unity, quantity, slave_name, gain, type_data], (err, results) => {
      if (err) {
        console.error('Error executing insertSignalSql:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Signal inserted or updated successfully!' });
    });
  });
});



app.post('/insert_inverter', (req, res) => {
  const { signal_name, slave_name } = req.body;

  if (!signal_name || !slave_name) {
    return res.status(400).json({ error: 'signal_name and slave_name are required' });
  }
  const selectSql = `select * from ( SELECT i.id, (51000 + 25*(s.logical_address-1) + i.address_ip) AS address_ip,i.Signal_name,i.type_data,i.quantity,i.gain,i.Unity
FROM inverter_register_remapped i
JOIN slaves s ON s.slave_name = 'Inverter'
    UNION SELECT * FROM public_registers
) AS combined_registers
WHERE signal_name = ?`;
  pool.execute(selectSql, [signal_name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: `Signal not found in ${tableName}` });
    }

    const signalData = results[0];
    const address_ip = signalData.address_ip || null;
    const Unity = signalData.Unity != null ? signalData.Unity : null; // Ensure Unity is explicitly set to null if undefined
    const quantity = signalData.quantity || null;
    const gain = signalData.gain || null;
    const type_data = signalData.type_data || null;

    const insertSignalSql = `
      INSERT INTO signals (address_ip, signal_name, Unity, quantity, slave_name, gain, type_data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    pool.execute(insertSignalSql, [address_ip, signal_name, Unity, quantity, slave_name, gain, type_data], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Signal inserted or updated successfully!' });
    });
  });
});




app.post('/create_group', (req, res) => {
  const { group_name } = req.body;

  if (!group_name) {
    return res.status(400).json({ error: 'group_name is required.' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const findOrCreateGroupSql = `
      INSERT INTO dashboard_group (group_name)
      VALUES (?);
    `;

    connection.execute(findOrCreateGroupSql, [group_name], (err, results) => {
      connection.release();
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const groupId = results.insertId;
      res.json({  group_id: groupId });
    });
  });
});
app.post('/insert_dashboard_with_details', (req, res) => {
  const { group_id, slave_name, signal_name } = req.body;

  if (!group_id || !slave_name || !signal_name) {
    return res.status(400).json({ error: 'group_id, slave_name, and signal_name are required.' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const getDetailsSql = `
      SELECT s.logical_address, a.address_ip
      FROM slaves s
      JOIN signals a ON s.slave_name = ? AND a.signal_name = ?;
    `;

    connection.execute(getDetailsSql, [slave_name, signal_name], (err, results) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Details not found.' });
      }

      const { logical_address, address_ip } = results[0];

      const insertGraphSql = `
        INSERT INTO dashboard (group_id, logical_address, address_ip)
        VALUES (?, ?, ?);
      `;

      connection.execute(insertGraphSql, [group_id, logical_address, address_ip], (err, results) => {
        connection.release();
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Dashboard entry created successfully!' });
      });
    });
  });
});





app.get('/signal_slaves', (req, res) => {
  const sql = `
    SELECT *, 
           CASE 
             WHEN ss.address_ip = 65534 AND ss.signal_value = 45056 THEN 'Disconnection'
             WHEN ss.address_ip = 65534 AND ss.signal_value = 45057 THEN 'Online'
             ELSE CAST(ss.signal_value AS CHAR) 
           END AS device_status
    FROM signal_slave ss
    JOIN signals s ON ss.address_ip = s.address_ip
    JOIN slaves sl ON sl.logical_address = ss.logical_address
  `;

  pool.execute(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});





// app.get('/signal_slaves', (req, res) => {
//   const sql = `
//     SELECT *, 
//            CASE 
//              WHEN ss.signal_value = 45056 THEN 'Disconnection'
//              WHEN ss.signal_value = 45057 THEN 'Online'
//              ELSE 'Unknown'
//            END AS device_status
//     FROM signal_slave ss
//     JOIN signals s ON ss.address_ip = s.address_ip
//     JOIN slaves sl ON sl.logical_address = ss.logical_address
//   `;

//   pool.execute(sql, (err, results) => {
//     if (err) {
//       console.error('Database error:', err.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.json(results);
//   });
// });




app.get('/dashboard', (req, res) => {
  const sql = `
    SELECT 
      d.dash_id,
      d.group_id,
      dd.group_name,
      d.logical_address,
      d.address_ip,
      s.signal_name,
      sl.slave_name,
      ss.signal_value
    FROM 
      dashboard d
      JOIN signals s ON d.address_ip = s.address_ip
      JOIN slaves sl ON d.logical_address = sl.logical_address
      JOIN signal_slave ss ON s.address_ip = ss.address_ip AND sl.logical_address = ss.logical_address
      JOIN dashboard_group dd ON dd.group_id = d.group_id
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results); // No need for Object.values(results)
  });
});


app.delete('/deleteDash/:dash_id', (req, res) => {
  const { dash_id } = req.params;
  const sql = 'DELETE FROM dashboard WHERE dash_id = ?';
  pool.execute(sql, [dash_id], (err, results) => {
    if (err) {
      console.error('Error deleting dashboard entry:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Dashboard entry deleted successfully', results });
  });
});



app.get('/chartDataDay', (req, res) => {
  const sql = 'SELECT date_takeen, signal_value FROM Linechart where type_date="hour"';
  pool.execute(sql, (err, results) => {
    if (err) {
      console.error('Error fetching SlavesList:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/chartDataMonth', (req, res) => {
  const sql = 'SELECT date_takeen, signal_value FROM Linechart where type_date="month"';
  pool.execute(sql, (err, results) => {
    if (err) {
      console.error('Error fetching SlavesList:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/chartDataYear', (req, res) => {
  const sql = "SELECT DATE_FORMAT(datetime, '%Y-%m') AS month, SUM(value) AS total_value FROM ChartData GROUP BY DATE_FORMAT(datetime, '%Y-%m')";
  pool.execute(sql, (err, results) => {
    if (err) {
      console.error('Error fetching SlavesList:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/chartDataLife', (req, res) => {
  const sql = 'SELECT YEAR(datetime) AS year, SUM(value) AS total_value FROM ChartData GROUP BY YEAR(datetime)';
  pool.execute(sql, (err, results) => {
    if (err) {
      console.error('Error fetching SlavesList:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/SlavesList', (req, res) => {
  const sql = 'SELECT * FROM Slaves';
  pool.execute(sql, (err, results) => {
    if (err) {
      console.error('Error fetching SlavesList:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.delete('/deleteSlave/:logical_address', (req, res) => {
  const { logical_address } = req.params;
  const sql = 'DELETE FROM Slaves WHERE logical_address = ?';
  pool.execute(sql, [logical_address], (err, results) => {
    if (err) {
      console.error('Error deleting slave:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Slave deleted successfully', results });
  });
});
app.get('/CO2', (req, res) => {
  const sql = 'SELECT signal_value FROM Signal_slave WHERE address_ip in (40388,40523,40568)';

  pool.execute(sql,(err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.delete('/deleteSignal/:Address_ip', (req, res) => {
  const { Address_ip } = req.params; 
  const sql = 'DELETE FROM Signals WHERE Address_ip = ?';
  pool.execute(sql, [Address_ip], (err, results) => {
    if (err) {
      console.error('Error deleting Signal:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Signal deleted successfully', results });
  });
});

app.get('/SignalList', (req, res) => {
  const sql = 'SELECT signal_name ,Address_ip ,Unity ,Quantity ,Slave_name, gain, type_data FROM Signals';

  pool.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});









const { exec } = require('child_process');
// cron.schedule('* * * * * *', () => {
//   exec(`python alarms.py ${databaseName}`, (error, stdout, stderr) => {
//       if (error) {
//           console.error(`Error executing Python script: ${error}`);
//           return;
//       }
//       // console.log(`Python script output: ${stdout}`);
//       // console.error(`Python script errors: ${stderr}`);
//   });
// });
// cron.schedule('* * * * * *', () => {
//   exec(`python main.py ${databaseName}`, (error, stdout, stderr) => {
//       if (error) {
//           console.error(`Error executing Python script: ${error}`);
//           return;
//       }
//       console.log(databaseName);
//       console.log(`Python script output: ${stdout}`);
//       console.error(`Python script errors: ${stderr}`);
//   });
// });

// Define the task
const task = () => {
  // console.log('Running scheduled task...');

  // Query to fetch signal values
  const fetchSignalValuesQuery = `
    SELECT signal_value
    FROM signal_slave
    WHERE address_ip IN (32278, 32280, 32341, 32357, 32349, 32284)
  `;

  // Query to insert data into performance_data_SL
  const insertPerformanceDataQuery = `
    INSERT INTO performance_data_SL (
      Active_power, Reactive_power, Total_active_electricity,
      Total_positive_active_electricity, Total_negative_active_electricity,
       Power_factor
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Fetch signal values
  pool.query(fetchSignalValuesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching signal values:', err);
      return;
    }

    // Assuming you have logic to transform fetched data into performance_data_SL format
    // Here, just inserting the same values for demonstration purposes
    const signalValues = results.map(row => row.signal_value);

    // Ensure you have appropriate values for each column (here using example values)
    const insertData = [
      ...signalValues, // Replace with actual values
      0, 0, 0 // Replace these with actual calculations or defaults
    ];

    // Insert data into performance_data_SL
    pool.query(insertPerformanceDataQuery, insertData, (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return;
      }
      // console.log('Data inserted successfully:', results);
    });
  });
};

// Schedule the task to run every minute
// cron.schedule('* * * * *', task);

app.get('/api/active-power', (req, res) => {
  const query = 'SELECT temps, Active_power FROM performance_data_SL ORDER BY temps ASC';
  pool.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});