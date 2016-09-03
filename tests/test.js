var expect = require('chai').expect;

var React = require('react');
var BEM = require('..');

describe('i-bem', () => {

xdescribe('decl', function() {

    afterEach(function() {
        delete BEM.blocks.block;
    });

    it('should return block', function() {
        var block = BEM.decl('block', {});
        expect(block).to.eql(BEM.blocks.block);
    });

    // TODO: 0.3 compatibility
    xit('should allow inheritance', function() {
        var block = BEM.decl('block', {}),
            Block2 = block.decl('block2', {});

        (new Block2()).should.be.instanceOf(block);
        (new Block2()).should.be.instanceOf(Block2);

        delete BEM.blocks.block2;
    });

    it('should allow inheritance', function() {
        var block = BEM.decl('block', {}),
            Block2 = BEM.decl({block: 'block2', baseBlock: 'block'});

        expect(new Block2() instanceof block).to.eql(true);

        delete BEM.blocks.block2;
    });

    // TODO: 0.3 compatibility
    xit('should allow inheritance from itself', function() {
        var block = BEM.decl('block', {}),
            block2 = block.decl({});

        block2.should.be.equal(block);
    });

    it('should allow inheritance from itself', function() {
        var block = BEM.decl('block', {}),
            block2 = BEM.decl('block', {});

        expect(block2).to.eql(block);
    });

    // TODO: 0.3 compatibility
    xit('should allow to define only modName and modVal', function() {
        var block = BEM.decl('block', {}),
            block2 = block.decl({modName: 'm1', modVal: 'v1'}, {});

        block2.should.be.equal(block);
        block2.getName().should.be.equal('block');
    });

    it('should allow to define modName and modVal', function() {
        var block = BEM.decl('block', {}),
            block2 = BEM.decl({block: 'block', modName: 'm1', modVal: 'v1'}, {});

        expect(block2).to.eql(block);
        expect(block2.getName()).to.eql('block');
    });

    // TODO: 0.3 compatibility
    xit('should allow use block class as baseBlock', function() {
        var block = BEM.decl('block', {}),
            Block2 = block.decl({block: 'block2', baseBlock: block}, {});

        (new Block2()).should.be.instanceOf(block);
        (new Block2()).should.be.instanceOf(Block2);

        delete BEM.blocks.block2;
    });

    it('should apply method only if block has mod', function() {
        var baseMethodSpy = jasmine.createSpy('spy'),
            modsMethodSpy = jasmine.createSpy('spy');

        BEM.decl('block', {
            method: baseMethodSpy
        });
        BEM.decl({block: 'block', modName: 'mod1', modVal: 'val1'}, {
            method: modsMethodSpy
        });

        var instance = BEM.create({block: 'block', mods: {mod1: 'val1'}});

        instance.method();

        expect(baseMethodSpy.calls.any()).to.eql(false);
        expect(modsMethodSpy.calls.any()).to.eql(true);

        instance.setMod('mod1', 'val2');
        instance.method();

        expect(baseMethodSpy.calls.any()).to.eql(true);
        expect(modsMethodSpy.calls.count()).to.eql(1);
    });

    // TODO: 0.3 compatibility
    xit('should apply method only if block has boolean mod', function() {
        var baseMethodSpy = jasmine.createSpy('spy'),
            modsMethodSpy = jasmine.createSpy('spy');

        BEM.decl('block', {
            method: baseMethodSpy
        });

        BEM.decl({block: 'block', modName: 'mod1', modVal: true}, {
            method: modsMethodSpy
        });

        var instance = BEM.create({block: 'block', mods: {mod1: true}});

        instance.method();
        expect(baseMethodSpy.calls.count()).to.eql(0);
        expect(modsMethodSpy).toHaveBeenCalled();

        instance.delMod('mod1');
        instance.method();
        expect(baseMethodSpy).toHaveBeenCalled();
        expect(modsMethodSpy).toHaveBeenCalled();
    });
});

describe('create', function() {
    it('should return instance of block', function() {
        var block = BEM.decl('block', {}),
            instance = BEM.create('block');

        expect(instance instanceof block).to.be.true;
        delete BEM.blocks.block;
    });
});

describe('mods', () => {

    var block;

    beforeEach(function() {
        BEM.decl('block', {});
        block = BEM.create({block: 'block', mods: {mod1: 'val1', mod2: true, mod3: false}});
    });

    afterEach(function() {
        delete BEM.blocks.block;
    });

    describe('getMods', function() {
        it('should return specified mods', function() {
            expect(block.getMods('mod1', 'mod2', 'mod3')).to.eql({mod1: 'val1', mod2: true, mod3: false});
        });
    });

    describe('getMod', function() {
        it('should not drop cache ISL-2432', function() {
            block.getMods();
            expect(block.getMod('mod1')).to.eql('val1');
        });

        it('should return current mod\'s value', function() {
            expect(block.getMod('mod1')).to.eql('val1');
        });

        // TODO: 0.3 compatibility
        xit('should return current boolean mod\'s value', function() {
            expect(block.getMod('mod2')).to.be.true;
            expect(block.getMod('mod3')).to.eql('');
        });

        it('should return \'\' for undefined mod', function() {
            expect(block.getMod('mod4')).to.eql('');
        });
    });

    describe('setMod', function() {
        it('should update mod value', function() {
            block.setMod('mod1', 'val2');
            expect(block.getMod('mod1')).to.eql('val2');
        });

        // TODO: 0.3 compatibility
        xit('should update boolean mod value', function() {
            block
                .setMod('mod1', true)
                .getMod('mod1').should.be.true;

            expect(block.setMod('mod1', true).getMod('mod1')).to.eql(true);

            block
                .setMod('mod1', false)
                .getMod('mod1').should.be.equal('');

            expect(block.setMod('mod1', false).getMod('mod1')).to.eql(false);

            block
                .setMod('mod1')
                .getMod('mod1').should.be.true;

            expect(block.setMod('mod1').getMod('mod1')).to.eql(true);
        });

        // TODO: 0.3 compatibility
        xit('should cast non-boolean mod value to string', function() {
            block.setMod('mod1', 1);
            expect(block.getMod('mod1')).to.eql('1');
        });
    });

    describe('delMod', function() {
        it('should set mod\'s value to \'\'', function() {
           expect(block.delMod('mod1').getMod('mod1')).to.eql('');
        });
    });

    describe('hasMod', function() {
        it('should return true for matching mod\'s value', function() {
            expect(block.hasMod('mod1', 'val1')).to.eql(true);
        });

        it('should return false for non-matching mod\'s value', function() {
            expect(block.hasMod('mod1', 'val2')).to.eql(false);
        });

        it('should return false for undefined mod\'s value', function() {
            expect(block.hasMod('mod2', 'val2')).to.eql(false);
        });

        it('in short form should return true for non-empty mod\'s value', function() {
            expect(block.hasMod('mod1')).to.eql(true);
        });

        it('in short form should return true for empty mod\'s value', function() {
            expect(block.setMod('mod1', '').hasMod('mod1')).to.eql(false);
        });

        // TODO: 0.3 compatibility
        xit('should treat defined non-boolean mod value as a string', function() {
            expect(block.setMod('mod1', 1).hasMod('mod1', 1)).to.eql(true);
            expect(block.hasMod('mod1', '1')).to.eql(true);
            expect(block.setMod('mod1', '2').hasMod('mod1', 2)).to.eql(true);
        });

        it('in short form should return true for undefined mod', function() {
            expect(block.hasMod('mod4')).to.eql(false);
        });

        // TODO: 0.3 compatibility
        xit('should return true for matching boolean mod\'s value', function() {
            expect(block.setMod('mod1', true).hasMod('mod1')).to.eql(true, 'setMod().hasMod() return true');
            expect(block.hasMod('mod1', true)).to.eql(true, 'hasMod return true');
        });
    });

    describe('toggleMod', function() {
        it('should switch mod\'s values', function() {
            expect(block.toggleMod('mod1', 'val1', 'val2').hasMod('mod1', 'val2')).to.eql(true);
            expect(block.toggleMod('mod1', 'val1', 'val2').hasMod('mod1', 'val1')).to.eql(true);
        });

        it('should switch mod\'s value if "modVal2" param omited', function() {
            expect(block.toggleMod('mod1', 'val1').hasMod('mod1')).to.eql(false, 'should return false');
            expect(block.toggleMod('mod1', 'val1').hasMod('mod1')).to.eql(true, 'should return true');
        });

        it('should switch boolean mod\'s value', function() {
            expect(block.toggleMod('mod2').hasMod('mod2')).to.eql(true);
        });

        it('should switch mod\'s values according to "condition" param', function() {
            expect(block.toggleMod('mod1', 'val1', 'val2', true).hasMod('mod1', 'val1'))
                .to.eql(true, 'should set value "val1", toggleMod true');

            expect(block.toggleMod('mod1', 'val1', 'val2', false).hasMod('mod1', 'val2'))
                .to.eql(true, 'should set value "val2", toggleMod false');
        });

        it('should switch mod\'s value according to "condition" param if "modVal2" param omited', function() {
            expect(block.toggleMod('mod1', 'val1', true).hasMod('mod1', 'val1')).to.eql(true, 'should return true');
            expect(block.toggleMod('mod1', 'val1', false).hasMod('mod1')).to.eql(false, 'should return false');
        });
    });

});

xdescribe('onSetMod', function() {
    afterEach(function() {
        delete BEM.blocks.block;
    });

    it('should call properly matched callbacks by order', function() {
        var order = [],
            spyMod1Val2 = jasmine.createSpy('spy'),
            spyMod2Val1 = jasmine.createSpy('spy'),
            spyMod2Val2 = jasmine.createSpy('spy');

        BEM.decl('block', {
            onSetMod: {
                mod1: {
                    val1: function() {
                        order.push(5);
                    }
                }
            }
        });

        BEM.decl('block', {
            onSetMod: {
                mod1: function() {
                    order.push(3);
                },

                '*': function(modName) {
                    modName === 'mod1' && order.push(1);
                }
            }
        });

        BEM.decl('block', {
            onSetMod: function(modName) {
                this.__base.apply(this, arguments);
                modName === 'mod1' && order.push(2);
            }
        });

        BEM.decl('block', {
            onSetMod: {
               mod1: {
                   '*': function() {
                       this.__base.apply(this, arguments);
                       order.push(4);
                   },
                   val1: function() {
                        this.__base.apply(this, arguments);
                       order.push(6);
                   },
                   val2: spyMod1Val2
               },
               mod2: {
                   val1: spyMod2Val1,
                   val2: spyMod2Val2
               }
            }
        });

        var block = BEM.create({block: 'block', mods: {mod1: 'val0', mod2: 'val0'}});
        block.setMod('mod1', 'val1');

        expect(order).toEqual([1, 2, 3, 4, 5, 6]);

        expect(spyMod1Val2).not.toHaveBeenCalled();
        expect(spyMod2Val1).not.toHaveBeenCalled();
        expect(spyMod2Val2).not.toHaveBeenCalled();
    });

    it('should call callbacks before set mod', function(done) {
        BEM.decl('block', {
            onSetMod: {
               mod1: {
                   val1: function() {
                        expect(this.hasMod('mod1', 'val1')).toBe(false);
                        done();
                   }
               }
            }
        });
        var block = BEM.create({block: 'block', mods: {mod1: 'val0'}});
        block.setMod('mod1', 'val1');
    });

    it('should set mod after callbacks', function() {
         BEM.decl('block', {
            onSetMod: {
               mod1: {
                   val1: function() {}
               }
            }
        });
        var block = BEM.create({block: 'block', mods: {mod1: 'val0'}});
        block.setMod('mod1', 'val1');

        expect(block.hasMod('mod1', 'val1')).toBe(true);
    });

    it('shouldn\'t set mod when callback returns false', function() {
        BEM.decl('block', {
            onSetMod: {
               mod1: {
                   val1: function() {
                       return false;
                   }
               }
            }
        });
        var block = BEM.create({block: 'block', mods: {mod1: 'val0'}});
        block.setMod('mod1', 'val1');

        expect(block.hasMod('mod1', 'val1')).toBe(false);
    });
});

xdescribe('declMix', function() {
    it('should declare mixins', function() {
        BEM.declMix('t-mix', {prop: 42});

        expect(BEM.blocks['t-mix'].prototype.prop).toBe(42, 'свойство должно присутствовать в прототипе');
        expect(BEM.blocks['t-mix'] instanceof BEM).toBe(false, 'миксины не наследуются от i-bem');

        delete BEM.blocks['t-mix'];
    });

    it('should create blocks with mixins', function() {
        BEM.declMix('t-mix', {prop: 42}, {staticProp: 'fortyTwo'});
        BEM.decl({block: 't-block', baseMix: ['t-mix']});

        var block = BEM.create('t-block');
        expect(block.prop).toBe(42, 'свойства из миксов должны доезжать в блок');
        expect(block.__self.staticProp).toBe('fortyTwo', 'статич. свойства из миксов должны доезжать в блок');

        delete BEM.blocks['t-mix'];
        delete BEM.blocks['t-block'];
    });

    it('should inherit properties from mixins', function() {
        BEM.declMix('t-mix', {fortyTwo: 42, sevenEleven: 711}, {mixinStaticProp: 'mixin'});
        BEM.declMix('t-mix2', {sevenEleven: '7x11'});
        BEM.decl({block: 't-base'}, {sevenEleven: '7 11', fortyTwo: 43});
        BEM.decl({block: 't-block', baseBlock: 't-base', baseMix: ['t-mix', 't-mix2']}, {
            sevenEleven: '7.11'
        }, {
            mixinStaticProp: 'overridenStatic'
        });

        var block = BEM.create('t-block');
        expect(block.fortyTwo).toBe(42, 'миксы должен переопределять базовый класс');
        expect(block.sevenEleven).toBe('7.11', 'блок должен переопределять миксы');
        expect(block.__self.mixinStaticProp).toBe('overridenStatic', 'класс блока должен переопределять миксы');

        delete BEM.blocks['t-mix'];
        delete BEM.blocks['t-mix2'];
        delete BEM.blocks['t-base'];
        delete BEM.blocks['t-block'];
    });

    it('should inherit properties from mixins', function() {
        BEM.declMix('t-mix', {
            onSetMod: function() {
                this.__base();
                this.__self.res = '1';
            }
        });
        BEM.declMix('t-mix2', {
            onSetMod: function() {
                this.__base();
                this.__self.res += '2';
            }
        });
        BEM.decl({block: 't-block', baseMix: ['t-mix', 't-mix2']}, {
            onSetMod: function() {
                this.__base();
                this.__self.res += '3';
            }
        });
        BEM.decl({block: 't-block', modName: 'yes', modVal: 'no'}, {
            onSetMod: function() {
                this.__base();
                this.__self.res += '4';
            }
        });

        BEM.create({block: 't-block', mods: {yes: 'no'}});
        expect(BEM.blocks['t-mix'].res).toBe(undefined, 'микс не должен мутировать');
        expect(BEM.blocks['t-mix2'].res).toBe(undefined, 'микс2 не должен мутировать');
        expect(BEM.blocks['t-block'].res).toBe('1234', 'класс блока должен переопределять миксы');

        delete BEM.blocks['t-mix'];
        delete BEM.blocks['t-mix2'];
        delete BEM.blocks['t-block'];
    });
});

describe('afterCurrentEvent', function() {
    var block;
    beforeEach(function() {
        BEM.decl('block', {});
        block = BEM.create({block: 'block', mods: {mod1: 'val1'}});
    });
    afterEach(function() {
        delete BEM.blocks.block;
    });

    it('should call callback asynchronously', function(done) {
        var isAsync = false;
        block.afterCurrentEvent(function() {
            expect(isAsync).to.eql(true);
            done();
        });
        isAsync = true;
    });

    it('should call callback with block\'s context', function(done) {
        block.afterCurrentEvent(function() {
            expect(this).to.eql(block);
            done();
        });
    });

    // TODO: 0.3 compatibility
    xit('should not call callback if block destructed', function(done) {
        var spy = jasmine.createSpy('spy');
        block.afterCurrentEvent(spy);
        block.destruct();

        setTimeout(function() {
            expect(spy).not.toHaveBeenCalled();
            done();
        }, 0);
    });
});

});
