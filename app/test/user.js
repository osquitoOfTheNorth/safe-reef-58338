
let chai = require("chai");
let chaiHttp = require('chai-http');
let server = require("../../server");
var request = require("request");
let should = chai.should();
var secureHeader;
chai.use(chaiHttp);
let user = {
  "name" :"Tom Tester",
  "email": "test@test.com",
  "password": "password123IShouldGetABetterPassword",
  "paypalinfo": "paypaluser@test.com"
}

let user2 = {
  "name" :"Tim Tester",
  "email": "1@2.com",
  "password": "a",
  "paypalinfo": "paypaluser2222@test.com"
}



let user3 = {
  "_id" : "FlimFlam",
  "name" :"Tim Tom",
  "email": "t@2.com",
  "password": "1",
  "paypalinfo": "a@test.com"
}


let user4 = {
  "name" :"Tim Tom",
  "password": "1",
  "paypalinfo": "a@test.com"
}


let user5 = {
  "name" :"",
  "email": "",
  "password": "",
  "paypalinfo": "a@test.com"
}


let user6 = {
  "_id" : "FlimFlam",
  "name" :"Lord Voldemort",
  "email": "tom.marvolo.riddle@gmail.com",
  "password": "purebloodedwizardsonly111",
  "paypalinfo": ""
}

function postUser(callDone, usertoInsert){
  chai.request(server)
      .post('/api/v1/user')
      .set('Authorization', 'Bearer ' + secureHeader)
      .query({"user" : usertoInsert})
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.should.have.property('status');
        res.body.should.have.property('success').eql(true);
        callDone();
      });
}

function deleteAll(callDone){
  chai.request(server)
      .delete("/api/v1/user")
      .query({"_id": "All"})
      .set('Authorization', 'Bearer ' + secureHeader)
      .end((err,res) => {
        callDone();
      });
}

