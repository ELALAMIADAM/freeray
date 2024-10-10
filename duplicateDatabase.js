const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function duplicateDatabase(originalDatabase, newDatabase) {
    try {
        // Dump the original database
        await execPromise(`mysqldump -u root -p RAJAWIalami@2002 ${originalDatabase} > ${originalDatabase}.sql`);

        // Create the new database
        await execPromise(`mysql -u root -p RAJAWIalami@2002 -e "CREATE DATABASE ${newDatabase}"`);

        // Import into the new database
        await execPromise(`mysql -u root -p RAJAWIalami@2002 ${newDatabase} < ${originalDatabase}.sql`);

        console.log(`Database ${originalDatabase} duplicated to ${newDatabase} successfully.`);
    } catch (error) {
        console.error('Error duplicating database:', error);
    }
}

// Replace username, password with your MySQL credentials
const originalDatabase = 'ip';
const newDatabase = 'your_new_database_name';

duplicateDatabase(originalDatabase, newDatabase);
