document.addEventListener('DOMContentLoaded', () => {
	const squares = document.querySelectorAll('.grid div');
	const resultDisplay = document.querySelector('#result');
	let widthOfGrid = 15;
	let currentShooterIndex = 217; // shooter starts at index of 217 in squares array, middle of the bottom row
	let currentInvaderIndex = 0; // invader starts at index 0
	let alienInvadersTakenDown = [];
	let result = 0;
	let direction = 1;
	let invaderId = null;

	// define alien invaders, how I want it to be appeared in squares grid
	const alienInvaders = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
	];

	// draw the alien invaders. With 'currentInvaderIndex' all the positions of invaders can be controlled in alien array.
	alienInvaders.forEach((invader) => squares[currentInvaderIndex + invader].classList.add('invader'));

	// draw the shooter
	squares[currentShooterIndex].classList.add('shooter');

	// move the shooter along a line, but not up or down
	function moveShooter (event) {
		squares[currentShooterIndex].classList.remove('shooter');
		switch (event.keyCode) {
			case 37:
				if (currentShooterIndex % widthOfGrid !== 0) currentShooterIndex -= 1;
				break;
			case 39:
				if (currentShooterIndex % widthOfGrid < widthOfGrid - 1) currentShooterIndex += 1;
				break;
		}
		// add shooter className to the new location of squares array
		squares[currentShooterIndex].classList.add('shooter');
	}

	// move the alien invaders
	function moveInvaders () {
		const leftEdge = alienInvaders[0] % widthOfGrid === 0;
		const rightEdge = alienInvaders[alienInvaders.length - 1] % widthOfGrid === widthOfGrid - 1;

		// set directions:
		if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
			direction = widthOfGrid; // it'll move down the whole array to the next row
		} else if (direction === widthOfGrid) {
			// if already 15
			(leftEdge) ? direction = 1 : direction = -1;
		}

		alienInvaders.map((invader) => squares[invader].classList.remove('invader'));

		// set new location for all the aliens in alienInvaders array
		for (let i = 0; i < alienInvaders.length; i++) {
			alienInvaders[i] += direction;
		}

		alienInvaders.map((invader, i) => {
			// if the alienInvadersTakeDown array doesn't include the Space / alienInvaders, add "invader" class
			if (!alienInvadersTakenDown.includes(i)) {
				squares[invader].classList.add('invader');
			}
		});

		// decide a game over - case1:
		// if in current shooter has classes of both 'invader' AND 'shooter', then the game is over
		if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
			resultDisplay.textContent = 'Game Over!';
			squares[currentShooterIndex].classList.add('boom');
			clearInterval(invaderId); // also clear the time interval for this
			// invaderId is setting interval that is calling this moveInvaders() function and we've set it at the end
		}

		// decide a game over - case2: Also make sure that if any of the aliens miss the shooter, but reach the end of the grid, the game is over too. Doing it by declaring if any alien reaches the last 15 squares of the Grid, the game is over.
		for (let i = 0; i < alienInvaders.length; i++) {
			if (alienInvaders[i] > squares.length - (widthOfGrid - 1)) {
				// (squares.length - (widthOfGrid - 1)) = grids from last/bottom row
				resultDisplay.textContent = 'Game Over!';
				clearInterval(invaderId);
			}
		}

		// decide winning
		if (alienInvadersTakenDown.length === alienInvaders.length) {
			resultDisplay.textContent = 'You Win!';
			clearInterval(invaderId);
		}
	}

	// shoot alien function allows to shoot at the alien to win and get game points. Do so by passing through an event/e through this function
	function shoot (event) {
		let laserId = null;
		let currentLaserIndex = currentShooterIndex;

		// to move laser after shoot
		function moveLaser () {
			squares[currentLaserIndex].classList.remove('laser');
			currentLaserIndex -= widthOfGrid;
			squares[currentLaserIndex].classList.add('laser');
			if (squares[currentLaserIndex].classList.contains('invader')) {
				squares[currentLaserIndex].classList.remove('laser');
				squares[currentLaserIndex].classList.remove('invader');
				squares[currentLaserIndex].classList.add('boom');

				// we want the 'boom' to appeare for a very short time, so using timeOut for this
				setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
				clearInterval(laserId);

				const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
				alienInvadersTakenDown.push(alienTakenDown);
				result++;
				resultDisplay.textContent = result;
			}

			// lastly, if the laser isn't in the very first 15 squares, which means if it reaches the top wall, clear this interval and remove "laser" class from grid to make laser disappeared from grid.
			if (currentLaserIndex < widthOfGrid) {
				clearInterval(laserId);
				setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
			}
		}

		// using above logic, we pass an eventListener for keyCode 32, space bar on keyboard
		switch (event.keyCode) {
			case 32:
				laserId = setInterval(moveLaser, 100);
				break;
		}
	}

	invaderId = setInterval(moveInvaders, 500); // 500 ml sec

	document.addEventListener('keydown', moveShooter);
	document.addEventListener('keyup', shoot);
});
