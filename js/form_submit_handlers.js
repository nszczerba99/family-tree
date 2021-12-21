
const submitPeopleForRelationCheck = () => {
	const select1 = document.getElementById('check-relation-person1-select');
	const select2 = document.getElementById('check-relation-person2-select');
	const id1 = select1.options[select1.selectedIndex].value;
	const id2 = select2.options[select2.selectedIndex].value;

	getData(`${apiBaseAdress}/family/relation?id1=${id1}&id2=${id2}`, (response) => {
		showRelationOnTree(response);
		showRelationInText(response);
	});
	return false;
};

const submitNewPerson = () => {
	const addPersonForm = document.getElementById('add-person-form');
	const name = document.getElementById('new-person-name').value;
	const surname = document.getElementById('new-person-surname').value;

	const relationSelect = document.getElementById('new-person-relation-select');
	const relation = relationSelect.options[relationSelect.selectedIndex].value;

	const relativesSelect = document.getElementById('new-person-relatives-select');
	const relativesData = relativesSelect.options[relativesSelect.selectedIndex].value;

	const onSuccess = () => {
		addPersonForm.reset();
		addPersonForm.classList.remove("show");
		document.getElementById('relation-check-result').innerHTML = '';
		loadFamilyTreeData();
	};

	postData(`${apiBaseAdress}/add/family/member`, {name, surname}, (added_person_id) => {
		if (relation === 'spouse') {
			const relationDataToSend = {
				type: relation,
				from: relativesData,
				to: added_person_id,
			};
			postData(`${apiBaseAdress}/add/family/relation`, relationDataToSend, () => {
				onSuccess();
			});
		} else {
			const parents = relativesData.split(' ');
			const p1 = parents[0];
			const p2 = parents[1];

			const relationDataToSend1 = {
				type: relation,
				from: p1,
				to: added_person_id,
			};
			const relationDataToSend2 = {
				type: relation,
				from: p2,
				to: added_person_id,
			};
			postData(`${apiBaseAdress}/add/family/relation`, relationDataToSend1, () => {
				postData(`${apiBaseAdress}/add/family/relation`, relationDataToSend2, () => {
					onSuccess();
				});
			});
		}
	});
	return false;
};