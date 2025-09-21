const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'contacts.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Contacts table ready');
    }
  });
}

const dbHelpers = {
  getContacts: (page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      db.get('SELECT COUNT(*) as total FROM contacts', (err, countResult) => {
        if (err) {
          reject(err);
          return;
        }

        db.all(
          'SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?',
          [limit, offset],
          (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                contacts: rows,
                total: countResult.total,
                page,
                limit,
                totalPages: Math.ceil(countResult.total / limit)
              });
            }
          }
        );
      });
    });
  },

  addContact: (contactData) => {
    return new Promise((resolve, reject) => {
      const { name, email, phone } = contactData;
      
      db.run(
        'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)',
        [name, email, phone],
        function(err) {
          if (err) {
            reject(err);
          } else {
            db.get(
              'SELECT * FROM contacts WHERE id = ?',
              [this.lastID],
              (err, row) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(row);
                }
              }
            );
          }
        }
      );
    });
  },

  deleteContact: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
};

module.exports = { db, dbHelpers };