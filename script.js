document.addEventListener("DOMContentLoaded", () => {
	const displayText = document.getElementById('input-text');
	const historyText = document.getElementById('history-text');
	const buttons = document.querySelectorAll('.button');

	/*Button click sound*/
	const clickSound = new Audio("click.m4a");

	function playSound(audio, volume) {
		audio = audio.cloneNode();
		audio.volume = volume;
		audio.play();
	}

	const handleInput = input => {
		if (getDisplayText() === '0') {
			setDisplayText('');
		}
		addDisplayText(input);
		playSound(clickSound, 0.1);
	}

	function setActiveButton(key) {
		buttons.forEach(button => {
			if (key === 'Enter') key = '=';
			if (key === 'Escape') key = 'CE';
			if (key === 'Backspace') key = 'Delete';

			if (button.innerHTML === key) {
				button.classList.add('active');
			}
		});
	}

	function removeActiveButton(key) {
		buttons.forEach(button => {
			if (key === 'Enter') key = '=';
			if (key === 'Escape') key = 'CE';
			if (key === 'Backspace') key = 'Delete';

			if (button.innerHTML === key) {
				button.classList.remove('active');
			}
		});
	}

	const calculate = () => {
		let inputText = getDisplayText();

		const inputRegex = /^(\-?\d+(\.\d+)?(([\+\-\*\/\%]-?\d+(\.\d+)?)*)*)$/;
		const isValidInput = inputRegex.test(inputText);
		/*
				if (!isValidInput) {
					console.log(`'${inputText}' does not match the pattern`);
					displayText.innerHTML = markInvalidCharacters(inputText);
					return;
				}*/

		try {
			// Handling special cases: "--" becomes "+", "-+" becomes "-"
			inputText = inputText.replace(/\-\-/g, '+');
			inputText = inputText.replace(/\-\+/g, '-');

			const result = new Function('return ' + inputText)();
			setHistoryText(inputText);
			setDisplayText(result.toString());
		} catch (e) {
			console.log('Error in calculation: ' + e);
			displayText.innerHTML = '<span class="error">' + inputText + '</span>';
		}
	}

	function markInvalidCharacters(text) {
		// Splitting the input into segments that always include a number and an operator
		const segments = text.split(/(?=[\+\-\*\/\%])/);
		const segmentRegex = /^[\-\+]?[\w]+(?:\.[\w]+)?$/;  // Validating individual number with optional preceding '-' or '+'
		const operatorRegex = /^[\+\-\*\/\%]$/;  // Validating operators

		let markedText = '';
		let prevSegment = '';

		segments.forEach((segment, i) => {
			// If the segment is valid, add it to the marked text as is
			if ((operatorRegex.test(segment) && segmentRegex.test(prevSegment)) ||
				(segmentRegex.test(segment) && (operatorRegex.test(prevSegment) || prevSegment === ''))) {
				markedText += segment;
			}
			// If the segment is invalid, mark the whole segment as an error
			else {
				markedText += `<span class="error">${segment}</span>`;
			}
			prevSegment = segment;
		});

		return markedText;
	}




	buttons.forEach(button => {
		button.innerHTML = button.innerHTML.trim();

		button.addEventListener('click', () => {
			const key = button.innerHTML;
			switch (key) {
				case 'C':
				case 'Delete':
					setDisplayText('0');
					break;
				case 'CE':
				case 'Escape':
					setDisplayText('0');
					setHistoryText('');
					break;
				case '=':
				case 'Enter':
					calculate();
					break;
				default:
					handleInput(key);
					break;
			}
		});
	});

	document.addEventListener("keydown", event => {

		const key = event.key;
		setActiveButton(key);
		switch (key) {
			case 'Enter':
			case '=':
				calculate();
				break;
			case 'Backspace':
				setDisplayText(getDisplayText().slice(0, -1));
				if (getDisplayText().length === 0) {
					setDisplayText('0');
				}
				break;
			case 'Escape':
			case 'CE':
				setDisplayText('0');
				setHistoryText('');
				break;
			case 'Delete':
			case 'C':
				setDisplayText('0');
				break;
			case '+':
			case '-':
			case '*':
			case '/':
			case '%':
				handleInput(key);
				break;
			default:
				if (!isNaN(key)) {
					handleInput(key);
				}
				break;
		}
	});

	document.addEventListener("keyup", event => {
		removeActiveButton(event.key);
	});

	const setDisplayText = text => {
		displayText.innerHTML = text.replace(/<span class="error">(.*?)<\/span>/g, '$1');
	}

	const setHistoryText = text => {
		historyText.innerHTML = text;
	}

	const getHistoryText = () => {
		return historyText.innerHTML;
	}

	const addDisplayText = text => {
		displayText.innerHTML += text;
	}

	const getDisplayText = () => {
		return displayText.innerHTML;
	}
});