describe("Users", () => {
  before((done) => {
    var options = { method: 'POST',
    url: 'https://safereef.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"E7lHEXLm6Q438xG1OQHPGOt0ch6jx1Rh","client_secret":"jKmqL9lvjiXrs0WCGgOJ-oibsEW0f28AaA2ubQeqZNppd-dG0z84GDX94_oL6QY2","audience":"https://project-safe-reef/","grant_type":"client_credentials"}' };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      temp = JSON.parse(body);
      secureHeader = temp["access_token"];
      deleteAll(done);
    });
  });
  describe("Attempt to make an unauthorized request" , () => {
     it("should post a new user to database", (done) => {
       chai.request(server)
           .post('/api/v1/user')
           .query({"user" : user4})
           .end((err,res) => {
               err.status.should.eql(401)
               err.response.body.should.have.property("message").eql("Missing or invalid token")
               done();
           });
       });
   });

  describe("/POST new User, missing required inputs" , () => {
    it("should post a new user to database", (done) => {
      chai.request(server)
          .post('/api/v1/user')
          .set('Authorization', 'Bearer ' + secureHeader)
          .query({"user" : user4})
          .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('status');
            res.body.should.have.property('success').eql(false);
            res.body.should.have.property('error_message').eql("Document failed validation. Failed with error code: 121");
            chai.request(server)
                .post('/api/v1/user')
                .set('Authorization', 'Bearer ' + secureHeader)
                .query({"user" : user5})
                .end((err,res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('success');
                  res.body.should.have.property('status');
                  res.body.should.have.property('success').eql(false);
                  res.body.should.have.property('error_message').eql("Document failed validation. Failed with error code: 121");
                  done();
                });
          });

      });
  });



  describe("/POST new User" , () => {
    it("should post a new user to database", (done) => {
      postUser(function(){ done(); }, user);
    });
  });

  describe("/GET users based on keywords, no user matching query" , () => {
    before((done) =>{
      deleteAll(function () {
          postUser(function(){}, user2);
          postUser(function(){ done(); }, user);
      });
    });
    it("should return a new user from the database", (done) => {
      chai.request(server)
          .get("/api/v1/user")
          .set('Authorization', 'Bearer ' + secureHeader)
          .query({"searchString" : "\"ffffffff\""})
          .end((err,res) => {
            var response = JSON.parse(res.body);
            chai.assert(Array.isArray(response), "Oooops bad response!");
            chai.assert(response.length == 0, "Incorrect Filtering Of User");
            res.should.have.status(200);
            done();
          });
      });
    });

  describe("/GET users based on keywords" , () => {
    before((done) =>{
      deleteAll(function () {
          postUser(function(){}, user2);
          postUser(function(){ done(); }, user);
      });
    });
    it("should return a new user from the database", (done) => {
      chai.request(server)
          .get("/api/v1/user")
          .set('Authorization', 'Bearer ' + secureHeader)
          .query({"searchString" : "\"Tim Tester\" 1@2.com"})
          .end((err,res) => {
            var response = JSON.parse(res.body);
            chai.assert(Array.isArray(response), "Oooops bad response!");
            chai.assert(response.length == 1, "Incorrect Filtering Of User");
            chai.assert(response[0].name == "Tim Tester", "Incorrect Filtering of User");
            res.should.have.status(200);
            done();
          });
      });
    });

  describe("/DELETE user from database with id", () => {
    before(("insert test user prior to deleting"), (done) => {
      deleteAll(function(){  postUser(() => {done();}, user3); });
    });
    it("should delete user from database and return success", (done) => {
      chai.request(server)
          .delete("/api/v1/user")
          .set("Authorization", 'Bearer ' + secureHeader)
          .query({"_id" : "FlimFlam"})
          .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('status');
            res.body.should.have.property('success').eql(true);
            chai.request(server)
              .get("/api/v1/user")
              .set('Authorization', 'Bearer ' + secureHeader)
              .query({"searchString" : "\"Tim Tom\""})
              .end((err,res) => {
                var response = JSON.parse(res.body);
                chai.assert(Array.isArray(response), "Oooops bad response!");
                chai.assert(response.length == 0, "Incorrect Deletion Of User By Id");
                done();
              })
          });
    });
  });

  describe("Attempt to post existing user to database with a minor update", () => {
    before(("insert test user to modify later"), (done) => {
      postUser(() => {done();}, user3);
    });
    it("should successfully update user3 ", (done) => {
        chai.request(server)
            .post("/api/v1/user/FlimFlam")
            .set('Authorization', 'Bearer ' + secureHeader)
            .query(user6)
            .end((err,res) => {
              var responseParsed = JSON.parse(res.body);
              responseParsed.should.be.a("object");
              responseParsed.should.have.property("_id").eql("FlimFlam");
              responseParsed.should.have.property("name").eql("Lord Voldemort");
              responseParsed.should.have.property("email").eql("tom.marvolo.riddle@gmail.com");
              responseParsed.should.have.property("password").eql("purebloodedwizardsonly111");
              responseParsed.should.have.property("paypalinfo").eql("");
              done();
            });
        });
    });


    describe("Attempt to post existing user to database with a minor update, should fail due to update not meeting db table constraints", () => {
      before(("insert test user to modify later"), (done) => {
        deleteAll( () => {postUser(() => {done();}, user3); });
      });
      it("should successfully update user3 ", (done) => {
          user6.password = null;
          chai.request(server)
              .post("/api/v1/user/FlimFlam")
              .set('Authorization', 'Bearer ' + secureHeader)
              .query(user6)
              .end((err,res) => {
                res.body.should.be.a("object");
                res.body.should.have.property("error_message").eql('Could not successfully update user with Id: FlimFlam')
                res.body.should.have.property("success").eql(false)
                done();
              });
          });
  });
  describe("Attempt to /DELETE user from database with id, user doesnt exist", () => {
    before(("insert test user prior to deleting"), (done) => {
      deleteAll( () => {postUser(() => {done();}, user3); });
    });
    it("should delete user from database and return success", (done) => {
      chai.request(server)
          .delete("/api/v1/user")
          .set("Authorization", 'Bearer ' + secureHeader)
          .query({"_id" : "TestId"})
          .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('status');
            res.body.should.have.property('success').eql(false);
            res.body.should.have.property('error_message');
            res.body.should.have.property('error_message').eql("No such user found");
            done();
          });
    });
  });
  describe("Attempt to post existing user to database with a minor update, user does not exist in database", () => {
    before(("insert test user to modify later"), (done) => {
      deleteAll( () => {done();});
    });
    it("should fail to update user3 since user3 does not exist", (done) => {
        user6.password = null;
        chai.request(server)
            .post("/api/v1/user/FlimFlam")
            .set('Authorization', 'Bearer ' + secureHeader)
            .query(user6)
            .end((err,res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("error_message").eql('Could not successfully update user with Id: FlimFlam')
              res.body.should.have.property("success").eql(false)
              done();
            });
        });
  });


  describe("Attempt to /DELETE user from database malformed input", () => {
    before(("insert test user prior to deleting"), (done) => {
      postUser(() => {done();}, user);
    });
    it("should delete user from database and return success", (done) => {
      chai.request(server)
          .delete("/api/v1/user")
          .set("Authorization", 'Bearer ' + secureHeader)
          .end((err,res) => {
            res.body.should.have.property("error_message").eql("Invalid method parameters")
            chai.request(server)
                .delete("/api/v1/user")
                .set("Authorization", 'Bearer ' + secureHeader)
                .query({"" : ""})
                .end((err,res) => {
                  res.body.should.have.property("error_message").eql("Invalid method parameters")
                  done();
                })
          });
      });
    });
});
