
// Userlist data array for filling in info box
let userListData = [];
let thisUserObject;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Hide modal
    $('.close').on('click', hideModal);

        // Open and close user form
    $('button.open-button').on('click', openForm);
    $('.cancel').on('click', closeForm);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Update User link click
    $('#userList table tbody').on('click', 'td a.linkedituser', editUser);
    $('#btnSubmitUser').on('click', submitUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){

            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '"><i class="fa fa-lg far fa-minus-square"></i></a></td>';
            tableContent += '<td>' + '<a href="#" class="linkedituser" rel="' + this._id + '"><i class=" fa fa-lg fas fa-edit"></a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Show modal
    $('.modal').css("display", "block");

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

//Hide modal

function hideModal() {
    $('.modal').css("display", "none");
}

// Add User
function addUser(event) {
    event.preventDefault();

    // Basic validation - increase errorCount variable if any fields are blank
    let errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        let newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }

    //Hide popup after new user is added
    $('.form-popup').css('display', 'none');
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

//Update User
function editUser(event) {

    // Prevent Link from Firing
    event.preventDefault();

    console.log(this);
    //Show popup
    $('.form-popup').css('display', 'flex');

    //Show button submit user
    $('#btnSubmitUser').css('display', 'flex');

    // Change AddUser table to EditUser table
    $('#addUserTitle').html('Edit User');
    $('#btnAddUser').css("display", "none");
    // $(this, '.linkedituser').html('submit').toggleClass('linkedituser linksubmituser');
    $(this, '.linkedituser').html('submit');

    // Retrieve username from link rel attribute
    var thisUserId = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisUserId);

    // Get our User Object
    thisUserObject = userListData[arrayPosition];

    //Populate Info Box
        $('#addUser fieldset input#inputUserName').val(thisUserObject.username);
        $('#addUser fieldset input#inputUserEmail').val(thisUserObject.email);
        $('#addUser fieldset input#inputUserFullname').val(thisUserObject.fullname);
        $('#addUser fieldset input#inputUserAge').val(thisUserObject.age);
        $('#addUser fieldset input#inputUserLocation').val(thisUserObject.location);
        $('#addUser fieldset input#inputUserGender').val(thisUserObject.gender);
};

// Edit User
function submitUser(event) {
    event.preventDefault();

    $('#addUserTitle').html('Add User');
    $('#btnAddUser').css("display", "flex");
    $('#btnSubmitUser').css("display", "none");

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Pop up a confirmation dialog
    // var confirmation = confirm('Are you sure you want to edit this user?');

    // Check and make sure the user confirmed
    if (/*confirmation === true &&*/ errorCount === 0) {
        var newEditUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        };

        // If they did, do our edit
        $.ajax({
            type: 'PUT',
            url: '/users/edituser/' + thisUserObject._id,
            data: newEditUser
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Clear the form inputs
            $('#addUser fieldset input').val('');

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
    //Hide popup
    $(".form-popup").css("display", "none");
};

//Open Form
function openForm() {
    $(".form-popup").css("display", "block");
}
//Close Form
function closeForm() {
    //Show button addUser
    $("#btnAddUser").css("display", "flex");
    //Hide popup
    $("#addUserTitle").html("Add user");
    //Hide popup
    $(".form-popup").css("display", "none");
    //Hide submit button
    $("#btnSubmitUser").css("display", "none");
    // Clear the form inputs
    $('#addUser fieldset input').val('');
    //Change linkedituser html
    if ($('.linkedituser').html() === 'submit') {
        $('.linkedituser').addClass('fa fa-lg fas fa-edit')
    }
    // $('.linkedituser').html('submit').removeClass('linksubmituser').addClass('linkedituser');
    $('.linkedituser').html('submit').html('<i class="fa fa-lg fas fa-edit">');
}