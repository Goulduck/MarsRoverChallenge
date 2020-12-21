class MarsRover {
  constructor (coordinates, direction, obstacles, plateau) {
    this.validateInputs(coordinates, direction, obstacles)
    this.coordinates = coordinates || [0, 0]
    this.direction = direction || 'N'
    this.obstacles = obstacles || []
    this.plateau = plateau
  }

  validateInputs (coordinates, direction) {
    const cardinals = ['N', 'E', 'S', 'W']
    coordinates.forEach(coordinate => {
      if (!Number.isInteger(coordinate)) throw new Error('Co-ordinate must be an integer')
    })
    if (!cardinals.includes(direction)) throw new Error('Direction must be one of N, E, S, W')
  }

  move () {
    let xIncrease = 0; let yIncrease = 0
    if (this.direction === 'N') {
      yIncrease = 1
    } else if (this.direction === 'E') {
      xIncrease = 1
    } else if (this.direction === 'S') {
      yIncrease = -1
    } else if (this.direction === 'W') {
      xIncrease = -1
    }

    const newLocation = [(this.coordinates[0] + xIncrease), (this.coordinates[1] + yIncrease)]
    if (this.isObstacle(newLocation)) throw new Error('Co-ordinates result in collision')
    if (this.isOutOfBounds(newLocation, this.plateau)) throw new Error('Co-ordinates result in leaving plateau')
    this.coordinates = newLocation
  }

  turn (command) {
    const cardinals = ['N', 'E', 'S', 'W']
    const directionToIndex = cardinalIndex(this.direction)
    let newDirection
    if (command === 'L') {
      newDirection = (directionToIndex === 0) ? 'W' : cardinals[directionToIndex - 1]
    } else {
      newDirection = (directionToIndex === 3) ? 'N' : cardinals[directionToIndex + 1]
    }

    this.direction = newDirection
  }

  isObstacle (coordinates) {
    return !!this.obstacles.filter(obstacle => { return obstacle[0] === coordinates[0] && obstacle[1] === coordinates[1] }).length
  }

  isOutOfBounds (coordinates, plateau) {
    return (coordinates[0] < 0 || coordinates[1] < 0 || coordinates[0] > plateau[0] || coordinates[1] > plateau[1])
  }

  runCommand (command) { command === 'M' ? this.move() : this.turn(command) }
}

const cardinalIndex = (direction) => {
  const cardinals = ['N', 'E', 'S', 'W']
  return cardinals.indexOf(direction)
}

module.exports = MarsRover
