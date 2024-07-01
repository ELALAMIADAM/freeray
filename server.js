const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: '127.0.0.1', 
  user: 'root', 
  password: 'RAJAWIalami@2002', 
  database: 'ip' 
});

app.post('/insert_slave', (req, res) => {
  const { logical_address, slave_name,SMP } = req.body;
  if(slave_name!=='SmartLogger'){
    const insertSlaveSql = `
    INSERT INTO slaves (logical_address, slave_name, SMP)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE slave_name = VALUES(slave_name), SMP = VALUES(SMP)
  `;
  pool.execute(insertSlaveSql, [logical_address, slave_name,SMP], (err, results) => {
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

app.post('/SLP', (req, res) => {
  const { logical_address} = req.body;

  const insertSLP = `
    INSERT INTO SLP (id,logical_address)
    VALUES (1, ?)
    ON DUPLICATE KEY UPDATE logical_address = VALUES(logical_address)
  `;
  pool.execute(insertSLP, [logical_address], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Values inserted or updated successfully!' });
  });
});

app.post('/insert_signal', (req, res) => {
  const { address_ip, signal_name, unity,Quantity,slave_name,gain,type_data } = req.body;

  const insertSignalSql = `
    INSERT INTO signals (address_ip, signal_name, unity,Quantity,slave_name,gain,type_data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE signal_name = VALUES(signal_name), unity = VALUES(unity), quantity = VALUES(quantity), slave_name = VALUES(slave_name), gain = VALUES(gain), type_data=VALUES(type_data)
  `;
  pool.execute(insertSignalSql, [address_ip, signal_name, unity,Quantity,slave_name,gain,type_data], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Signal inserted or updated successfully!' });
  });
});


app.post('/insert_graph', (req, res) => {
  const { address_ip, logical_address, group_name } = req.body;

  if (!Array.isArray(address_ip) || !Array.isArray(logical_address)) {
    return res.status(400).json({ error: 'address_ip and logical_address must be arrays.' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: err.message });
      }

      // Insert or update group and get group_id
      const findOrCreateGroupSql = `
        INSERT INTO dashboard_group (group_name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE group_id = LAST_INSERT_ID(group_id)
      `;

      connection.execute(findOrCreateGroupSql, [group_name], (err, results) => {
        if (err) {
          return rollbackAndRelease(connection, res, err);
        }

        const groupId = results.insertId;

        // Insert all signals into the dashboard table
        const promises = address_ip.map((ip, index) => {
          return new Promise((resolve, reject) => {
            const insertGraphSql = `
              INSERT INTO dashboard (group_id, logical_address, address_ip)
              VALUES (?, ?, ?)
            `;
            connection.execute(insertGraphSql, [groupId, logical_address[index], ip], (err, results) => {
              if (err) {
                return reject(err);
              }
              resolve(results);
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            connection.commit(err => {
              if (err) {
                return rollbackAndRelease(connection, res, err);
              }
              connection.release();
              res.json({ message: 'Values inserted successfully!', group_id: groupId });
            });
          })
          .catch(err => {
            rollbackAndRelease(connection, res, err);
          });
      });
    });
  });
});

function rollbackAndRelease(connection, res, err) {
  connection.rollback(() => {
    connection.release();
    res.status(500).json({ error: err.message });
  });
}





app.get('/signal_slaves', (req, res) => {
  let sql = `
    SELECT * FROM signal_slave ss 
    JOIN signals s ON ss.address_ip = s.address_ip
    JOIN slaves sl ON sl.logical_address = ss.logical_address
  `;
  
  const { logical_address, address_ip } = req.query;
  const filters = [];
  const params = [];

  if (logical_address) {
    filters.push('ss.logical_address = ?');
    params.push(logical_address);
  }

  if (address_ip) {
    filters.push('ss.address_ip = ?');
    params.push(address_ip);
  }

  if (filters.length > 0) {
    sql += ' WHERE ' + filters.join(' AND ');
  }

  pool.execute(sql, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});


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

   

    res.json(Object.values(results));
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
  const sql = 'SELECT datetime, value FROM ChartData';
  pool.execute(sql, (err, results) => {
    if (err) {
      console.error('Error fetching SlavesList:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/chartDataMonth', (req, res) => {
  const sql = 'SELECT DATE(datetime) AS date, SUM(value) AS total_value FROM ChartData GROUP BY DATE(datetime)';
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
  const sql = 'SELECT signal_value FROM Signal_slave WHERE address_ip =32341 and logical_address IN (select logical_address from slaves where SMP in (select logical_address from slp))';

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


// const cron = require('node-cron');
// const { exec } = require('child_process');

// // Schedule the Python script to run every minute
// cron.schedule('* * * * * *', () => {
//     exec('python time.py', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error executing Python script: ${error}`);
//             return;
//         }
//         // console.log(`Python script output: ${stdout}`);
//         // console.error(`Python script errors: ${stderr}`);
//     });
// });


// const cron = require('node-cron');
// const { exec } = require('child_process');

// // Schedule the Python script to run every minute
// cron.schedule('* * * * * *', () => {
//     exec('python main.py', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error executing Python script: ${error}`);
//             return;
//         }
//         // console.log(`Python script output: ${stdout}`);
//         // console.error(`Python script errors: ${stderr}`);
//     });
// });
