const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

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



describe('GET - /api/articles/:article_id', () => {
  test('GET - when given a valid ID, will return status 200 along with respective article. ', () => {
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
  test("404: show user that URL is invalid", () => {
    return request(app)
      .get("/api/BigManTing")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid URL");
      });
  });
});
test('invalid ID datatype provided for getArticleById', () => {
  return request(app)
    .get('/api/articles/SELECTA!')
    .expect(400)
    .then((res) => {
      expect(res.body).toEqual({ msg: 'Invalid id type!' });
    });
});
test("status:404, responds with a 404 error when passed a article id which does not exist in the database.", () => {
  return request(app)
    .get("/api/articles/111")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toEqual("Article with this ID not found.");
    });
});


describe("6. PATCH /api/articles/:article_id", () => {
  test("responds with status 200 and spcific article is updated with correct vote count", () => {
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
            votes: 50
          })
        );
      });
  });
  
});





describe('9. GET /api/articles/:article_id/comments', () => {
      test("200: returns comments for article", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments.length).toEqual(11);
            expect(res.body.comments).toBeInstanceOf(Array);
            res.body.comments.forEach((comment) => {
              expect(comment.article_id).toEqual(1);
            });
          });
      });
      test("200: returns msg for article with no comments", () => {
        return request(app)
          .get("/api/articles/22/comments")
          .expect(200)
          .then((res) => {
            expect(res.body).toEqual({ comments: "No comments available for this article!" });
          });

      });
      test("400: returns msg Invalid id type! for invalid id", () => {
        return request(app)
          .get("/api/articles/dd/comments")
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({ msg: 'Invalid id type!' });
          });

      });
    });