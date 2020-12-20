const MarsRover = require('../src/MarsRover')
const chai = require('chai');
const sinon = require('sinon')
const assert = chai.assert

describe("MarsRover", function() {
    it("Returns correct starting co-ordinates", () => {
        const rover = new MarsRover([ 1, 2 ], 'N')
        assert.deepEqual([ 1, 2 ], rover.coordinates)
        // expect().to.deep.equal([ 1, 2 ])
    })

    it("Rover coordinates must be integer", () => {
        assert.throws(() =>new MarsRover([1.3,2], 'N'), Error, 'Co-ordinate must be an integer')
    })

    it("Rover must be facing a valid direction", () => {
        const rover = new MarsRover([1,2], 'N')
        assert.equal(rover.direction, 'N')
        assert.throws(() => new MarsRover([1,2], 'Q'), Error, 'Direction must be one of N, E, S, W')
    })

    describe('Moves in the correct direction', ()=> {
        it("Moves North", () => {
            const rover = new MarsRover([1,2], 'N')
            rover.move()
            assert.deepEqual(rover.coordinates, [1,3])
        })

        it("Moves East", () => {
            const rover = new MarsRover([1,2], 'E')
            rover.move()
            assert.deepEqual(rover.coordinates, [2,2])
        })

        it("Moves South", () => {
            const rover = new MarsRover([1,2], 'S')
            rover.move()
            assert.deepEqual(rover.coordinates, [1,1])
        })

        it("Moves West", () => {
            const rover = new MarsRover([1,2], 'W')
            rover.move()
            assert.deepEqual(rover.coordinates, [0,2])
        })

        it("Throws an error when move would result in collision", () => {
            const rover = new MarsRover([2,5], 'E', [[3, 5], [1,2]])
            assert.throws(() => rover.move(), Error, 'Unable to move. Co-ordinates result in collision')
        })
    })

    describe('Turns the correct direction', ()=> {
        describe('Turns Left', () => {
            it("When facing North", () => {
                const rover = new MarsRover([1,2], 'N')
                rover.turn('L')
                assert.equal(rover.direction, 'W')
            })
    
            it("When facing East", () => {
                const rover = new MarsRover([1,2], 'E')
                rover.turn('L')
                assert.equal(rover.direction, 'N')
            })
    
            it("When facing South", () => {
                const rover = new MarsRover([1,2], 'S')
                rover.turn('L')
                assert.equal(rover.direction, 'E')
            })
    
            it("When facing West", () => {
                const rover = new MarsRover([1,2], 'W')
                rover.turn('L')
                assert.equal(rover.direction, 'S')
            })
        })

        describe('Turns Right', () => {
            it("When facing North", () => {
                const rover = new MarsRover([1,2], 'N')
                rover.turn('R')
                assert.equal(rover.direction, 'E')
            })
    
            it("When facing East", () => {
                const rover = new MarsRover([1,2], 'E')
                rover.turn('R')
                assert.equal(rover.direction, 'S')
            })
    
            it("When facing South", () => {
                const rover = new MarsRover([1,2], 'S')
                rover.turn('R')
                assert.equal(rover.direction, 'W')
            })
    
            it("When facing West", () => {
                const rover = new MarsRover([1,2], 'W')
                rover.turn('R')
                assert.equal(rover.direction, 'N')
            })
        })
    })

    describe('Checks if next move is an obstacles', () => {
        it('Returns false if no obstacle', () => {
            const rover = new MarsRover([1,2], 'N')
            assert.equal(rover.isObstacle([1,3]), false)
        })

        it('Returns true if obstacle', () => {
            const rover = new MarsRover([1,2], 'N', [[1,3],[7,9]])
            assert.equal(rover.isObstacle([1,3]), true)
        })
    })

    describe('Runs the correct action', () => {
        const sandbox = sinon.createSandbox()
        let rover

        beforeEach(() => {
            rover = new MarsRover([1,2], 'N')
            sandbox.stub(rover, 'turn')
            sandbox.stub(rover, 'move')
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('turns with L', () => {
            rover.runCommand('L')
            assert(rover.turn.calledWith('L'))
        })

        it('turns with R', () => {
            rover.runCommand('R')
            assert(rover.turn.calledWith('R'))
        })

        it('moves with M', () => {
            rover.runCommand('M')
            assert(rover.move.calledWith())
        })

        it('doesn\'t turn with M', () => {
            rover.runCommand('M')
            assert(!rover.turn.calledWith())
        })

        it('doesn\'t move with L', () => {
            rover.runCommand('L')
            assert(!rover.move.calledWith())
        })

        it('doesn\'t move with R', () => {
            rover.runCommand('R')
            assert(!rover.move.calledWith())
        })
    })
})