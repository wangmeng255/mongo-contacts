//global.DATABASE_URL = 'mongodb://localhost/contacts-test';
global.DATABASE_URL = 'mongodb://admin:admin@ds139985.mlab.com:39985/mongo_data';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({firstName: 'bright', lastName: 'horizons', phoneNumber: ['(310) 445-8993'], Address: ['2114 Pontius Avenue Los Angeles, CA 90025']},
                        {firstName: 'century', lastName: 'city', phoneNumber: ['(310) 557-1447'], Address: ['Beverly Hills, 90210, Los Angeles, CA']}, 
                        function() {
                done();
            });
        });
    });
    
    var first_id = '';
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(2);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('firstName');
                res.body[0].should.have.property('lastName');
                res.body[0].should.have.property('phoneNumber');
                res.body[0].should.have.property('Address');
                res.body[0]._id.should.be.a('string');
                first_id = res.body[0]._id;
                res.body[0].firstName.should.be.a('string');
                res.body[0].lastName.should.be.a('string');
                res.body[0].phoneNumber.should.be.a('array');
                res.body[0].Address.should.be.a('array');
                res.body[0].firstName.should.equal('bright');
                res.body[1].firstName.should.equal('century');
                res.body[0].lastName.should.equal('horizons');
                res.body[1].lastName.should.equal('city');
                res.body[0].phoneNumber[0].should.equal('(310) 445-8993');
                res.body[1].phoneNumber[0].should.equal('(310) 557-1447');
                res.body[0].Address[0].should.equal('2114 Pontius Avenue Los Angeles, CA 90025');
                res.body[1].Address[0].should.equal('Beverly Hills, 90210, Los Angeles, CA');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .set('contentType', 'application/json')
            .send({firstName: 'chalk', lastName: 'preschools', 
            phoneNumber: ['(310) 446-5400', '(310) 827-7300'], 
            Address: ['2028 Westwood Blvd, Los Angeles, CA 90025', '2201 Lincoln Blvd, Venice, CA 90291']})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('_id');
                res.body.should.have.property('phoneNumber');
                res.body.should.have.property('Address');
                res.body._id.should.be.a('string');
                res.body.firstName.should.equal('chalk');
                res.body.lastName.should.equal('preschools');
                res.body.phoneNumber[0].should.equal('(310) 446-5400');
                res.body.phoneNumber[1].should.equal('(310) 827-7300');
                res.body.Address[0].should.equal('2028 Westwood Blvd, Los Angeles, CA 90025');
                res.body.Address[1].should.equal('2201 Lincoln Blvd, Venice, CA 90291');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/' + first_id)
            .set('contentType', 'application/json')
            .send({_id: first_id, firstName: 'Samuel', lastName: 'Goldwyn', phoneNumber: ['(310) 445-8993'], Address: ['2114 Pontius Avenue Los Angeles, CA 90025']})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/' + first_id)
            .set('contentType', 'application/json')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body._id.should.be.a('string');
                done();
            });
    });
    it('POST without body data', function(done) {
        chai.request(app)
        .post('/items')
            .set('contentType', 'application/json')
            .send({})
            .end(function(err, res) {
                res.should.have.status(500);
                done();
            });
    });
    it('POST with something other than valid JSON', function(done) {
        chai.request(app)
            .post('/items')
            .send('I am not a json')
            .end(function(err, res) {
                res.should.have.status(500);
                done();
            });
    });
    it('PUT without an ID in the endpoint', function(done) {
        chai.request(app)
            .put('/items/')
            .set('contentType', 'application/json')
            .send({_id: first_id, firstName: 'Samuel', lastName: 'Goldwyn', phoneNumber: ['(310) 445-8993'], Address: ['2114 Pontius Avenue Los Angeles, CA 90025']})
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });
    it('PUT with different ID in the endpoint than the body', function(done) {
        chai.request(app)
            .put('/items/0')
            .set('contentType', 'application/json')
            .send({_id: first_id, firstName: 'Samuel', lastName: 'Goldwyn', phoneNumber: ['(310) 445-8993'], Address: ['2114 Pontius Avenue Los Angeles, CA 90025']})
            .end(function(err, res) {
                res.should.have.status(500);
                done();
            });
    });
    it('PUT to an ID that doesnt exist', function(done) {
        chai.request(app)
            .put('/items/5')
            .set('contentType', 'application/json')
            .send({_id: first_id + 'ggggg', firstName: 'Samuel', lastName: 'Goldwyn', phoneNumber: ['(310) 445-8993'], Address: ['2114 Pontius Avenue Los Angeles, CA 90025']})
            .end(function(err, res) {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
    it('PUT without body data', function(done) {
        chai.request(app)
            .put('/items/0')
            .set('contentType', 'application/json')
            .end(function(err, res) {
                res.should.have.status(500);
                done();
            });
    });
    it('PUT with something other than valid JSON', function(done) {
        chai.request(app)
            .put('/items/0')
            .set('contentType', 'application/json')
            .send('I am not a json')
            .end(function(err, res) {
                res.should.have.status(500);
                done();
            });
    });
    it('DELETE an ID that doesnt exist', function(done) {
        chai.request(app)
            .delete('/items/0')
            .set('contentType', 'application/json')
            .end(function(err, res) {
                res.should.have.status(500);
                done();
            });
    });
    it('DELETE without an ID in the endpoint', function(done) {
        chai.request(app)
            .delete('/items/')
            .set('contentType', 'application/json')
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});