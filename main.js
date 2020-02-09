{
    init: function(elevators, floors) {
        // Establish waiting list
        var waitingOn = [];
        const maxFloor = floors.length-1;
        console.clear();
        floors.forEach(floor => {
            floor.on('up_button_pressed', floorButtonPressed);
            floor.on('down_button_pressed', floorButtonPressed);
         });

        elevators.forEach(elevator => {
            console.log("Checking", elevator);
            elevator.on("passing_floor", floorNum => {
                let floorRoster = floorNum;
                if (this.getPressedFloors.includes(floorNum)) {
                    elevator.goToFloor(floorNum);
                }
            });


            elevator.on("floor_button_pressed", elevatorOnFloorButtonPressed);
            elevator.on("idle", elevatorOnIdle);
            elevator.on("stopped_at_floor", floorNum => {
                // do something here
                // control up and down indicators
                // TODO: control up down indicators better
                switch (floorNum) {
                    case 0:
                        up = true;
                        down = false;
                        break;
                    case maxFloor:
                        up = false;
                        down = true;
                        break;
                    default:
                        up = true;
                        down = true;
                        break;
                }
                elevator.goingUpIndicator(up);
                elevator.goingDownIndicator(down);
            });
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
                    console.log(floor.floorNum);
                    elevator.goToFloor(...new Set(floor.floorNum()));
                })
            } else if (waitingOn.length) {
                console.log('Using WaitingOn', waitingOn);
                if (waitingOn.length > 3) {
                    console.log("Cleaning up Array duplicates");
                    waitingOn = [...new Set(waitingOn)];
                    console.log('New waiting list: ' + waitingOn);
                }

                if (waitingOn[0] > elevator.currentFloor) {
                    console.log("Going up");
                    waitingOn.sort(function (a, b) { return a - b });
                } else {
                    console.log("Going Down");
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
            let foors = floorNum;
            console.log(floors);
            console.log(floorNum, elevator.currentFloor());
            elevator.goToFloor(floorNum, true)
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}