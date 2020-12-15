describe('Command Executer', function() {
    it('Can split and trim input instructions', () => {

    })

    it('Validates instructions', () => {
        describe('Plateau co-ordinates', function() {
            const validCoOrdinates = '10 10' // Perfect
            const invalidCoOrdinates = '1 Q' // Error - Invalid Co-ordintes
            const negativeCoOrdinates = '-2 -4' // Error - Co-ordinate must be positive
        })

        describe('Rover co-ordinates', function() {
            const validCoOrdinates = '6 1 N' // Perfect
            const invalidCoOrdinates = '1 Q S' // Error - Invalid Co-ordinates
            const integerCoOrdinates = '1.2 1.5 S' // Error - Co-ordinates must be integers
            const negativeCoOrdinates = '-2 -4 E' // Error - Co-ordinates must be positive
        
        })

        describe('Rover move instruction', function() {
            const validInstruction = 'LMLMLMLMM'
            const invalidInstruction = 'LMLMFOOBARMM'
        })

    })

    describe('Plots out the plateau', () => {
        describe('for valid co-ordinates', () => {
            it('Returns Plateau', function() {
            
            })
        })

        describe('for invalid co-ordinates', () => {
            it('Returns Error', function() {
            
            })
        })

        describe('for negative co-ordinates', () => {
            it('Returns Error', function() {
            
            })
        })
    })

    describe('Creates a rover', () => {
        describe('with valid co-ordinates', () => {
            it('Returns Rover', function() {
            
            })
        })

        describe('when not on plateau', () => {
            it('Returns Error', function() {
            
            })
        })

        describe('for invalid co-ordinates', () => {
            it('Returns Error', function() {
            
            })
        })

        describe('with invalid move instruction', () => {
            it('Returns Error', function() {
            
            })
        })
    })




})