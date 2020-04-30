const supertest = require("supertest");
const chai = require("chai");
const app = require("../app-mocha.js");

const expect = chai.expect;
const request = supertest(app.listen());

/*
	describe()描述的是一个测试套件
	嵌套在describe()的it()是对接口进行自动化测试的测试用例
	一个describe()可以包含多个it()
*/

// 测试套件/组
describe("开始测试demo的GET请求", () => {

	// 测试用例
	it("测试/getString.json请求", (done) => {
		request
			.get("/getString.json")
			.expect(200)
			.end((err, res) => {
				// 断言判断结果是否为object类型
				expect(res.body).to.be.an('object')
				expect(res.body.success).to.be.an('boolean')
				expect(res.body.data).to.be.an('string')
				done()
			})
	})

	it('测试/getNumber.json请求', ( done ) => {
      request
        .get('/getNumber.json')
        .expect(200)
        .end(( err, res ) => {
          expect(res.body).to.be.an('object')
          expect(res.body.success).to.be.an('boolean')
          expect(res.body.data).to.be.an('number')
          done()
        })
  })
})

describe( '开始测试demo的POST请求', ( ) => {
  it('测试/postData.json请求', ( done ) => {
      request
        .post('/postData.json')
        .expect(200)
        .end(( err, res ) => {
          expect(res.body).to.be.an('object')
          expect(res.body.success).to.be.an('boolean')
          expect(res.body.data).to.be.an('string')
          done()
        })
  })
})