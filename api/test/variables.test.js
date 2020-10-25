import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';

chai.use(chatHttp);
const { expect } = chai;

describe('Testing the variable endpoints:', () => {
  it('It should create a variable', (done) => {
    const variable = {
      name: 'var1',
      type: 2,
      value: '[{"name":"col1","value":"col1"},{"name":"col2","value":"col2"},{"name":"col3","value":"col3"}]',
      description: ''
    };
    chai.request(app)
      .post('/api/v1/variables')
      .set('Accept', 'application/json')
      .send(variable)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.include({
          id: 1,
          description: variable.description
        });
        done();
      });
  });

  it('It should not create a variable with incomplete parameters', (done) => {
    const variable = {
      description: ''
    };
    chai.request(app)
      .post('/api/v1/variables')
      .set('Accept', 'application/json')
      .send(variable)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('It should get all variables', (done) => {
    chai.request(app)
      .get('/api/v1/variables')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data[0].should.have.property('id');
        done();
      });
  });

  it('It should get a particular variable', (done) => {
    const variableId = 1;
    chai.request(app)
      .get(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.have.property('id');
        done();
      });
  });

  it('It should not get a particular variable with invalid id', (done) => {
    const variableId = 8888;
    chai.request(app)
      .get(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message').eql(`Cannot find variable with the id ${variableId}`);
        done();
      });
  });

  it('It should not get a particular variable with non-numeric id', (done) => {
    const variableId = 'aaa';
    chai.request(app)
      .get(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message').eql('Please input a valid numeric value');
        done();
      });
  });

  it('It should update a variable', (done) => {
    const variableId = 1;
    const updatedVariable = {
      name: 'var2',
      value: '[{"name":"col1","value":"col1"},{"name":"col2","value":"col2"},{"name":"col3","value":"col3"}]',
      description: ''
    };
    chai.request(app)
      .put(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .send(updatedVariable)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.id).equal(updatedVariable.id);
        expect(res.body.data.value).equal(updatedVariable.value);
        done();
      });
  });

  it('It should not update a variable with invalid id', (done) => {
    const variableId = '9999';
    const updatedVariable = {
      name: 'var2',
      value: '[{"name":"col1","value":"col1"},{"name":"col2","value":"col2"},{"name":"col3","value":"col3"}]',
      description: ''
    };
    chai.request(app)
      .put(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .send(updatedVariable)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message').eql(`Cannot find variable with the id: ${variableId}`);
        done();
      });
  });

  it('It should not update a variable with non-numeric id value', (done) => {
    const variableId = 'ggg';
    const updatedVariable = {
      name: 'var2',
      value: '[{"name":"col1","value":"col1"},{"name":"col2","value":"col2"},{"name":"col3","value":"col3"}]',
      description: ''
    };
    chai.request(app)
      .put(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .send(updatedVariable)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message').eql('Please input a valid numeric value');
        done();
      });
  });


  it('It should delete a variable', (done) => {
    const variableId = 1;
    chai.request(app)
      .delete(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({});
        done();
      });
  });

  it('It should not delete a variable with invalid id', (done) => {
    const variableId = 777;
    chai.request(app)
      .delete(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message').eql(`Variable with the id ${variableId} cannot be found`);
        done();
      });
  });

  it('It should not delete a variable with non-numeric id', (done) => {
    const variableId = 'bbb';
    chai.request(app)
      .delete(`/api/v1/variables/${variableId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message').eql('Please provide a numeric value');
        done();
      });
  });
});
