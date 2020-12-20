const MissionControl = {
    transformInput: missionStatement => {
        const commandArray = missionStatement.split('/n') // [['1 2 N', 'LMRLMRLMR'],['1 2 N', 'LMRLMRLMR']]
        let plateauCoordinates
        const rovers = []
        try {
            const unvalidatedPlateauCoordinates = commandArray.shift()
            console.log('here')
            console.log('here', typeof this.validatePlateauCoordinates())
            // if (this.validatePlateauCoordinates(unvalidatedPlateauCoordinates)) plateauCoordinates = unvalidatedPlateauCoordinates
            
            for(let i = 0; i <= commandArray.length; i = i + 2) {
                if (this.validateRoverCoordinates(commandArray[i]) && this.validateCommandString(commandArray[i+1])) {
                    const coordinateAndDirectionArray = commandArray[i].split[' ']
                    const direction = coordinateAndDirectionArray.pop()
                    rovers.push({
                        startPosition: coordinateAndDirectionArray.map(value => parseInt(value, 10)),
                        direction,
                        commands: commandArray[i+1]
                    })
                }
            } 

        } catch (err) {
            return err
        }
        console.log('RETURNED =>', {
            plateauCoordinates,
            rovers
        })
        return {
            plateauCoordinates,
            rovers
        }
    },

    validatePlateauCoordinates: function (coOrdinates) {
        return true
    },

    validateRoverCoordinates : coOrdinates => {
        return true
    },

    validateCommandString : commandString => {
        return true
    },

    runMission : missionStatement => {
        const missionObj = transformInput(missionStatement)
    }
}

module.exports = MissionControl