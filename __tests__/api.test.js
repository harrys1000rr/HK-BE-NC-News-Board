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
  test.only("200 returns the specified article with updated vote count", () => {
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
  test("404, returns 404 error when passed a article id which does not exist in the database.", () => {
    return request(app)
      .get("/api/articles/111")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Articles not found");
      });
  })
  
  test('404: returns empty array when given topic query that does not exist', async () => {
    const res = await request(app)
      .get("/api/articles?topic=BIGMANHARRY")
        .expect(404);
        expect(res.body.msg).toEqual("Articles not found");
  
  });
  
  });

  describe("11. GET /api/articles (queries) orderby/sortby", () => {
    test.only("status:200, returns all articles as an array of article objects with the required properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
          const {allArticles: articles} = body;
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test.only("status:200, can query db to sort results by a field", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({body}) => {
            const {allArticles: articles} = body;
            expect(articles).toBeSortedBy("votes", {descending: true});
          });
      });

      test.only("status:200, can set sort order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=desc")
          .expect(200)
          .then(({body}) => {
            const {allArticles: articles} = body;
            expect(articles).toBeSortedBy("votes", {descending: true});
          });
      });

      test.only("status:200, can filter by topic name", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({body}) => {
            const {allArticles: articles} = body;
            expect(articles.every((article) => article.topic === "mitch")).toBe(
              true
            );
          });
      });

      test.only("status:200, can sort, set sort order, and filter by topic name", () => {
        return request(app)
          .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
          .expect(200)
          .then(({body}) => {
            const {allArticles: articles} = body;
            expect(articles).toBeSortedBy("votes", {ascending: true});
            expect(articles.every((article) => article.topic === "mitch")).toBe(
              true
            );
          });
      });
    });

    test.only("status:200, returns [] if filter topic has no articles associated", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
          expect(body.allArticles).toEqual([]);
        });
    });

      test.only("status:400, sorting by a non-existent column", () => {
        return request(app)
          .get("/api/articles?sort_by=loudest_voice")
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Invalid column sort query");
          });
      });

      test.only("status:400, ordered by something other than ASC / DESC", () => {
        return request(app)
          .get("/api/articles?topic=mitch&sort_by=votes&order=random")
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Invalid sort order");
          });
      });

      test.only("status:404, filter by non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=operationButterfly")
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe("Topic does not exist");
          });
      });
    
  
  test('400: returns 400 when invalid article_id datatype provided', () => {
    return request(app)
      .get('/api/articles/SELECTA!')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ msg: 'Invalid id type!' });
      });
  });

});
  




