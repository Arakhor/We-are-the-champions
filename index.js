import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
	onValue,
	runTransaction,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
	databaseURL:
		"https://we-are-the-champions-24398-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const listInDB = ref(database, "forms");

const formEl = document.getElementById("form");
const msgEl = document.getElementById("msg");
const senderEl = document.getElementById("sender");
const recipientEl = document.getElementById("recipient");
const formListEl = document.getElementById("form-list");

//
onValue(listInDB, (snapshot) => {
	if (snapshot.exists()) {
		let itemsArr = Object.entries(snapshot.val());
		clearFormListEl();
		for (let i = 0; i < itemsArr.length; i++) {
			appendToFormListEl(itemsArr[i]);
		}
	}
});

// submit form
formEl.addEventListener("submit", (e) => {
	e.preventDefault();

	if (msgEl.value == "" || senderEl.value == "" || recipientEl.value == "") {
		console.log("error");
	} else {
		push(listInDB, {
			msg: msgEl.value,
			sender: senderEl.value,
			recipient: recipientEl.value,
			likes: 0,
		});
		clearInput();
	}
});

function appendToFormListEl(item) {
	let newEl = document.createElement("li");
	const itemID = item[0];
	newEl.innerHTML = `<h5>To ${item[1].recipient}</h5>
		<p>${item[1].msg}</p>
		<h5>From ${item[1].sender}<span>❤️ ${item[1].likes}</span></h5>`;
	newEl.addEventListener("click", function () {
		const formRef = ref(database, `/forms/` + itemID);
		runTransaction(formRef, (form) => {
			form.likes++;
			console.log(form.likes);
			return form;
		});
	});
	formListEl.append(newEl);
}

function clearInput() {
	msgEl.value = "";
	senderEl.value = "";
	recipientEl.value = "";
}

function clearFormListEl() {
	formListEl.innerHTML = "";
}
