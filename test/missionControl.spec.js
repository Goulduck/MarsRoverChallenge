const MissionControl = require('../src/MissionControl')
let chai = require('chai');
const expect = chai.expect;
const assert = chai.assert

describe('MissionControl', () => {
    it('Can split and trim input instructions', () => {
        const testInput = '5 5/n1 2 N/nLMLMLMLMM/n3 3 E/nMMRMMRMRRM'
        assert.deepEqual(MissionControl.trimAndSplit(testInput),{
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

    it('Validates instructions', () => {
        describe('Plateau co-ordinates', () => {
            const validCoOrdinates = '10 10' // Perfect
            const invalidCoOrdinates = '1 Q' // Error - Invalid Co-ordintes
            const negativeCoOrdinates = '-2 -4' // Error - Co-ordinate must be positive

            assert.equal(MissionControl.validatePlateauCoordinates(validCoOrdinates), true)
            assert.throws(() => MissionControl.validatePlateauCoordinates(invalidCoOrdinates), Error, 'Co-ordinates must be integers')
            assert.throws(() => MissionControl.validatePlateauCoordinates(negativeCoOrdinates), Error, 'Co-ordinates can not be negative')
        })

        describe('Rover co-ordinates', () => {
            const validCoOrdinates = '6 1 N' // Perfect
            const invalidCoOrdinates = '1 Q S' // Error - Invalid Co-ordinates
            const integerCoOrdinates = '1.2 1.5 S' // Error - Co-ordinates must be integers
            const negativeCoOrdinates = '-2 -4 E' // Error - Co-ordinates must be positive

            assert.equal(MissionControl.validateRoverCoordinates(validCoOrdinates), true)
            assert.throws(() => MissionControl.validatePlateauCoordinates(invalidCoOrdinates), Error, 'Invalid Co-ordinates')
            assert.throws(() => MissionControl.validatePlateauCoordinates(integerCoOrdinates), Error, 'Co-ordinates must be integers')
            assert.throws(() => MissionControl.validatePlateauCoordinates(negativeCoOrdinates), Error, 'Co-ordinates must be positive')
        })

        describe('Rover move instruction', () => {
            const validInstruction = 'LMLMLMLMM'
            const invalidInstruction = 'LMLMFOOBARMM'

            assert.equal(MissionControl.validateRoverCoordinates(validInstruction), true)
            assert.throws(() => MissionControl.validatePlateauCoordinates(invalidInstruction), Error, 'Invalid Command - Commands must be L, R or M')
        })

    })

    describe('Run Command', () => {
        // takes command i.e. "10 10/n1 2 N/n LMLMLMLM/n 0 4 W/nMMRMRMLMM"
        // Runs moves in sequence
        // {
        //     plateauCoordinates: [20, 40]
        //     rovers[{
        //         coordinates: [1,2],
        //         direction: 'N',
        //         commands: [...LMLMLMLMM]
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



