document.addEventListener('DOMContentLoaded', () => {
	const squares = document.querySelectorAll('.grid div');
	const resultDisplay = document.querySelector('#result');
	let widthOfGrid = 15;
	let currentShooterIndex = 217; // shooter starts at index of 217 in squares array, middle of bottom row
	let currentInvaderIndex = 0; // invader starts at index 0
	let alienInvadersTakenDown = [];
	let result = 0;
	let direction = 1;
	let invader = null;

	// define alien invaders, how I want it to be appeared in squares array
	const alienInvaders = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
	];

	// draw the alien invaders. With 'currentInvaderIndex' all the positions of invaders can be controlled in alien array.
	alienInvaders.forEach((invader) => squares[currentInvaderIndex + invader].classList.add('invader'));

	// draw the shooter
	squares[currentShooterIndex].classList.add('shooter');

	// move the shooter along the line. but not up or down
	function moveShooter (event) {
		squares[currentShooterIndex].classList.remove('shooter');
		switch (event.keyCode) {
			case 37:
				if (currentShooterIndex % widthOfGrid !== 0) {
					currentShooterIndex -= 1;
				}
				break;
			case 39:
				if (currentShooterIndex % widthOfGrid < widthOfGrid - 1) {
					currentShooterIndex += 1;
				}
				break;
		}
		// add shooter className to the new location of squares array
		squares[currentShooterIndex].classList.add('shooter');
	}
	document.addEventListener('keydown', moveShooter);

	// move the alien invaders
	function moveInvaders () {
		const leftEdge = alienInvaders[0] % widthOfGrid === 0;
		const rightEdge = alienInvaders[alienInvaders.length - 1] % widthOfGrid === widthOfGrid - 1;

		// set directions:
		if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
			direction = widthOfGrid; // it'll move down the whole array to the next row
		} else if (direction === widthOfGrid) {
			// if already 15


				leftEdge ? (direction = 1) :
				(direction = -1);
		}

		for (let i = 0; i < alienInvaders.length; i++) {
			squares[alienInvaders[i]].classList.remove('invader');
		}
		for (let i = 0; i < alienInvaders.length; i++) {
			alienInvaders[i] += direction; // new location for all the aliens in alienInvaders array
		}
		for (let i = 0; i < alienInvaders.length; i++) {
			squares[alienInvaders[i]].classList.add('invader');
		}

		// decide a game over
		if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
			resultDisplay.textContent = 'Game Over!'
			squares[alienInvaders[i]].classList.add('boom');
			// clearInterval(invaderId);
		}
	}
});

// const alienInvaders = [
// 		0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
// 		15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
// 		30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
// 	];

// (leftEdge) ? direction = 1 : direction = -1;
