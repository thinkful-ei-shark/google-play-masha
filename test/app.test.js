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
      .query({ foo: 'bar' })
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
  describe('sorting functions', () => {
    it('expect 400 incorrect value', () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: 'foo' })
        .expect(400);
    });
    ['Rating', 'App'].forEach(term => {
      it(`expect list sorted by ${term}`, () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: term })
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
            expectAppObj(res.body[0]);
            let ordered = true;
            let i = 0;
            while (ordered, i < res.body.length - 1) {
              ordered = res.body[i][term] >= res.body[i + 1][term];
              i++;
            }
            expect(ordered).to.be.true;
          });
      });
    });


  });
  describe('filtering functions', () => {
    
  });
  describe('sorting and filtering', () => { });
});