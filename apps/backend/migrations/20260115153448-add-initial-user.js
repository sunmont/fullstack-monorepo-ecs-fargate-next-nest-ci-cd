const bcrypt = require('bcrypt');

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    const saltRounds = 10;
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.collection('users').insertOne({
      email: 'testuser@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('users').deleteOne({ email: 'testuser@example.com' });
  }
};
