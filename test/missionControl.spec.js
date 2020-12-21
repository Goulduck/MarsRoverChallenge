const MissionControl = require('../src/MissionControl')
const chai = require('chai')
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
      assert.deepEqual(MissionControl.transformInput(testInput), {
        plateauCoordinates: [5, 5],
        roverMissions: [{
          startPosition: [1, 2],
          direction: 'N',
          commands: [...'LMLMLMLMM']
        }, {
          startPosition: [3, 3],
          direction: 'E',
          commands: [...'MMRMMRMRRM']
        }],
        obstacles: [
          [1, 2],
          [3, 3]
        ]
      })
    })
  })

  describe('Validates', () => {
    it('Plateau co-ordinates', () => {
      const validCoOrdinates = [10, 10] // Perfect
      const invalidCoOrdinates = [1, NaN] // Error - Invalid Co-ordintes
      const negativeCoOrdinates = [-2, -4] // Error - Co-ordinate must be positive
      const integerCoOrdinates = [11.2, 11.5] // Error - Co-ordinates must be integers

      assert.equal(MissionControl.validatePlateauCoordinates(validCoOrdinates), true)
      assert.throws(() => MissionControl.validatePlateauCoordinates(invalidCoOrdinates), Error, 'Co-ordinates must be integers')
      assert.throws(() => MissionControl.validatePlateauCoordinates(negativeCoOrdinates), Error, 'Co-ordinates can not be negative')
      assert.throws(() => MissionControl.validatePlateauCoordinates(integerCoOrdinates), Error, 'Co-ordinates must be integers')
    })

    it('Rover co-ordinates', () => {
      const validCoOrdinates = '6 1 N' // Perfect
      const invalidCoOrdinates = '1 Q S' // Error - Invalid Co-ordinates
      const decimalCoOrdinates = '1.2 1.5 S' // Error - Co-ordinates must be integers
      const negativeCoOrdinates = '-2 -4 E' // Error - Co-ordinates must be positive

      assert.equal(MissionControl.validateRoverCoordinates(validCoOrdinates), true)
      assert.throws(() => MissionControl.validateRoverCoordinates(invalidCoOrdinates), Error, 'Invalid Co-ordinates - Co-ordinates must be integers')
      assert.throws(() => MissionControl.validateRoverCoordinates(decimalCoOrdinates), Error, 'Invalid Co-ordinates - Co-ordinates must be integers')
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
      const expectedResult =
            `1 3 N
5 1 E`
      assert.equal(MissionControl.runMission('5 5/n1 2 N/nLMLMLMLMM/n3 3 E/nMMRMMRMRRM'), expectedResult)
    })

    it('Returns the expected response on semi-successful mission', () => {
      const expectedResult = `1 3 N
0 4 W Command execution halted - Co-ordinates result in leaving plateau`
      assert.equal(MissionControl.runMission('10 10/n1 2 N/nLMLMLMLMM/n0 4 W/nMMRMRMLMM'), expectedResult)
    })

    it('Errors with bad input', () => {
      const badInput = "Chris wants Nando's"
      assert.throws(() => MissionControl.runMission(badInput), Error, 'Mission unsuccessful - What even was that input?')
    })
  })
})
