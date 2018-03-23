'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const mongoose = require('mongoose');

const db = require('../connect');
const Movie = require('../models/movie');
const mockMovie = require('./mock-data/movie.json');

chai.use(chaiHttp);

describe('movies', () => {
    beforeEach(done => {
        Movie.remove({}, err => {
          if (err) console.error(err);
        });
        done();
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
            Movie.create(mockMovie, err => {
                if (err) console.error(err);
            });

            chai.request(server)
            .get('/movies')
            .end((err, res) => {
                res.body.movies.length.should.not.be.equal(0);

                let parsedRes = JSON.parse(JSON.stringify(res.body.movies[0], (key, value) => {
                    return (key === '_id' | key === '__v') ? undefined : value;
                }));

                let persistedData = Object.assign({}, mockMovie);
                delete persistedData.Response;
                
                parsedRes.should.be.eql(persistedData);
                done();
            });
        });
    });

    describe('On /movies POST', () => {

        it ('returns ok status', done => {
            chai.request(server)
            .post('/movies')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it ('returns json', done => {
            chai.request(server)
            .post('/movies')
            .end((err, res) => {
                res.should.be.json;
                done();
            });
        });

        it ('contacts external api', done => {
            chai.request(server)
            .post('/movies')
            .end((err, res) => {
                //todo
                done();
            });
        });

        it ('returns full movie object with data from external api', done => {
            chai.request(server)
            .post('/movies')
            .end((err, res) => {
                //todo
                done();
            });
        });

        it ('returns proper response if title not found in external api', done => {
            chai.request(server)
            .post('/movies')
            .end((err, res) => {
                //todo
                done();
            });
        });
    });
});
