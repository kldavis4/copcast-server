var request = require('supertest'),
  should = require('should'),
  app = require('express')(),
  proxyquire = require('proxyquire'),
  auth = require('./../mocks/auth'),
  db = require('./../../lib/db'),
  rest = proxyquire('./../../lib/heartbeats', {'./../auth': auth, './../db': db}),
  bodyParser = require('body-parser'),
  config = require('./../../lib/config'),
  factory = require('./../setup');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(rest);

auth.scope = 'client'; //set mock user scope
app.set('sockets', {connected : {}, }); //mock sockets

describe('Heartbeats Tests', function() {
  beforeEach(function (done) {
    config.signatureVerification = false;

    db.sequelize.sync({force: true}).then(function (err) {
      factory.create('testUser', function (err, u) {
        if (err) {
          console.log(err);
          done();
        } else {
          auth.user = u;  //set mock user
          done();
        }
      });
    });
  });

  describe('create heartbeat',function(){
    it('sends socket to same group',function(done){
      //TODO
      done();
    });

    it('creates battery state',function(done){
//TODO
      done();
    });

    it('sends socket to different admin group',function(done){
//TODO
      done();
    });

    it('do not send socket to different group non admin',function(done){
//TODO
      done();
    });

    it('sends valid hearbeat request',function(done) {
      request(app).post('/heartbeats')
        .send({"state": {},
               "location": {"lat":72.1, "lng": 42.1, "date": "2016-08-19T23:11:15.123Z"},
               "battery": {"batteryHealth":100, "batteryPercentage": 100.0, "temperature": 97, "status": 100, "plugged": 1, "date": "2016-08-19T23:11:15.123Z"}})
        .expect(201)
        .end(function (err, res) {
          should.not.exist(err);
          done();
        });
    });

    it('will upload one malicious json in location', function (done) {
      request(app).post('/heartbeats')
        .send({"state": {},
               "location": {"lat":72.1, "lng": {"$iLike": "%"}, "date": "2016-08-19T23:11:15.123Z"},
               "battery": {"batteryHealth":100, "batteryPercentage": 100.0, "temperature": 97, "status": 100, "plugged": 1, "date": "2016-08-19T23:11:15.123Z"}})
        .expect(400)
        .end(function (err, res) { should.not.exist(err); done(); });
    });

    it('will upload one malicious json in battery', function (done) {
      request(app).post('/heartbeats')
        .send({"state": {},
               "location": {"lat":72.1, "lng": 42.1, "date": "2016-08-19T23:11:15.123Z"},
               "battery": {"batteryHealth": {"$iLike": "%"}, "batteryPercentage": 100.0, "temperature": 97, "status": 100, "plugged": 1, "date": "2016-08-19T23:11:15.123Z"}})
        .expect(400)
        .end(function (err, res) { should.not.exist(err); done(); });
    });
  });

});
