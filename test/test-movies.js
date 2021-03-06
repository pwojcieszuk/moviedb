'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const Movie = require('../models/movie');
const mockMovieToStore = require('./mock-data/movie.json');
const mockMovieNotStored = require('./mock-data/movie2.json');
const fetchMovie = require('../data-handlers/movies-fetch-from-external');
const testUtils = require('./utils');

chai.use(chaiHttp);
chai.use(sinonChai);
chai.should();

describe('movies', () => {
    beforeEach(done => {
        Movie.remove({}, err => {
            if (err) console.error(err);
            done();
        });
    });

    describe('On /movies GET', () => {

        it ('returns ok status', done => {
            chai.request(server)
                .get('/movies')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it ('returns json', done => {
            chai.request(server)
                .get('/movies')
                .end((err, res) => {
                    res.should.be.json;
                    done();
                });
        });

        it ('returns empty list of movies if no data persisted', done => {
            chai.request(server)
                .get('/movies')
                .end((err, res) => {
                    res.body.movies.length.should.be.eql(0);
                    done();
                });
        });

        it ('returns list of movies in db if data persisted', done => {
            Movie.create(mockMovieToStore, err => {
                if (err) console.error(err);

                chai.request(server)
                    .get('/movies')
                    .end((err, res) => {
                        res.body.movies.length.should.not.be.equal(0);

                        const parsedRes = testUtils.parseMongoDoc(res.body.movies[0]);

                        const persistedData = Object.assign({}, mockMovieToStore);
                        delete persistedData.Response;
                    
                        parsedRes.should.be.eql(persistedData);
                        done();
                    });
            });
        });
    });

    describe('On /movies POST', () => {
        it ('returns 204 status if film not found', done => {
            chai.request(server)
                .post('/movies')
                .send({'Title': 'some title'})
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });

        it ('returns bad request if Title is not provided in request', done => {
            chai.request(server)
                .post('/movies')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);
                    done();
                });
        });

        it ('returns bad request if Title provided in request is not a value that can be automatically stringified', done => {
            chai.request(server)
                .post('/movies')
                .send({'Title': {'a': 'b'}})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);
                });
            chai.request(server)
                .post('/movies')
                .send({'Title': [1,2,3]})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);
                });
            done();
        });

        it ('returns full movie object from database if it is there', done => {
            Movie.create(mockMovieToStore, err => {
                if (err) console.error(err);
                
                sinon.spy(fetchMovie, 'fetch');

                chai.request(server)
                    .post('/movies')
                    .send({'Title': mockMovieToStore.Title})
                    .end((err, res) => {
                        const parsedRes = testUtils.parseMongoDoc(res.body);
                        const persistedData = Object.assign({}, mockMovieToStore);
                        delete persistedData.Response;
                    
                        parsedRes.should.be.eql(persistedData);
                        fetchMovie.fetch.should.have.not.been.called;

                        fetchMovie.fetch.restore();
                        done();
                    });
            });
        });

        it ('contacts external api if the movie is not in the database', done => {
            sinon.stub(fetchMovie, 'fetch').resolves(mockMovieNotStored);
            chai.request(server)
                .post('/movies')
                .send({'Title': 'sdsa'})
                .end(() => {
                    fetchMovie.fetch.should.have.been.calledOnce;
                    fetchMovie.fetch.restore();
                    done();
                });
        });

        it ('returns full movie object with data from external api', done => {
            sinon.spy(fetchMovie, 'fetch');
            chai.request(server)
                .post('/movies')
                .send({'Title': 'Blade Runner'})
                .end((err, res) => {
                    const parsedRes = testUtils.parseMongoDoc(res.body);

                    const obtainedData = Object.assign({}, mockMovieNotStored);
                    delete obtainedData.Response;

                    parsedRes.should.be.eql(obtainedData);
                    fetchMovie.fetch.restore();
                    done();
                });
        });

        it ('persists movie data in local database', done => {
            chai.request(server)
                .post('/movies')
                .send({'Title': 'Blade Runner'})
                .end(() => {
                    Movie.findOne({'Title': 'Blade Runner'}).exec()
                        .then(movie => {
                            movie.should.not.be.null;
                            done();
                        });
                });
        });
    });
});
