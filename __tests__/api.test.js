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



describe('GET - /api/articles/:article_id', () => {
  test('GET - when given a valid parametric, will return status 200- ', () => {
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


describe("8. GET /api/articles?topic", () => {
    test("200: returns an array of all articles with correct comment count (sorted by date descending as default) when passed no queries", async () => {
      const res = await request(app)
      .get("/api/articles").expect(200);
      expect(res.body.articles.length).toBe(12);
      expect(res.body.articles).toBeSortedBy("created_at", {
        descending: true,
      });
      res.body.articles.forEach((article) => {
        expect(Object.keys(article)).toEqual([
          "article_id",
          "title",
          "topic",
          "author",
          "body",
          "created_at",
          "votes",
          "comment_count"
        ]);
      });
    });
    test('200: returns array filtered by topic when given a topic query', async () => {
      const res = await request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
      expect(res.body.articles.length).toBe(11);
      expect(res.body.articles).toBeSortedBy('created_at', { descending: true });
  });
  
  test('404: returns empty array when given topic query that does not exist', async () => {
    const res = await request(app)
      .get("/api/articles?topic=BIGMANHARRY")
        .expect(404);
        expect(res.body.msg).toEqual("Articles not found");
  
  });
  
  });


  describe('9. GET /api/articles/:article_id/comments', () => {
    test("200: returns comments for article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(res.body).toBeSortedBy("created_at", {
            descending: true,
          });
          res.body.forEach((comment) => {
            expect(Object.keys(comment)).toEqual([
              "comment_id",
              "body",
              "article_id",
              "author",
              "votes",
              "created_at"
            ]);
          });
        });
        });

    test("404: returns msg for article with no comments", () => {
      return request(app)
        .get("/api/articles/22/comments")
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ msg: "Articles not found" });
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

 