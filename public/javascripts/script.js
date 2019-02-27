(function () {
	const form = document.getElementById('form');
	form.onsubmit = function () {
		const inputElements = form.elements;
		if (inputElements.length > 0) {
			let formError = '';

			Array.prototype.slice.call(inputElements).forEach((item) => {
				if (item.required && !item.value.trim()) {
					formError = `Please input ${item.name}`;
				}
				switch (item.name) {
					case 'email':
						if (!validator.isEmail(item.value)) {
							formError = 'Please input the correct Email';
						}
						break;
					case 'password':
						if (!validator.isLength(item.value, {
								min: 8,
								max: 16
							})) {
							formError = 'Password must be 8-16 characters';
						}
						break;
					case 'url':
						if (!validator.isURL(item.value)) {
							formError = 'Please input the correct URL';
						}
						break;
					default:
						break;
				}
			});
			if (!formError) {
				return true;
			} else {
				alert(formError);
			}
		}
		return false;
	}
})();