const supertest = require("supertest");
const app = require("../app");
const expect = require("chai").expect;

function expectAppObj(obj) {
  return expect(obj).to.include.all.keys("App", "Category", "Rating");
}

describe("GET /apps endpoint", () => {
  it("incorrect parameter", () => {
    return supertest(app).get("/apps").query({ foo: "bar" }).expect(400);
  });
  it("no params expect 200 and json list of games", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expectAppObj(res.body[0]);
      });
  });
  describe("sorting functions", () => {
    it("expect 400 incorrect value", () => {
      return supertest(app).get("/apps").query({ sort: "foo" }).expect(400);
    });
    ["Rating", "App"].forEach((term) => {
      it(`expect list sorted by ${term}`, () => {
        return supertest(app)
          .get("/apps")
          .query({ sort: term })
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an("array");
            expectAppObj(res.body[0]);
            let ordered = true;
            let i = 0;
            while (ordered && i < res.body.length - 1) {
              ordered = res.body[i][term] >= res.body[i + 1][term];
              i++;
            }
            expect(ordered).to.be.true;
          });
      });
    });
  });
  describe("filtering functions", () => {
    it("expect 400 incorrect value", () => {
      return supertest(app).get("/apps").query({ genres: "bar" }).expect(400);
    });
  
    ["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].forEach(
      (term) => {
        it(`expect list filtered by ${term}`, () => {
          return supertest(app)
            .get("/apps")
            .query({ genres: term })
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an("array");
              expectAppObj(res.body[0]);
              let filtered = true;
              let i = 0;
              while (filtered && i < res.body.length) {
                filtered = res.body[i].Genres.includes(term);
                i++;
              }
              expect(filtered).to.be.true;
            });
        });
      }
    );
  });

  describe("sorting and filtering", () => {
    it("expect list to be filtered by Action and sorted by Rating", () => {
      return supertest(app)
        .get("/apps")
        .query({ genres: "Action", sort: "Rating" })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an("array");
          expectAppObj(res.body[0]);
          let filtered = true;
          let i = 0;
          while (filtered && i < res.body.length) {
            filtered = res.body[i].Genres.includes('Action');
            i++;
          }
          expect(filtered).to.be.true;
          let ordered = true;
          i = 0;
          while (ordered && i < res.body.length - 1) {
            ordered = res.body[i]['Rating'] >= res.body[i + 1]['Rating'];
            i++;
          }
          expect(ordered).to.be.true;
        });
    });
  });
});
