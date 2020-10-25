import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';

chai.use(chatHttp);
const { expect } = chai;

describe('Testing the template endpoints:', () => {
  it('It should create a template', (done) => {
    const template = {
      templateTypeId: 1,
      content: 'test',
      name: 'test',
      description: 'description test',
    };
    chai.request(app)
      .post('/api/v1/templates')
      .set('Accept', 'application/json')
      .send(template)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.include({
          id: 1,
          description: template.description
        });
        done();
      });
  });

  it('It should not create a template with incomplete parameters', (done) => {
    const template = {
      description: ''
    };
    chai.request(app)
      .post('/api/v1/templates')
      .set('Accept', 'application/json')
      .send(template)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('It should get all templates', (done) => {
    chai.request(app)
      .get('/api/v1/templates')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data[0].should.have.property('id');
        done();
      });
  });

  it('It should get a particular template', (done) => {
    const templateId = 1;
    chai.request(app)
      .get(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.have.property('id');
        done();
      });
  });

  it('It should not get a particular template with invalid id', (done) => {
    const templateId = 8888;
    chai.request(app)
      .get(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message').eql(`Cannot find template with the id ${templateId}`);
        done();
      });
  });

  it('It should not get a particular template with non-numeric id', (done) => {
    const templateId = 'aaa';
    chai.request(app)
      .get(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message').eql('Please input a valid numeric value');
        done();
      });
  });

  it('It should update a template', (done) => {
    const templateId = 1;
    const updatedTemplate = {
      templateTypeId: 1,
      content: 'test update',
      name: 'test update',
      description: 'description test update',
    };
    chai.request(app)
      .put(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .send(updatedTemplate)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.id).equal(updatedTemplate.id);
        expect(res.body.data.value).equal(updatedTemplate.value);
        done();
      });
  });

  it('It should not update a template with invalid id', (done) => {
    const templateId = '9999';
    const updatedTemplate = {
      templateTypeId: 1,
      content: 'test update',
      name: 'test update',
      description: 'description test update',
    };
    chai.request(app)
      .put(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .send(updatedTemplate)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message').eql(`Cannot find template with the id: ${templateId}`);
        done();
      });
  });

  it('It should not update a template with non-numeric id value', (done) => {
    const templateId = 'ggg';
    const updatedTemplate = {
      templateTypeId: 1,
      content: 'test update',
      name: 'test update',
      description: 'description test update',
    };
    chai.request(app)
      .put(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .send(updatedTemplate)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message').eql('Please input a valid numeric value');
        done();
      });
  });


  it('It should delete a template', (done) => {
    const templateId = 1;
    chai.request(app)
      .delete(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({});
        done();
      });
  });

  it('It should not delete a template with invalid id', (done) => {
    const templateId = 777;
    chai.request(app)
      .delete(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message').eql(`Template with the id ${templateId} cannot be found`);
        done();
      });
  });

  it('It should not delete a template with non-numeric id', (done) => {
    const templateId = 'bbb';
    chai.request(app)
      .delete(`/api/v1/templates/${templateId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message').eql('Please provide a numeric value');
        done();
      });
  });
});
