const request = require('supertest');
const app = require('../app');

describe('api test', () => {
  let cookie;
  test('create_game responds gameID & sesssion', async () => {
    const response = await request(app)
      .get('/api/create_game')
      .expect(200)
      .expect('Content-Type', /json/);
    const cookies = response.headers['set-cookie'][0].split(',').map((item) => item.split(';')[0]);
    cookie = cookies.join(';');
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('gameID');
  });

  test('getgrid responds to 400 without session coockie', async () => {
    const response = await request(app).get('/api/getgrid').expect(400);
  });

  test('getgrid api responds to grid json', async () => {
    const response = await request(app)
      .get('/api/getgrid')
      .set('Cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('lastRow');
    expect(response.body).toHaveProperty('lastColumn');
    expect(response.body).toHaveProperty('fleet');
    expect(response.body).toHaveProperty('area');
  });

  test('setship responds to 400 without session coockie', async () => {
    const response = await request(app)
      .post('/api/setship')
      .set('Accept', 'application/json')
      .send({ shipIndex: 0, location: { row: 2, col: 0 }, direction: 'h' })
      .expect(400);
  });

  test('setship api responds grid json if success to setup ship', async () => {
    const response = await request(app)
      .post('/api/setship')
      .set('Cookie', cookie)
      .send({ shipIndex: 0, location: { row: 2, col: 0 }, direction: 'h' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('lastRow');
    expect(response.body).toHaveProperty('lastColumn');
    expect(response.body).toHaveProperty('fleet');
    expect(response.body).toHaveProperty('area');
  });

  test('setship api responds 400 & err:... if ships overlaped', async () => {
    const response = await request(app)
      .post('/api/setship')
      .set('Cookie', cookie)
      .send({ shipIndex: 1, location: { row: 0, col: 3 }, direction: 'v' })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('err');
  });
});
