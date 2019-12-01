{
    init: function(elevators, floors) {
        console.clear();
        // Whenever the elevator is idle (has no more queued destinations) ... 
        floors.forEach(floor => {
            floor.on('up_button_pressed', floorButtonPressed);
            floor.on('down_button_pressed', floorButtonPressed);
         });
        // Establish waiting list
        var waitingOn = [];
        function floorButtonPressed() {
            var floor = this;
            waitingOn.push(floor.floorNum());
        }
        
        elevators.forEach(elevator => {
            elevator.on("idle", elevatorOnIdle);
            elevator.on("floor_button_pressed", elevatorOnFloorButtonPressed);
        });
        
        function elevatorOnIdle() {
            var elevator = this;
            console.log('Bored, going to pressed list');
            if(elevator.getPressedFloors().length > 0) {
                elevator.getPressedFloors.forEach(function(floor) {
                    console.log('Trying to call waitingOn array');
                    elevator.goToFloor(floor.floorNum());
                });
            } else if (waitingOn.length) {
                console.log('go on to the list of wait', waitingOn);
                var n = waitingOn.shift();
                elevator.goToFloor(n);
            } else {
                elevator.goToFloor(0);
            }
        }
        function elevatorOnFloorButtonPressed(floorNum) {
            console.log('Elevator button pressed to', floorNum)
            let elevator = this;
            elevator.goToFloor(floorNum, true)
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}