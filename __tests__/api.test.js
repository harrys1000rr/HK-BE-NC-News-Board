const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe("GET /api/topics", () => {
  test("200: should respond with a list of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toHaveLength(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});



describe("GET /api/users", () => {
  test("200: should respond with a list of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users).toHaveLength(4);
        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});


//this test includes tests for task 7 
describe('GET - /api/articles/:article_id', () => {
  test.only('GET - when given a valid parametric, will return status 200- ', () => {
    return request(app)
      .get(`/api/articles/2`)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            article_id: 2,
            title: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number)
          })
        );
      });
  });

  test('GET comment count- ', () => {
    return request(app)
      .get(`/api/articles/9`)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({ comment_count: expect.any(String) })
        );
        expect(res.body.article.comment_count).toBe('2');
      });
  });
  test("400: when invalid article_id format is used", () => {
    return request(app)
      .get("/api/articles/BigManTing")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid id type!");
      });
  });
  test("404, return 404 when valid article_id format is provided but id doesnt exist", () => {
    return request(app)
      .get("/api/articles/111")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Articles not found");
      });
  });
});
  

describe("6. PATCH /api/articles/:article_id", () => {
  test("responds with status 200 and specific article is updated", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 50 })
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            article_id: 2,
            title: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number)
          })
        );
      });
  });
  
});


  




