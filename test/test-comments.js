'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const Comment = require('../models/comment');
const Movie = require('../models/movie');
const testUtils = require('./utils');

chai.use(chaiHttp);
chai.should();

describe('comments', () => {
    beforeEach(done => {
        Comment.find({}).remove().exec()
            .then(() => Movie.find({}).remove().exec())
            .then(() => done())
            .catch(err => {
                console.error(err);
                done();
            });
    });

    describe('On /comments GET', () => {
        const testMovies = [{'Title': 'Movie1'}, {'Title': 'Movie11'}, {'Title': 'Movie2'}];
        let persistedTestMovies;
        const testComments = [];
        
        beforeEach(done => {
            Movie.insertMany(testMovies)
                .then(movies => {
                    persistedTestMovies = [];

                    for (let movie of movies) {
                        for (let i=0; i<2; i++)
                            testComments.push({'Text': testUtils.randomStr(), 'MovieId': '' + movie._id});

                        persistedTestMovies.push(movie);
                    }

                    Comment.insertMany(testComments)
                        .then(() => done());
                })
                .catch(err => {
                    console.error(err);
                    done();
                });
        });

        it ('fetches all comments from the db', done => {
            chai.request(server)
                .get('/comments')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;

                    const  parsedRes = res.body.comments.map(testUtils.parseMongoDoc);
                    parsedRes.should.eql(testComments);
                    done();
                });
        });

        it ('allows filtering of comments by movie id', done => {
            const MovieId = testComments[0].MovieId;
            chai.request(server)
                .get('/comments')
                .query({MovieId: MovieId})
                .end((err, res) => {
                    res.should.have.status(200);
                    const  parsedRes = res.body.comments.map(testUtils.parseMongoDoc);
                    parsedRes.should.eql(testComments.filter(comment => comment.MovieId === MovieId));
                    done();
                });
        });

        it ('allows filtering of comments by movie name', done => {
            const Title = 'Movie1';
            chai.request(server)
                .get('/comments')
                .query({Title: Title})
                .end((err, res) => {
                    res.should.have.status(200);

                    const  parsedRes = res.body.comments.map(testUtils.parseMongoDoc);
                
                    const movieIds = persistedTestMovies.reduce((acc, movie) => {
                        if (movie.Title.indexOf(Title) !== -1) acc.push('' + movie._id);
                        return acc;
                    }, []);

                    const commentsForMoviesMatchingTitles = testComments.filter(comment => movieIds.indexOf(comment.MovieId) !== -1);

                    parsedRes.should.eql(commentsForMoviesMatchingTitles);
                    done();
                });
        });
    });

    describe('On /comments POST', () => {
        it ('requires MovieId or Title and Text and persists the comment in the database', done => {
            const movie = new Movie({'Title': 'Ni'});
            movie.save()
                .then(movie => {
                    movie._id = movie._id;
                    return chai.request(server).post('/comments');
                })
                .then(res => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);
                
                    return chai.request(server).post('/comments').send({'Title': 'Ni'});
                })
                .then(res => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);

                    return chai.request(server).post('/comments').send({'MovieId': movie._id});
                })
                .then(res => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);

                    return chai.request(server).post('/comments').send({'Title': 'Ni', 'MovieId': movie._id});
                })
                .then(res => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);

                    return chai.request(server).post('/comments').send({'Title': 'Ni', 'Text': 'NiNiNi'});
                })
                .then(res => {
                    res.should.have.status(200);
                    res.body.MovieId.should.equal('' + movie._id);
                    res.body.Text.should.equal('NiNiNi');
                    return chai.request(server).post('/comments').send({'MovieId': movie._id, 'Text': 'NiNiNiNi'});
                })
                .then(res => {
                    res.should.have.status(200);
                    res.body.MovieId.should.equal('' + movie._id);
                    res.body.Text.should.equal('NiNiNiNi');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });

        it ('returns 400 and error message if no movie with provided id or Title exists', done => {
            chai.request(server)
                .post('/comments')
                .send({'Title': 'Non existent Title'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.keys(['error']);
                    done();
                });
        });

        it ('returns the new comment as json', done => {
            const movie = new Movie({'Title': 'Ni'});
            movie.save()
                .then(() => {
                    return chai.request(server).post('/comments').send({'Title': 'Ni', 'Text': 'NiNiNi'});
                })
                .then(res => {
                    res.should.be.json;
                    res.body.MovieId.should.equal('' + movie._id);
                    res.body.Text.should.equal('NiNiNi');
                    done();
                });
        });

    });
});
