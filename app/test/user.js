
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
        callDone()
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
      chai.request(server)
          .delete("/api/v1/user")
          .end((err,res) => {
            chai.request(server)
                .delete("/api/v1/user")
                .set('Authorization', 'Bearer ' + secureHeader)
                .end((err,res) => {
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

  describe("/GET users based on keywords" , () => {
    before((done) =>{
          postUser(function(){}, user2);
          postUser(function(){ done(); }, user);
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
});
