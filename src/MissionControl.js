const MarsRover = require('./MarsRover')

const MissionControl = {
  transformInput: missionStatement => {
    const commandArray = missionStatement.split('/n')
    let plateauCoordinates
    const roverMissions = []
    const obstacles = []

    let unvalidatedPlateauCoordinates = commandArray.shift()
    unvalidatedPlateauCoordinates = unvalidatedPlateauCoordinates.split(' ').map(value => parseInt(value, 10))
    if (MissionControl.validatePlateauCoordinates(unvalidatedPlateauCoordinates)) plateauCoordinates = unvalidatedPlateauCoordinates

    for (let i = 0; i < commandArray.length; i = i + 2) {
      if (MissionControl.validateRoverCoordinates(commandArray[i]) && MissionControl.validateCommandString(commandArray[i + 1])) {
        const coordinateAndDirectionArray = commandArray[i].split(' ')
        const direction = coordinateAndDirectionArray.pop()
        const roverMission = {
          startPosition: coordinateAndDirectionArray.map(value => parseInt(value, 10)),
          direction,
          commands: [...commandArray[i + 1]]
        }
        roverMissions.push(roverMission)
        obstacles.push(roverMission.startPosition)
      }
    }

    return {
      plateauCoordinates,
      roverMissions,
      obstacles
    }
  },

  validatePlateauCoordinates: function (coordinates) {
    if (!(Number.isInteger(coordinates[0]) && Number.isInteger(coordinates[1]))) throw new Error('Co-ordinates must be integers')
    if (coordinates[0] < 0 && coordinates[1] < 0) throw new Error('Co-ordinates can not be negative')
    return true
  },

  validateRoverCoordinates: coordinates => {
    const validcoordinatesRegEx = /[0-9]+ [0-9]+ (N|E|S|W)/i // RegEx is clearly not my forté
    const coordinateArray = coordinates.split(' ')
    if (coordinateArray[0] < 0 && coordinateArray[1] < 0) throw new Error('Co-ordinates must be positive')
    if (!validcoordinatesRegEx.test(coordinates)) throw new Error('Invalid Co-ordinates - Co-ordinates must be integers')
    return true
  },

  validateCommandString: commandArray => {
    const validCommandRegEx = /(M|L|R)+/i
    if (![...commandArray.trim()].every(char => validCommandRegEx.test(char))) throw new Error('Invalid Command - Commands must be L, R or M')
    return true
  },

  runMission: missionStatement => {
    let missionObj
    try {
      missionObj = MissionControl.transformInput(missionStatement)
    } catch (err) {
      throw new Error('Mission unsuccessful - What even was that input?')
    }
    let { obstacles } = missionObj
    const missionResults = []
    missionObj.roverMissions.forEach((mission, i) => {
      obstacles = obstacles.filter(obstacle => !(obstacle[0] === mission.startPosition[0] && obstacle[1] === mission.startPosition[1]))
      const rover = new MarsRover(mission.startPosition, mission.direction, mission.obstacles, missionObj.plateauCoordinates)
      try {
        mission.commands.forEach(command => rover.runCommand(command))
        rover.coordinates.push(rover.direction)
        missionResults.push(rover.coordinates.join(' '))
      } catch (err) {
        rover.coordinates.push(rover.direction, `Command execution halted - ${err.message}`)
        missionResults.push(rover.coordinates.join(' '))
        return err
      }
      obstacles.push(rover.coordinates)
    })
    return missionResults.join('\n')
  }
}

module.exports = MissionControl
require('make-runnable')
