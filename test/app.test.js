const supertest = require('supertest');
const app = require('../app');
const expect = require('chai').expect;

function expectAppObj(obj) {
  return expect(obj).to.include.all.keys('App', 'Category', 'Rating');
}

describe('GET /apps endpoint', () => {
  it('incorrect parameter', () => {
    return supertest(app)
      .get('/apps')
      .query({foo:'bar'})
      .expect(400);
  });
  it('no params expect 200 and json list of games', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).to.be.an('array');
        expectAppObj(res.body[0]);
      });
  });
});