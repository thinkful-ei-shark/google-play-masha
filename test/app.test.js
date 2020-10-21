const supertest = require('supertest');
const app = require('../app');
const expect = require('chai').expect;

describe('GET /apps endpoint', () => {
  it('incorrect parameter', () => {
    return supertest(app)
      .get('/apps')
      .query({foo:'bar'})
      .expect(400)
  })
})