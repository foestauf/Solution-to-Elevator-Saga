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
            elevator.on("floor_button_pressed", elevatorOnFloorButtonPressed);
            elevator.on("idle", elevatorOnIdle);
        });
        
        function elevatorOnIdle() {
            var elevator = this;
            if(elevator.getPressedFloors().length > 0) {
                elevator.getPressedFloors.forEach(floor => {
                    console.log('Using pressedFloors');
                 //   if (floor.floorNum > elevator.currentFloor) {
                 //       console.log("Setting Going up Indicator");
                 //       goingUpIndicator(True);
                 //   }
                    elevator.goToFloor(floor.floorNum());
                })
            } else if (waitingOn.length) {
                console.log('Using WaitingOn', waitingOn);
                var n = waitingOn.shift();
                elevator.goToFloor(n);
            } else {
                console.log('Giving up going to floors')
                elevator.goToFloor(0);
            }
        }
        function elevatorOnFloorButtonPressed(floorNum) {
            console.log('Elevator button pressed to', floorNum)
            let elevator = this;
            console.log(floorNum, elevator.currentFloor());
            if (floorNum > elevator.currentFloor()) {
                console.log("Setting Going up Indicator");
                elevator.goingUpIndicator = true;
                elevator.goingDownIndicator = false;
                console.log("Elevator light is", elevator.goingUpIndicator);
            } else {
                elevator.goingDownIndicator = true;
                elevator.goingUpIndicator = false;
            }
            elevator.goToFloor(floorNum, true)
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}