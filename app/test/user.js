
let chai = require("chai");
let chaiHttp = require('chai-http');
let server = require("../../server");
var request = require("request");
let should = chai.should();
var secureHeader;
chai.use(chaiHttp);



describe("Users", () => {
  // beforeEach((done) => {
  //
  //
  //   var options = { method: 'POST',
  //   url: 'https://safereef.auth0.com/oauth/token',
  //   headers: { 'content-type': 'application/json' },
  //   body: '{"client_id":"E7lHEXLm6Q438xG1OQHPGOt0ch6jx1Rh","client_secret":"jKmqL9lvjiXrs0WCGgOJ-oibsEW0f28AaA2ubQeqZNppd-dG0z84GDX94_oL6QY2","audience":"https://project-safe-reef/","grant_type":"client_credentials"}' };
  //
  //   request(options, function (error, response, body) {
  //     if (error) throw new Error(error);
  //     temp = JSON.parse(body);
  //     secureHeader = temp["access-token"];
  //   });
  // });
  describe("/GET users based on keywords" , () => {
    it("should return a new user from the database", (done) => {
      chai.request(server)
          .get("/api/v1/user")
          .send("")
          .end((err,res) => {
            res.should.have.status(200);
            done();
          });
    });
  });
  describe("/POST new User" , () => {
    it("should post a new user to database", (done) => {
      let user = {
        "name" :"Tom Tester",
        "email": "test@test.com",
        "password": "password123IShouldGetABetterPassword",
        "paypalinfo": "paypaluser@test.com"
      }
      chai.request(server)
          //.set('Authorization', 'Bearer ' + secureHeader)
          .post('/api/v1/user')
          .query({"user" : user})
          .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('status');
            res.body.should.have.property('success').eql(true);
            done();
          });
        });
      });
    });
