const { expect } = require("chai");
const { agent } = require("supertest");
const app = require("../../app");
const request = agent(app);

describe("API v1", () => {
    test(`Test v1`, (done) => {
       done()
    });
})
