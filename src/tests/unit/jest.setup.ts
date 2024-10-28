import db from '../../database'; 
import server from '../../app';          

beforeAll(async () => {
    await db.connect(); 
});

afterEach(() => {
    jest.clearAllMocks(); 
});

afterAll(async () => {
    await db.close(); 
});
