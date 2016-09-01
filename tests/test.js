var expect = require('chai').expect;

var React = require('react');
var BEM = require('..');

var ReactComponent = require('./component.js');

describe('i-bem-react', () => {

describe('create', function() {
    it('should return instance of block', function() {
        var block = BEM.decl('block', {}),
            instance = BEM.create('block');

        expect(instance instanceof block).to.be.true;
        delete BEM.blocks.block;
    });
});

describe('mods', () => {

    var component;

    beforeEach(() => {
        BEM.register('component', ReactComponent);
        component = new BEM({block: 'component'});
    });

    afterEach(() => {
        BEM.unregister('component');
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

});
