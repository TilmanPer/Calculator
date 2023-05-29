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
		let text = getDisplayText();
		const history = getHistoryText();

		if (history === "0" && text === "0" && text === 0) return;

		const historyRegex = /[\+\-\*\/\%]\w+$/;
		const historyMatches = history.match(historyRegex);
		const textRegex = /\d+[\+\-\*\/\%]\w+$/;
		const textMatches = text.match(textRegex);

		if (!textMatches && historyMatches) {
			text += historyMatches;
		} else {
			console.log('No match found.');
		}

		const result = eval(text);

		setHistoryText(text);
		setDisplayText(result.toString());
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
