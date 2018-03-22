const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);


describe('movies', () => {
  it('should list all movies on /movies GET', done => {
    chai.request(server)
        .get('/movies')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
  });
});
