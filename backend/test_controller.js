// const axios = require('axios');

async function testApi() {
  try {
    // Attempt to login as admin (assuming credentials from previous turns or common ones)
    // If I don't know the password, I'll try to find a user in the DB.
    // For now, I'll just try to use a mock token if I had one, 
    // but better yet, I'll run a local script that calls the controller function directly with a mock req/res.
    
    const db = require('./models');
    const postController = require('./controllers/post.controller');
    
    // Mock req and res
    const req = {
      query: { page: 1, limit: 10, search: '', status: '' },
      user: { id: 1, Role: { role_name: 'ADMIN' } } // Assuming admin for now
    };
    
    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.data = data;
        console.log('Response Code:', this.statusCode || 200);
        console.log('Response Data:', JSON.stringify(data, null, 2));
      }
    };
    
    await postController.getMyPosts(req, res);
    process.exit(0);
  } catch (err) {
    console.error('Crash detected:');
    console.error(err);
    process.exit(1);
  }
}

testApi();
