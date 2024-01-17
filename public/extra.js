
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



//  html: `<p>Dear ${guestName},<br>
//              You are invited to our event!<br>
//              Please let us know if you'll be able to attend by responding to this email.<br>  
//                         We look forward to seeing you!</p>`





const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'; 
const GOOGLE_PRIVATE_KEY="f5e87b9500f260cfb3834365785f892775a1a97d"
const GOOGLE_CLIENT_EMAIL = "lakshinpathak2003@gmail.com"
const GOOGLE_PROJECT_NUMBER = "771496546384"
const GOOGLE_CALENDAR_ID = "4a80cfaebace8d0965cfa4f5c1215249810dc0cd43372bca80a5964a1100c1a3@group.calendar.google.com"


const jwtClient = new google.auth.JWT( 
    GOOGLE_CLIENT_EMAIL, 
    null, 
    GOOGLE_PRIVATE_KEY, 
    SCOPES 
  ); 
    
  const calendar = google.calendar({ 
    version: 'v3', 
    project: GOOGLE_PROJECT_NUMBER, 
    auth: jwtClient 
  }); 
    
  app.get('/', (req, res) => { 
    calendar.events.list({ 
      calendarId: GOOGLE_CALENDAR_ID, 
      timeMin: (new Date()).toISOString(), 
      maxResults: 10, 
      singleEvents: true, 
      orderBy: 'startTime', 
    }, (error, result) => { 
      if (error) { 
        res.send(JSON.stringify({ error: error })); 
      } else { 
        if (result.data.items.length) { 
          res.send(JSON.stringify({ events: result.data.items })); 
        } else { 
          res.send(JSON.stringify({ message: 'No upcoming events found.' })); 
        } 
      } 
    }); 
  }); 
    



  app.get("/createEvent_calender",(req,res)=>{ 
    var event = { 
      'summary': 'My first event!', 
      'location': 'Hyderabad,India', 
      'description': 'First event with nodeJS!', 
      'start': { 
        'dateTime': '2022-01-12T09:00:00-07:00', 
        'timeZone': 'Asia/Dhaka', 
      }, 
      'end': { 
        'dateTime': '2022-01-14T17:00:00-07:00', 
        'timeZone': 'Asia/Dhaka', 
      }, 
      'attendees': [], 
      'reminders': { 
        'useDefault': false, 
        'overrides': [ 
          {'method': 'email', 'minutes': 24 * 60}, 
          {'method': 'popup', 'minutes': 10}, 
        ], 
      }, 
    }; 
      
    const auth = new google.auth.GoogleAuth({ 
      keyFile: '<full-path-of-JSON-file>', 
      scopes: 'https://www.googleapis.com/auth/calendar', 
    }); 
    auth.getClient().then(a=>{ 
      calendar.events.insert({ 
        auth:a, 
        calendarId: GOOGLE_CALENDAR_ID, 
        resource: event, 
      }, function(err, event) { 
        if (err) { 
          console.log('There was an error contacting the Calendar service: ' + err); 
          return; 
        } 
        console.log('Event created: %s', event.data); 
        res.jsonp("Event successfully created!"); 
      }); 
    }) 
  })
