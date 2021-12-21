const showPeopleOptionsInRelationCheckSelect = (peopleData) => {
	const select1 = document.getElementById('check-relation-person1-select');
	const select2 = document.getElementById('check-relation-person2-select');

	let selectContent = '<option value="">--Wybierz osobę--</option>';
	peopleData.forEach((person) => {
		selectContent += `<option value="${person.id}">${person.name} ${person.surname}</option>`;
	});
	select1.innerHTML = select2.innerHTML = selectContent;
};

const showRelativesOptionsInAddPersonSelect = () => {
	const getPossibleSpousesData = (familyTreeData) => {
		const getPossibleSpouses = (node) => {
			let result = [];

			const [name, surname] = node.name.split(' ');
			result.push({id: node.extra.id, name, surname});

			node.marriages.forEach((marriage) => {
				marriage.children.forEach((child) => {
					result=[
						...result,
						...(getPossibleSpouses(child))
					];
				});
			});
			return result;
		};
		let possibleSpouses = getPossibleSpouses(familyTreeData);
		possibleSpouses.sort(peopleNamesSortFun);
		return possibleSpouses;
	};

	const relatives_select = document.getElementById('new-person-relatives-select');
	let str = '';

	const relation_select = document.getElementById('new-person-relation-select');
	if (relation_select.selectedIndex) {
		const relation = relation_select.options[relation_select.selectedIndex].value;

		if (relation === 'child') {
			str = '<option value="">--Wybierz rodziców--</option>';
			
			marriagesData.forEach((marriage) => {
				const p1 = marriage[0];
				const p2 = marriage[1];
				str += `<option value="${p1.id} ${p2.id}">${p1.name} ${p1.surname} i ${p2.name} ${p2.surname}</option>`;
			});
		} else {
			str = '<option value="">--Wybierz małżonkę/małżonka--</option>';
			const possibleSpousesData = getPossibleSpousesData(familyTreeData);
			possibleSpousesData.forEach((person) => {
				str += `<option value="${person.id}">${person.name} ${person.surname}</option>`;
			});
		}
	} else {
		str = '<option value="">--Brak opcji--</option>';
	}

	relatives_select.innerHTML = str;
};

const showRelationOnTree = (relationPath) => {
	const relationIds = relationPath.filter((item, index) => index % 2 === 0).map((person) => person.id);
	const markPathInFamilyTreeData = (node) => {
		node.class = relationIds.includes(node.extra.id) ? 'relation-path': 'node';
		node.marriages.forEach((marriage) => {
			marriage.spouse.class = relationIds.includes(marriage.spouse.extra.id) ? 'relation-path' : 'node';
			marriage.children.forEach((child) => {
				markPathInFamilyTreeData(child);
			});
		});
	};
	markPathInFamilyTreeData(familyTreeData);
	drawFamilyTree(familyTreeData);
};

const showRelationInText = (relationPath) => {
	const polishTypes = {
		spouse: 'małżonek',
		child: 'dziecko',
		parent: 'rodzic',
	};
	const searchResultElem = document.getElementById('relation-check-result');
	let str = '<p class="mt-5">';
	relationPath.forEach((item, index) => {
		if (index % 2 === 0) {
			str += `<span class="h5">${item.name} ${item.surname}<br></span>`;
		} else {

			const relationName = polishTypes[item.toLowerCase()]
			const arrowDown = '<span class="material-icons">arrow_downward</span>';
			str += `<span class="yellow">${arrowDown} (${relationName}) ${arrowDown}<br></span>`;
		}
	});
	str += '</p>';
	searchResultElem.innerHTML = str;
};

const drawFamilyTree = (familyTreeData) => {
	const treeElem = document.getElementById('tree');
	treeElem.innerHTML = '';

	const options = {
		target: '#tree',
		debug: false,
		width: 600,
		height: 400,
		hideMarriageNodes: false,
		marriageNodeSize: 7,
		callbacks: {},
		margin: {
		  top: 0,
		  right: 0,
		  bottom: 0,
		  left: 0
		},
		nodeWidth: 100,
		styles: {
		  node: 'node',
		  linage: 'linage',
		  marriage: 'marriage',
		  text: 'nodeText'
		}
	};
	tree = dTree.init([familyTreeData], options);
};