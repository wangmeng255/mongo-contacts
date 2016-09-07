"use strict"

var Contact = function() {
	this.persons = [];
	this.phoneCount = 0;
	this.addressCount = 0;
	this.showUlid = -1;
	
	this.addBar = $(".add-bar .plus");
	this.addContact = $(".add-contact");
	this.showContact = $(".show-contact");
	this.addForm = $(".add-contact form");
	this.listUl = $(".list-contact ul");
	this.listContact = $(".list-contact");
	this.showUl = $(".show-contact ul");
	this.cancel = $("#cancel");
	
	this.addBar.click(this.onAddBarClicked.bind(this));
	this.addForm.submit(this.onAddItemSubmit.bind(this));
	this.addForm.on("click", "#add-phone-number", this.onAddphoneNumberClicked.bind(this));
	this.addForm.on("click", "#add-address", this.onAddAddressClicked.bind(this));
	this.addForm.on("click", ".del-phone-number", this.onDelphoneNumberClicked.bind(this));
	this.addForm.on("click", ".del-address", this.onDelAddressClicked.bind(this));
	this.cancel.click(this.onCancelClicked.bind(this));
	
	this.listContact.on("click", ".person", this.onShowContactlistClicked.bind(this));
	
	this.listUl.on("click", ".del-item", this.onDelItemClicked.bind(this));
	
	this.showUl.on("dblclick", "li", this.onEditItemClicked.bind(this));
	this.showUl.on('focusout', 'li input', this.onEditFocusOut.bind(this));
	this.showUl.on('submit', '.edit-item-form', this.onEditItemSubmit.bind(this));
	
	this.getItems();
};

