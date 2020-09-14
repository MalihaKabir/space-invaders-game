document.addEventListener('DOMContentLoaded', () => {
	const squares = document.querySelectorAll('.grid div');
	const resultToDisplay = document.querySelector('#result');
	const width = 15;
	let currentShooterIndex = 217;
	let currentInvaderIndex = 0;
	let result = 0;
	let direction = 1;
	let invaderId = null;
	let alienInvadersTakenDown = [];

	//  the way alien invaders are supposed to be appeared in squares
	const invaderArray = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
	];

	// draw shooter
	squares[currentShooterIndex].classList.add('shooter');
	// draw invaders
	invaderArray.forEach((invader) => squares[currentInvaderIndex + invader].classList.add('invader'));

	// a function to move shooter
	function moveShooter (event) {
		squares[currentShooterIndex].classList.remove('shooter');
		switch (event.keyCode) {
			case 37:
				if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
				break;
			case 39:
				if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
				break;
		}
		squares[currentShooterIndex].classList.add('shooter');
	}

	// move the alien invaders
	function moveInvader () {
		const leftEdge = invaderArray[0] % width === 0;
		const rightEdge = invaderArray[invaderArray.length - 1] % width === width - 1;

		// set direction
		if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
			direction = width;
		} else if (direction === width) {

				leftEdge ? (direction = 1) :
				(direction = -1);
		}

		// remove invaders to set again
		invaderArray.forEach((invader) => squares[invader].classList.remove('invader'));

		// each invader is going to take direction to move
		for (let i = 0; i < invaderArray.length; i++) {
			invaderArray[i] += direction;
		}

		// add invaders to the new position with below condition
		invaderArray.forEach((invader, i) => {
			if (!alienInvadersTakenDown.includes(i)) {
				squares[invader].classList.add('invader');
			}
		});

		// decide a game over - when LOSE
		if (invaderArray[invaderArray.length - 1] > squares.length - (width - 1)) {
			clearInterval(invaderId);
			resultToDisplay.textContent = 'Game Over';
			squares[currentShooterIndex].classList.remove('shooter');
			squares[currentShooterIndex].classList.remove('invader');
			squares[currentShooterIndex].classList.add('boom');
			document.removeEventListener('keydown', moveShooter);
			document.removeEventListener('keydown', shoot);
		}

		// decide a game over - when WIN
		if (alienInvadersTakenDown.length === invaderArray.length) {
			resultToDisplay.textContent = 'You Win!';
			document.removeEventListener('keydown', moveShooter);
			clearInterval(invaderId);
		}
	}

	// shoot by moving laser
	function shoot (event) {
		let laserId = null;
		let currentLaserIndex = currentShooterIndex;

		function moveLaser () {
			squares[currentLaserIndex].classList.remove('laser');
			currentLaserIndex -= width;
			squares[currentLaserIndex].classList.add('laser');
			if (squares[currentLaserIndex].classList.contains('invader')) {
				squares[currentLaserIndex].classList.remove('laser');
				squares[currentLaserIndex].classList.remove('invader');
				squares[currentLaserIndex].classList.add('boom');
				clearInterval(laserId);
				setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 200);

				const alienTakenDown = invaderArray.indexOf(currentLaserIndex);
				alienInvadersTakenDown.push(alienTakenDown);
				result++;
				resultToDisplay.textContent = result;
			}

			if (currentLaserIndex < width) {
				clearInterval(laserId);
				setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
			}
		}

		// to move laser after shoot
		if (event.keyCode === 32) laserId = setInterval(moveLaser, 100);
	}

	// to move invaders
	invaderId = setInterval(moveInvader, 300);

	document.addEventListener('keydown', moveShooter);
	document.addEventListener('keydown', shoot);
});
