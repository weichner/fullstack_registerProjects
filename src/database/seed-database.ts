import { dataSource } from './data-source';

const run = async () => {
  try {
    await dataSource.initialize();
    console.log('Connected to database');
    await dataSource.destroy();
    console.log('Database created');
  } catch (error) {
    console.error(error, 'Error connecting to database');
    //await dataSource.destroy();
  }
};

run();
