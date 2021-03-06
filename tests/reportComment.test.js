import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import status from '../src/helpers/constants/status.codes';
import getToken from '../src/helpers/tests/signup';

const { expect } = chai;
chai.use(chaiHttp);
const userToken = getToken();
const slug = 'How-to-create-sequalize-seeds';
const commentId = 4;
describe('testing the report comment controller', () => {
  it('should be able to report the comment', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${slug}/comments/${commentId}/report`)
      .set('Authorization', userToken)
      .send({
        commentReason: 2
      })
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(status.CREATED);
        expect(res.body)
          .to.have.property('message')
          .eql('Reported Successfully');
        done();
      });
  });

  it('should not be able to report the comment with unexisting reason', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${slug}/comments/${commentId}/report`)
      .set('Authorization', userToken)
      .send({
        commentReason: 20
      })
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(status.NOT_FOUND);
        expect(res.body.errors)
          .to.have.property('Message')
          .eql('Sorry, but that reason does not exist, Thanks');
        done();
      });
  });

  it('should not be able to report the comment twice with same reason', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${slug}/comments/${commentId}/report`)
      .set('Authorization', userToken)
      .send({
        commentReason: 2
      })
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(status.BAD_REQUEST);
        expect(res.body.errors)
          .to.have.property('Message')
          .eql('Sorry, You can not report this comment twice with the same comment reason, Thanks ');
        done();
      });
  });
});
