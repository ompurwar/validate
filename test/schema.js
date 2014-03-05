var Schema = require('../lib/schema');
var Property = require('../lib/property');

describe('Schema', function () {
  describe('when given an object', function () {
    it('should create properties', function () {
      var schema = new Schema({ name: { type: 'string' }});
      schema.props.should.have.property('name');
    })
  })
  
  describe('.path()', function () {
    describe('when given a path and an object', function () {
      it('should create properties', function () {
        var schema = new Schema();
        schema.path('name', { type: 'string' });
        schema.props.should.have.property('name');
      })
      
      it('should support nested properties', function () {
        var schema = new Schema();
        schema.path('name', { first: { type: 'string' }});
        schema.props.should.have.property('name.first');
      })
      
      it('should register validators', function () {
        var schema = new Schema();
        schema.path('name', { first: { required: true }});
        schema.validate({}).should.have.length(1);
      })
      
      it('should return a Property', function () {
        var schema = new Schema();
        schema.path('name', { type: 'string' })
          .should.be.instanceOf(Property)
          .and.have.property('name', 'name');
      })
    })
  })
  
  describe('.validate()', function () {
    it('should return an array of error messages', function () {
      var schema = new Schema({ name: { type: 'string' }});
      var res = schema.validate({ name: 123 });
      res.should.be.an.Array.and.have.length(1);
    })
    
    it('should delete all keys not in the schema', function () {
      var obj = { name: 'name', age: 23 };
      var schema = new Schema({ name: { type: 'string' }});
      var res = schema.validate(obj);
      obj.should.not.have.property('age');
      obj.should.have.property('name', 'name');
    });
    
    describe('with strip disabled', function () {
      it('should not delete any keys', function () {
        var obj = { name: 'name', age: 23 };
        var schema = new Schema({ name: { type: 'string' }});
        var res = schema.validate(obj, { strip: false });
        obj.should.have.property('age', 23);
      });
    });
    
    describe('with typecasting enabled', function () {
      it('should typecast before validation', function () {
        var schema = new Schema({ name: { type: 'string' }});
        var res = schema.validate({ name: 123 }, { typecast: true });
        res.should.have.length(0);
      });
    });
  });
  
  describe('.assert()', function () {
    it('should throw if validation fails', function () {
      var schema = new Schema({ name: { type: 'string' }});
      (function () {
        schema.assert({ name: 123 });
      }).should.throw(/failed/);
    })
  });
})