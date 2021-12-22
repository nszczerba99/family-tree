const apiBaseAdress = 'https://family-tree-api-99.herokuapp.com/api';
// const apiBaseAdress = 'http://127.0.0.1:5000/api';
var familyTreeData = null;
var peopleData = null;
var marriagesData = null;

const peopleNamesSortFun = (a, b) => {
	const lastNameComp = a.surname.localeCompare(b.surname);
	return lastNameComp !== 0 ? comp : a.name.localeCompare(b.name);
};

const addEventListenersForCheckRelationSelect = () => {
	const select1 = document.getElementById('check-relation-person1-select');
	const select2 = document.getElementById('check-relation-person2-select');
	const checkIfSelectedOptionsAreIndentical = (currentSelect, otherSelect) => {
		return (event) => {
			if (otherSelect.selectedIndex) {
				const currentId = currentSelect.options[currentSelect.selectedIndex].value;
				const otherId = otherSelect.options[otherSelect.selectedIndex].value;
				if (currentId === otherId) {
					const message = 'Selected people are the same person.';
					currentSelect.setCustomValidity(message);
					otherSelect.setCustomValidity(message);
				} else {
					currentSelect.setCustomValidity('');
					otherSelect.setCustomValidity('');
				}
			} else {
				currentSelect.setCustomValidity('');
				otherSelect.setCustomValidity('');
			}
		};
	};
	select1.addEventListener('change', checkIfSelectedOptionsAreIndentical(select1, select2));
	select2.addEventListener('change', checkIfSelectedOptionsAreIndentical(select2, select1));
};

const loadFamilyTreeData = () => {
	getData(`${apiBaseAdress}/familytree`, (response) => {
		familyTreeData = response;
		drawFamilyTree(familyTreeData);
	});
	getData(`${apiBaseAdress}/family/members`, (response) => {
		response.sort(peopleNamesSortFun);
		peopleData = response;
		showPeopleOptionsInRelationCheckSelect(peopleData);
	});
	getData(`${apiBaseAdress}/spouses`, (response) => {
		marriagesData = response;
	});
	addEventListenersForCheckRelationSelect();
};

window.addEventListener('load', loadFamilyTreeData);