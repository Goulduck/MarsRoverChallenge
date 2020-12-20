const MissionControl = require('../src/MissionControl')
const MarsRover = require('../src/MarsRover')
let chai = require('chai');
const sinon = require('sinon')
const assert = chai.assert

describe('MissionControl', () => {
    describe('transformInput', () => {
        const sandbox = sinon.createSandbox()
        beforeEach(() => {
            sandbox.stub(MissionControl, 'validateRoverCoordinates').returns(true)
            sandbox.stub(MissionControl, 'validateCommandString').returns(true)
            sandbox.stub(MissionControl, 'validatePlateauCoordinates').returns(true)
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('Can split and trim input instructions', () => {
            const testInput = '5 5/n1 2 N/nLMLMLMLMM/n3 3 E/nMMRMMRMRRM'
            assert.deepEqual(MissionControl.transformInput(testInput),{
                plateauCoordinates: [5, 5],
                rovers: [{
                    startPosition: [1,2], 
                    direction: 'N', 
                    commands: [...'LMLMLMLMM']
                },{
                    startPosition: [3,3], 
                    direction: 'E', 
                    commands: [...'MMRMMRMRRM']
                }]
            })
        })
    })

    describe('Validates', () => {
        it('Plateau co-ordinates', () => {
            const validCoOrdinates = '10 10' // Perfect
            const invalidCoOrdinates = '1 Q' // Error - Invalid Co-ordintes
            const negativeCoOrdinates = '-2 -4' // Error - Co-ordinate must be positive

            assert.equal(MissionControl.validatePlateauCoordinates(validCoOrdinates), true)
            assert.throws(() => MissionControl.validatePlateauCoordinates(invalidCoOrdinates), Error, 'Co-ordinates must be integers')
            assert.throws(() => MissionControl.validatePlateauCoordinates(negativeCoOrdinates), Error, 'Co-ordinates can not be negative')
        })

        it('Rover co-ordinates', () => {
            const validCoOrdinates = '6 1 N' // Perfect
            const invalidCoOrdinates = '1 Q S' // Error - Invalid Co-ordinates
            const integerCoOrdinates = '1.2 1.5 S' // Error - Co-ordinates must be integers
            const negativeCoOrdinates = '-2 -4 E' // Error - Co-ordinates must be positive

            assert.equal(MissionControl.validateRoverCoordinates(validCoOrdinates), true)
            assert.throws(() => MissionControl.validateRoverCoordinates(invalidCoOrdinates), Error, 'Invalid Co-ordinates')
            assert.throws(() => MissionControl.validateRoverCoordinates(integerCoOrdinates), Error, 'Co-ordinates must be integers')
            assert.throws(() => MissionControl.validateRoverCoordinates(negativeCoOrdinates), Error, 'Co-ordinates must be positive')
        })

        it('Rover move instruction', () => {
            const validInstruction = 'LMLMLMLMM'
            const invalidInstruction = 'LMLMFOOBARMM'

            assert.equal(MissionControl.validateCommandString(validInstruction), true)
            assert.throws(() => MissionControl.validateCommandString(invalidInstruction), Error, 'Invalid Command - Commands must be L, R or M')
        })

    })

    describe('RunMission', () => {
        it('Returns the expected response on successful mission', () => {
            const expectedResult = "Plateau: ok/nRover1: 1 3 N/nRover2: 0 4 W : Command execution halted due to obstacle/edge of plateau"
            assert.equal(MissionControl.runMission('10 10/n1 2 N/n LMLMLMLM/n 0 4 W/nMMRMRMLMM'), expectResult)
        })

        describe('Runs all commands for each rover', () => {
            const sandbox = sinon.createSandbox()
            let rover

            beforeEach(() => {
                rover = new MarsRover([1,2], 'N')
                sandbox.stub(rover, 'runCommand')
            })

            afterEach(() => {
                sandbox.restore()
            })
            
            it('Calls run command with each command', () => {
                MissionControl.runMission('LRMLRM')
                assert(rover.runCommand.callCount(6))
            })
        })
        // takes command i.e. "10 10/n1 2 N/n LMLMLMLM/n 0 4 W/nMMRMRMLMM"
        // Runs moves in sequence
        // {
        //     plateauCoordinates: [20, 40]
        //     rovers[{
        //         coordinates: [1,2],
        //         direction: 'N',
        //         commands: [...LMLMLMLMM],
        //     }, {
        //         coordinates: [0,4],
        //         direction: 'W',
        //         commands: [...MMRMRMLMM]
        //     }]
        //    
        // }
        // 
        // Returns
        // ------------
        // Plateau: ok
        // Rover1: 1 3 N
        // Rover2: 0 4 W : Command execution halted due to obstacle/edge of plateau
    })

})



