var expect = require('chai').expect;

var React = require('react');
var BEM = require('..');

var ReactComponent = require('./component.js');

BEM.registerComponent('component', ReactComponent);

it('should', () => {
    expect('true').to.eql('true');
});
