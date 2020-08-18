interface Alarm {
	alert(): void;
}

class Door {

}

class SecurityDoor extends Door implements Alarm {
	alert() {
		console.log('SecurityDoor');
	}
}

class Car implements Alarm {
	alert() {
		console.log("Car");
	}
}