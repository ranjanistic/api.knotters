const { expect } = require("chai");
const { agent } = require("supertest");
const app = require("../app");
const request = agent(app);

describe("API", () => {
    test(`/`, (done) => {
        request.get("/robots.txt").end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.text).to.be.a("string");
            done();
        })
    });
    test(`/robots.txt`, (done) => {
        request.get("/robots.txt").end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.text).to.be.a("string");
            done();
        })
    });
    test(`404`, (done) => {
        request.get("/robots.txt").end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.text).to.be.a("string");
            done();
        })
    });
})