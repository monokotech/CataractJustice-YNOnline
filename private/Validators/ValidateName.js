
function isNameValid(name) {

	return (
		(name.length <= 8) && 
		(/^[A-Za-z0-9]+$/.test(name))
	)
}

module.exports = isNameValid;