Contact.prototype.parsePhoneNumber = function(phoneNumber) {
   phoneNumber = phoneNumber.replace(/\d/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
   return phoneNumber;
};

Contact.prototype.onAddBarClicked = function() {
	this.showUl.html("");
	this.showContact.hide();
	this.addContact.show();
};

Contact.prototype.onAddItemSubmit = function(event) {
	event.preventDefault();
	var formSerial = this.addForm.serializeArray();
	if(formSerial[0].value && formSerial[1].value && formSerial[2].value){
		var person = {
			phoneNumber: [],
			Address: []
		};
		for(var i = 0; i < formSerial.length; i += 1)
		{
			if(formSerial[i].name.startsWith("phoneNumber")) {
				person["phoneNumber"].push(this.parsePhoneNumber(formSerial[i].value));
			}
			else {
				if(formSerial[i].name.startsWith("street")) {
					var Address = "";
					if(formSerial[i].value) Address += formSerial[i].value + ", ";
					if(formSerial[i += 1].value) Address += formSerial[i].value + ", ";
					if(formSerial[i += 1].value) Address += formSerial[i].value;
					if(Address.slice(Address.length - 2, Address.length - 1) === ", ") Address = Address.slice(0, Address.length - 3);
					person.Address.push(Address);
				}
				else {
					person[formSerial[i].name] = formSerial[i].value;
				}
			}
		}
		
		this.phoneCount = 0;
		this.addressCount = 0;
		
		this.addItem(person);
	}
	else{
		alert("Please submit first name, last name and phone number.");
	}
	
	this.clearAddForm();
	
	this.addContact.hide();
	this.showContact.show();
};

Contact.prototype.onCancelClicked = function() {
	this.clearAddForm();
	this.addContact.hide();
	this.showContact.show();
};

Contact.prototype.clearAddForm = function() {
	this.addForm.find("input[type='text']").each(function() {
		$(this).val("");
		if($(this).attr("name").match(/\d$/)) {
			$(this).siblings().each(function() {
				$(this).remove()
			});
			$(this).parent().remove();
			$(this).remove();
		}
	});
};

Contact.prototype.onAddphoneNumberClicked = function() {
	this.phoneCount += 1;
	var phoneCount = this.phoneCount;
	$("#street").parent().before(
		"<div><div class='delete-phone-number'><label for='phone-number" + phoneCount +"'>Phone Number</label>" +
		"<input type='button' class='del-phone-number' value='Remove Phone Number'></div>" +
		"<input type='text' name='phoneNumber" + phoneCount + 
		"' id='phone-number" + phoneCount +
		"'></div>"
	);
};

Contact.prototype.onAddAddressClicked = function() {
	this.addressCount += 1;
	var addressCount = this.addressCount;
	
	$("#add-address").before("<div><div class='delete-address'><label for='street" + addressCount + 
		"'>Street</label><input type='button' class='del-address' value='Remove Address'></div><input type='text' name='street" + addressCount + 
		"' id='street" + addressCount + "'></div><div><label for='city" + 
		addressCount + "'>City</label><br><input type='text' name='city" + addressCount +
		"' id='city"+ addressCount +"'></div><div><label for='state" + addressCount + 
		"'>State</label><br>" + "<input type='text' name='state" + addressCount + 
		"' id='state" + addressCount + "'></div>");	
};

Contact.prototype.onDelphoneNumberClicked = function(event) {
	var target = $(event.target);
	target.siblings().each(function() {
		$(this).remove();
	});
	target.parent().next().remove();
	target.parent().remove();
	target.remove();
};

Contact.prototype.onDelAddressClicked = function(event) {
	var target = $(event.target);
	target.siblings().each(function() {
		$(this).remove();
	});
	target.parent().next().remove();
	target.parent().parent().next().next().remove();
	target.parent().parent().next().remove();
	target.parent().parent().remove();
	target.remove();
};

Contact.prototype.onShowContactlistClicked = function (event) {
	this.onCancelClicked();
	
	var editInput = 
		"<form class='edit-item-form' hidden>" +
	          "<input type='text' name='edit-item-input'" +
	               "title='Edit item'>" + 
	          "<button type='submit' class='visually-hidden'>Edit item</button>" +
	    "</form>";

	this.showUl.html("");
	var listItem = $(event.target).parent();
	var i = this.listContact.find("li").index(listItem);
	this.showUlid = i;
	
	this.showUl.prepend(
		"<h4>Double-click to edit information</h4>" +
		"<h2>" + this.persons[i].firstName + " " + this.persons[i].lastName + "</h2>"
	);
	var showStr = "<ul>First name: <li><div class='value'>" + this.persons[i].firstName + "</div>" + editInput + "</li></ul>" +
		"<ul>Last name: <li><div class='value'>" + this.persons[i].lastName + "</div>" + editInput + "</li></ul>" +
		"<ul>Phone Number:"; 
	for(var j = 0; j < this.persons[i].phoneNumber.length; j += 1)
		showStr += "<li><div class = 'value'>" + this.persons[i].phoneNumber[j] + "</div>" + editInput + "</li>";
	showStr += "</ul><ul>Address:";
	if(this.persons[i]["Address"][0]) {
		for(var j = 0; j < this.persons[i]["Address"].length; j += 1)
			showStr += "<li><div class='value'>" + this.persons[i].Address[j] + "</div>" + editInput + "</li>";
	}
	showStr += "</ul>";
	this.showUl.append(showStr);
};

Contact.prototype.addItem = function(person) {
    if(person) {
	    var ajax = $.ajax('/items', {
	        type: 'POST',
	        data: JSON.stringify(person),
	        dataType: 'json',
	        contentType: 'application/json'
	    });
	    ajax.done(this.getItems.bind(this));
    }
};

Contact.prototype.getItems = function() {
    var ajax = $.ajax('/items', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(this.onGetItemsDone.bind(this));
};

Contact.prototype.onGetItemsDone = function(items) {
    this.persons = items;
    this.updateItemsView();
    console.log(items);
};

Contact.prototype.updateItemsView = function() {
	this.listUl.html("");
	var xSvg = $(".hidden").clone();
	for(var i = 0; i < this.persons.length; i++) {
		this.listUl.append(
			"<li><a href='#0' class=person>" + 
			this.persons[i].firstName + " " + this.persons[i].lastName + 
			"</a>" + xSvg.html() + "</li>"
		);
		this.listUl.find("svg").eq(i).addClass("del-item");
	}
};

Contact.prototype.onDelItemClicked = function(event) {
	var selectedli = $(event.target).closest("li");
	var i = this.listUl.find("li").index(selectedli);
	this.showContact.hide();
    this.deleteItem(this.persons[i]._id);
};

Contact.prototype.deleteItem = function(id) {
	var ajax = $.ajax('/items/' + id, {
        type: 'DELETE',
        dataType: 'json'
    });
    ajax.done(this.getItems.bind(this));
};

Contact.prototype.onEditItemClicked = function(event) {
	event.preventDefault();
    var item = $(event.target).parent("li");
    var form = item.children("form");
    var input = form.children("input");
    var value = item.children(".value");
    form.attr("hidden", null);
    input.focus();
    input.val(value.text());
    value.hide();
};

Contact.prototype.onEditFocusOut = function(event) {
    var item = $(event.target).closest("li");
    var i = this.showUlid;
    var id = this.persons[i]._id;
    var prop = this.findProperty(item);
    var form = item.children("form");
    var input = form.children("input");
    var val = input.val().trim();
    
    var name = prop.name;
    var person = this.persons[this.showUlid];
    if(name === "phoneNumber" || name === "Address") person[name][prop.id] = val;
    else person[name] = val;
    
    var value = item.children(".value");
    
    if (val != "") {
        this.editItem(id, person);
        value.text(val);
    }
    form.attr("hidden", true);
    value.show();
    event.preventDefault();
};

Contact.prototype.findProperty = function(item) {
	var prop = {};
	if(item.parent("ul").text().startsWith("First name")) {
		prop.name = "firstName";
	}
	if(item.parent("ul").text().startsWith("Last name")) {
		prop.name = "lastName";
	}
	if(item.parent("ul").text().startsWith("Phone Number")) {
		prop.name = "phoneNumber";
	}
	if(item.parent("ul").text().startsWith("Address")) {
		prop.name = "Address";
	}
	prop.id = item.parent("ul").find("li").index(item);
	return prop;
};

Contact.prototype.editItem = function(id, item) {
    console.log(id + ' ' + item);
    var ajax = $.ajax('/items/' + id, {
        type: 'PUT',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(this.getItems.bind(this));
};

Contact.prototype.onEditItemSubmit = function(event) {
    event.preventDefault();
    var input = $(event.target).children("input");
    input.blur();
};

$(document).ready(function() {
	var app = new Contact();
});