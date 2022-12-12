function  createElemWithText (hElem = "p", content = "", cName) {
	const newElem = document.createElement(hElem);
	newElem.id = "placeholder";
	newElem.textContent = content;
	if (cName) {
		newElem.classList.add(cName);
	}
	return newElem;
}

// 2
function createSelectOptions (data) {
	if (!data) return;
	const newArray = [];
	data.forEach((user) => {
		const newOption = document.createElement('option');
		newOption.value = user.id;
		newOption.textContent = user.name;
		newArray.push(newOption);
	});
	return newArray;
}

// 3
function toggleCommentSection (pID) {
	const sectionPostID = document.querySelector(`section[data-post-id='${pID}']`);
	if (!sectionPostID) return;
	sectionPostID.classList.toggle('hide');
	return sectionPostID;
}

// 4
function toggleCommentButton (pID) {
	const buttonPostID = document.querySelector(`button[data-post-id='${pID}']`);
	if (!buttonPostID) { return; }
	else if (buttonPostID.textContent === 'Show Comments') {
		buttonPostID.textContent = 'Hide Comments';
	} else {
		buttonPostID.textContent = 'Show Comments';
	}
	return buttonPostID;
}

// 5
function deleteChildElements (parentElem) {
	const child = parentElem.lastElementChild;
	while (child) {
		parentElem.removeChild(child);
		child = parentElem.lastElementChild;
	}
	return parentElem;
}

// 6
function addButtonListeners () {
	const main = document.querySelector('main');
	const myButtons = main.querySelectorAll('button');
	if (!myButtons) return;
	myButtons.forEach((buttons) => {
		const postID = buttons.dataset.postId;
		buttons.addEventListener('click', function (e) {toggleComments(e, postID)}, false);
	});
	return myButtons;
}

// 7
function removeButtonListeners () {
	const main = document.querySelector('main');
	const myButtons = main.querySelectorAll('button');
	if (!myButtons) return;
	myButtons.forEach((buttons) => {
		const postID = buttons.dataset.id;
		buttons.removeEventListener('click', function (e) {toggleComments(e, postID)}, false);
	});
	return myButtons;
}

// 8
function createComments (comments) {
	const fragment = document.createDocumentFragment();
	comments.forEach((comment) => {
		const article = document.createElement('article');
		const header3 = createElemWithText('h3', comment.name);
		const para1 = createElemWithText('p', comment.body);
		const para2 = createElemWithText('p', `From: ${comment.email}`);
		article.append(header3);
		article.append(para1);
		article.append(para2);
		fragment.append(article);
	});
	return fragment;
}

// 9
function populateSelectMenu (users) {
	const sMenu = document.getElementById('#selectMenu');
	const newOptions = createSelectOptions(users);
	newOptions.forEach((options) => {
		sMenu.append(options);
	});
	return sMenu;
}

// 10
async function getUsers () {
	try {
		const users = await fetch("https://jsonplaceholder.typicode.com/users");
		if (!users) throw new Error("Couldn't retrieve user data.");
		
		return await users.json();
	} catch (e) {
		console.error(e);
	}
}

// 11
async function getUsersPosts(uID) {
	try {
		const userPost = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${uID}`);
		if (!userPost) throw new Error("Couldn't retrieve user post data.");
		
		
		return await userPost.json();
	} catch (e) {
		console.error(e);
	}
}

// 12
async function getUser () {
	try {
		const user = await fetch(`https://jsonplaceholder.typicode.com/users?id=${uID}`);
		if (!userPost) throw new Error("Couldn't retrieve user post data.");
		
		
		return await user.json();
	} catch (e) {
		console.error(e);
	}
}

// 13
async function getPostComments (postID) {
	try {
		const commentID = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postID}`);
		if (!commentID) throw new Error("Couldn't retrieve user post data.");
		
		
		return await commentID.json();
	} catch (e) {
		console.error(e);
	}
}

// 14
async function displayComments (postID) {
	const section = document.createElement('section');
	section.dataset.postId = postID;
	section.classList.add('comments', 'hide');
	const comments = await getPostComments(postID);
	const fragment = await createComments(comments);
	section.append(fragment);
	return section;
}

// 15
async function createPosts (postData) {
	const fragment = document.createDocumentFragment();
	postData.forEach(async (post) => {
		const article = document.createElement('article');
		const header2 = createElemWithText('h2', post.title);
		const para1 = createElemWithText('p', post.body);
		const para2 = createElemWithText('p', `Post ID: ${post.id}`);
		const author = await getUser(post.userId);
		const para3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
		const para4 = createElemWithText('p', `${author.company.catchPhrase}`);
		const myButton = createElemWithText('button', 'Show Comments');
		myButton.dataset.postId = post.id;
		
		article.append(header2);
		article.append(para1);
		article.append(para2);
		article.append(para3);
		article.append(para4);
		article.append(author);
		article.append(myButton);
		
		const section = await displayComments(post.id);
		article.append(section);
		fragment.append(article);
	});
	return fragment;
}

// 16
async function displayPosts (postData) {
	const main = document.querySelector('main');
	const elem = '';
	if (!postData) elem = createElemWithText('p', 'Select an Employee to display their posts.');
	else elem = await createPosts(postData);
	
	main.append(elem);
	return elem;
}

// 17
function toggleComments (clickEvent, postID) {
	clickEvent.target.listener = true;
	const section = toggleCommentSection(postID);
	const myButton = toggleCommentButton(postID);
	const newArray = [section, myButton];
    return newArray;
}

// 18
async function refreshPosts (postData) {
	const myButtonsRemove = removeButtonListeners();
	const main = document.querySelector('main');
	main = deleteChildElements(main);
	const fragment = await displayPosts(postData);
	const myButtonsAdd = addButtonListeners();
	
	const newArray = [myButtonsRemove, main, fragment, myButtonsAdd];
    return newArray;
}

// 19
async function selectMenuChangeEventHandler () {
	document.querySelector('#selectMenu').disabled = true;
	userId = event.target.value || 1;
	const posts = await getUserPosts(userId);
	const refreshPosts = await refreshPosts(posts);
	document.querySelector('#selectMenu').disabled = false;
	const newArray = [userId, posts, refreshPosts];
    return newArray;
}

// 20
async function initPage () {
	const users = await getUsers();
	const mySelect  = await populateSelectMenu(users);
	const newArray = [users, mySelect];
    return newArray;
}

// 21
function initApp () {
	initPage();
	const selectMenu = document.querySelector('#selectMenu');
	selectMenu.addEventListener('change', selectMenuChangeEventHandler(), false);
}

document.addEventListener('DOMContentLoaded', initApp(), false);
