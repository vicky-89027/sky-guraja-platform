import app from './app';
import { seedDatabase } from './db/seeds';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    console.log('Initializing Sri Krishna Yadav Youth Guraja backend system...');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`SRI KRISHNA YADAV YOUTH GURAJA (SKY) BACKEND RUNNING`);
      console.log(`API URL: http://localhost:${PORT}`);
      console.log(`Health:  http://localhost:${PORT}/api/health`);
      console.log(`Public:  http://localhost:${PORT}/api/public/transparency`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

bootstrap();
