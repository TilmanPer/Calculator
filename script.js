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
		const inputText = getDisplayText();

		const inputRegex = /^\-?[\w]+(?:\.[\w]+)?([\+\-\*\/\%][\w]+(?:\.[\w]+)?)*$/;
		const isValidInput = inputRegex.test(inputText) || inputRegex.test(inputText + '+');

		if (!isValidInput) {
			console.log(`'${inputText}' does not match the pattern`);
			displayText.innerHTML = markInvalidCharacters(inputText);
			return;
		}

		const result = eval(inputText);

		setHistoryText(inputText);
		setDisplayText(result.toString());
	}

	function markInvalidCharacters(text) {
		const inputRegex = /^\-?[\w]+(?:\.[\w]+)?([\+\-\*\/\%][\w]+(?:\.[\w]+)?)*$/;

		let markedText = '';
		let foundError = false;

		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const isInvalid = !inputRegex.test(char);

			if (isInvalid && !foundError) {
				markedText += `<span class="error">${char}</span>`;
				foundError = true;
			} else {
				markedText += char;
			}
		}

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
		displayText.innerHTML = text;
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
