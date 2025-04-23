import { MongoMemoryServer } from 'mongodb-memory-server';
import initAdmin from '../utils/initAdmin.js';

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  
  console.log('🚀 Temporary MongoDB server started at:', mongod.getUri());
  
  await initAdmin();
  
  // Keep server running for testing
  // await mongod.stop(); // Uncomment to auto-close

  // Automated cleanup
  process.on('SIGINT', async () => {
    await mongod.stop();
    process.exit(0);
  });
})();
