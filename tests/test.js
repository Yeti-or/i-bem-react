var expect = require('chai').expect;

var React = require('react');
var BEM = require('..');

var ReactComponent = require('./component.js');

BEM.register('component', ReactComponent);

describe('simple', () => {

    var component;

    beforeEach(() => {
        component = new BEM({block: 'component'});
    });

    it('should getMod', () => {
        expect(component.getMod('hovered')).to.eql('');
    });

    it('shoule hasMod', () => {
        expect(component.hasMod('hovered')).to.be.false;
    });

    it('should setMod', () => {
        component.setMod('hovered');
        expect(component.hasMod('hovered')).to.be.true;
    });

});
