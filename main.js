{
    init: function(elevators, floors) {
        // Establish waiting list
        var waitingOn = [];
        console.clear();
        floors.forEach(floor => {
            floor.on('up_button_pressed', floorButtonPressed);
            floor.on('down_button_pressed', floorButtonPressed);
         });

        elevators.forEach(elevator => {
            elevator.on("floor_button_pressed", elevatorOnFloorButtonPressed);
            elevator.on("idle", elevatorOnIdle);
        });

        function floorButtonPressed() {
            var floor = this;
            waitingOn.push(floor.floorNum());
        }   
        
        function elevatorOnIdle() {
            var elevator = this;
            if(elevator.getPressedFloors().length > 0) {
                elevator.getPressedFloors.forEach(floor => {
                    console.log('Using pressedFloors');
                    elevator.goToFloor(floor.floorNum());
                })
            } else if (waitingOn.length) {
                console.log('Using WaitingOn', waitingOn);
                if (waitingOn.length > 3) {
                    console.log("Cleaning up Array duplicates");
                    waitingOn = [...new Set(waitingOn)];
                }

                if (waitingOn[0] > elevator.currentFloor) {
                    waitingOn.sort(function (a, b) { return a - b });
                } else {
                    waitingOn.sort(function (a,b) {return b - a});
                }
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
            elevator.goToFloor(floorNum, true)
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}