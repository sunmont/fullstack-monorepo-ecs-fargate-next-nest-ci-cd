// Create database and collections
db = db.getSiblingDB('fullstack');

// Create collections
db.createCollection('users');
db.createCollection('posts');
db.createCollection('comments');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ 'profile.name': 'text', email: 'text' });

db.posts.createIndex({ status: 1, publishedAt: -1 });
db.posts.createIndex({ author: 1, createdAt: -1 });
db.posts.createIndex({ tags: 1 });
db.posts.createIndex({ title: 'text', content: 'text', excerpt: 'text' });

db.comments.createIndex({ post: 1, createdAt: -1 });
db.comments.createIndex({ author: 1 });
db.comments.createIndex({ parentComment: 1 });

// Insert test data
const testUser = {
    email: 'admin@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password: Password123!
    name: 'Admin User',
    role: 'admin',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

db.users.insertOne(testUser);

print('✅ MongoDB initialized successfully!');