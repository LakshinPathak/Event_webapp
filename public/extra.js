
    function display_Table(events) {



        console.log(events);

        if (events && events.length > 0 && Array.isArray(events)) {
                console.log("hiii");
        }
        else{
            console.log("hiii2");
            document.getElementById('dashboard-event-details').innerHTML = `
        <h2>No events registered yet.</h2>
    `;
        }
    console.log(events);
   console.log("abc");
    const tableBody = document.getElementById('event-table-body');
        console.log(tableBody)
        tableBody.innerHTML='';
       // document.getElementById('event-table-body').innerHTML = ``;



    if (events && Array.isArray(events) && events.length>0 ) {
console.log(events);
        events.forEach(event => {


            const row = tableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.textContent = event.eventName;
            cell2.textContent = event.eventDetails;
            cell3.textContent = event.eventDate;

            // Add a delete button with an onclick event
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.onclick = function () {
                
                deleteEvent(event.eventName, event.loggedInUser);
                window.location.reload(true);
            };

            const cell4 = row.insertCell(3);
            cell4.appendChild(deleteButton);

        });

      
    } 
    else
     {
     
        document.getElementById('dashboard-event-details').innerHTML = `
            <h2>No events registered yet.</h2>
        `;
    }
}






//admin dashboard script

const urlParams = new URLSearchParams(window.location.search);
const isScript4 = urlParams.get("script4") === "true";
if(isScript4)
{
    const admin = urlParams.get("admin_name");
    console.log(admin);
}

const users = [
    { username: 'User1', email: 'user1@example.com' },
    { username: 'User2', email: 'user2@example.com' },
    // Add more users as needed
];

// Display users on the dashboard
function displayUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `<span>${user.username}</span>
                             <button onclick="deleteUser('${user.username}')">Delete</button>
                             <button onclick="openUpdateUserModal('${user.username}')">Update</button>`;

        userItem.appendChild(userInfo);
        userList.appendChild(userItem);
    });
}

// Function to delete a user (replace this with your actual delete user logic)
function deleteUser(username) {
    // Add your delete user logic here
    console.log('Deleting user:', username);
    // After deleting, update the user list
    displayUserList();
}

// Function to open the update user modal
function openUpdateUserModal(username) {
    const modal = document.getElementById('update-user-modal');
    modal.style.display = 'flex';
}

// Function to close the update user modal
function closeUpdateUserModal() {
    const modal = document.getElementById('update-user-modal');
    modal.style.display = 'none';
}

// Update user form submission logic (replace this with your actual update user logic)
document.getElementById('update-user-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const newEmail = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;

    // Add your update user logic here
    console.log('Updating user with new email and password:', newEmail, newPassword);

    // After updating, close the modal and update the user list
    closeUpdateUserModal();
    displayUserList();
});

// Display initial user list
displayUserList();