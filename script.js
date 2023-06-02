document.addEventListener("DOMContentLoaded", () => {
	const displayText = document.getElementById('input-text');
	const historyText = document.getElementById('history-text');
	const buttons = document.querySelectorAll('.button');

	const clickSound = new Audio("click.m4a");

	let lastOperation = null;
	let lastResult = null;

	function playSound(audio, volume) {
		const clonedAudio = audio.cloneNode();
		clonedAudio.volume = volume;
		clonedAudio.play();
	}

	const handleInput = input => {
		if (getDisplayText() === '0') {
			setDisplayText('');
		}
		addDisplayText(input);
		playSound(clickSound, 0.1);
	};

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

			if (button.innerHTML === key) {
				button.classList.remove('active');
			}
		});
	}

	const calculate = () => {
		if (getDisplayText().match(/^[\-\+]?[\w]+$/) && !getHistoryText()) return;
		let inputText = getDisplayText();

		const lastOperatorMatch = getHistoryText().match(/([\+\-\*\/\%][\-\+]?[\w]+)$/);
		lastOperation = lastOperatorMatch !== null ? lastOperatorMatch[0] : null;

		if (inputText === lastResult || inputText === '0' && lastOperation !== null) {
			inputText += lastOperation;
		}

		try {
			inputText = inputText.replace(/\-\-/g, '+').replace(/\-\+/g, '-');

			const result = new Function('return ' + inputText)();
			setHistoryText(inputText);
			setDisplayText(result.toString());

			lastResult = getDisplayText();
		} catch (e) {
			console.log('Error in calculation: ' + e);
			displayText.innerHTML = '<span class="error">' + inputText + '</span>';
		}
	};

	function inputListener(key) {
		switch (key) {
			case '=':
				calculate();
				break;
			case 'Backspace':
				setDisplayText(getDisplayText().slice(0, -1));
				if (getDisplayText().length === 0) {
					setDisplayText('0');
				}
				break;
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
	}

	buttons.forEach(button => {
		button.innerHTML = button.innerHTML.trim();

		button.addEventListener('click', () => {
			const key = button.innerHTML;
			inputListener(key);
		});
	});

	document.addEventListener("keydown", event => {
		let key = event.key;
		if (key === 'Enter') key = '=';
		if (key === 'Escape') key = 'CE';
		if (key === 'Backspace') key = 'Delete';

		setActiveButton(key);
		inputListener(key);
	});

	document.addEventListener("keyup", event => {
		removeActiveButton(event.key);
	});

	const setDisplayText = text => {
		displayText.innerHTML = text.replace(/<span class="error">(.*?)<\/span>/g, '$1');
	};

	const setHistoryText = text => {
		historyText.innerHTML = text;
	};

	const getHistoryText = () => {
		return historyText.innerHTML;
	};

	const addDisplayText = text => {
		displayText.innerHTML += text;
	};

	const getDisplayText = () => {
		return displayText.innerHTML;
	};
});
