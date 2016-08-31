var expect = require('chai').expect;

var React = require('react');
var BEM = require('..');

var ReactComponent = require('./component.js').default;

BEM.registerComponent('component', ReactComponent);

describe('simple', () => {

    var component;

    beforeEach(() => {
        debugger
        component = new BEM({block: 'component'});
    });

    it('should', () => {
        expect('true').to.eql('true');
    });

    it('should getMod', () => {
        expect(component.hasMod('hovered')).to.be.false;
    });

    it('should getMod', () => {
        component.setMod('hovered');
        expect(component.hasMod('hovered')).to.be.true;
    });

});
