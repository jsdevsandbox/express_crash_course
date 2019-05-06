var request = require("supertest");
var app = require("../../index");
//var request = require("supertest").agent(app.listen());
const members = require("../../Members");
var chai = require("chai");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
//var should = chai.should(); // Using Should style
const uuid = require("uuid");

const mockedMembers = [
  {
    id: 1,
    name: "john doe",
    email: "john@gmail.com",
    status: "active"
  },
  {
    id: 2,
    name: "bob williams",
    email: "bob@gmail.com",
    status: "inactive"
  },
  {
    id: 3,
    name: "shannon jackson",
    email: "shannon@gmail.com",
    status: "active"
  },
  {
    id: 4,
    name: "jake smith",
    email: "jake@gmail.com",
    status: "active"
  }
];

describe("API Tests for GET /", () => {
  it("should return 200 with html content", done => {
    request(app)
      .get("/")
      .expect(200)
      .expect(/Member App/, done);
  });
});

describe("API Tests for GET /api/members/:id", done => {
  it("should return 200 when valid id", done => {
    request(app)
      .get("/api/members/2")
      .expect(
        200,
        [
          {
            id: 2,
            name: "bob williams",
            email: "bob@gmail.com",
            status: "inactive"
          }
        ],
        done
      );
  });

  it("should return 400 when invalid member id", done => {
    request(app)
      .get("/api/members/25")
      .expect(400, done);
  });
});

describe("API Tests for POST /api/members/", done => {
  it("should create new member", done => {
    request(app)
      .post("/api/members/")
      .send({
        name: "jake smith",
        email: "jake@gmail.com"
      })
      .set("Accept", "application/json")
      .expect(function(res) {
        res.body[3].id = 4;
        //console.log(res.body[3]);
      })
      .expect(200, mockedMembers, done);
  });

  it("should return 400 when no name is provided", done => {
    request(app)
      .post("/api/members/")
      .send({
        email: "jake@gmail.com"
      })
      .set("Accept", "application/json")
      .expect(400, done);
  });

  it("should return 400 when no email is provided", done => {
    request(app)
      .post("/api/members/")
      .send({
        name: "jake smith"
      })
      .set("Accept", "application/json")
      .expect(400, done);
  });
});

describe("API Tests for PUT /api/members/", done => {
  expectedResponse = {
    msg: "Member updated ",
    member: {
      id: 1,
      name: "jake middlename doe",
      email: "john@yahoo.com",
      status: "active"
    }
  };
  it("should update existing member", done => {
    request(app)
      .put("/api/members/1")
      .send({
        name: "jake middlename doe",
        email: "john@yahoo.com"
      })
      .set("Accept", "application/json")
      .expect(200, expectedResponse, done);
  });

  it("should return 400 for invalid member id", done => {
    request(app)
      .put("/api/members/25")
      .send({
        name: "jake middlename doe",
        email: "john@yahoo.com"
      })
      .set("Accept", "application/json")
      .expect(400, done);
  });
});

describe("API Tests for DELETE /api/members/", () => {
  it("should delete member", () => {
    return request(app)
      .delete("/api/members/1")
      .expect(200)
      .then(res => {
        //console.log(res.text);
        expect(res.text).to.not.contain("john doe");
      });
  });

  it("should throw 400 for invalid member id", done => {
    request(app)
      .delete("/api/members/25")
      .expect(400, done);
  });
});
