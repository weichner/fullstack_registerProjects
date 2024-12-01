import { dataSource } from './data-source';

const dropDatabase = async () => {
  try {
    await dataSource.initialize();
    console.log('Connected to database');

    // Remove all tables
    await dataSource.dropDatabase();
    console.log('Database removed successfully');

    await dataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.log(error, 'Error connecting to database');
  }
};

dropDatabase();
