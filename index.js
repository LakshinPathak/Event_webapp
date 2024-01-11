const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const fs = require('fs');
app.use(bodyParser.json({ limit: '100mb' }));
//const { MongoClient } = require('mongodb');
const port = 3000;
app.use(cors());

//const uri = "mongodb+srv://lakshin2563:nirma123@cluster0.qtmkizi.mongodb.net/?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//"mongodb://localhost:27017"
//"mongodb://localhost:27017/Lakshin1234"
const uri = "mongodb+srv://lakshinpathak2003:nirma123@cluster0.53mqvik.mongodb.net/?retryWrites=true&w=majority";
//mongodb+srv://lakshinpathak2003:<password>@cluster0.53mqvik.mongodb.net/
app.use(express.static('public'));
app.use(express.json());


async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

// Mongoose model for user
const User = mongoose.model('User', {
    username: String,
    password: String,
    email: String, 
    isAdmin: Boolean,
});




const Event = mongoose.model('Event', {
    eventName: String,
    eventDetails: String,
    eventDate: String,
    loggedInUser: String,
    isApproved: Boolean,
});

// const nodemailer = require("nodemailer");

// const config = {
// service: "gmail",
// host: "smtp.gmail.com",
// port: 587,
// secure: false,
// auth: {
// user: "lakshin2563@gmail.com", //Lakshin user
// pass: "ypoe jrma lcfz pmej", // no spaces
// },

// };


const nodemailer = require("nodemailer");

// Function to send registration email
async function sendRegistrationEmail(email, username) {
    try {
        // Create a transporter with your SMTP server details
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "lakshin2563@gmail.com",
                pass: "ypoe jrma lcfz pmej",
            },
        });

        // Email content
        const mailOptions = {
            from: "lakshinpathak2003@gmail.com",
            to: email,
            subject: "Welcome to Event Management Dashboard",
            text: `Dear ${username},\n\nThank you for registering on our Event Management Dashboard!\n\nWe're excited to have you on board.\n\nBest regards,\nThe Event Management Team`,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending registration email:", error);
    }
}




// async function sendEmail(guestName, guestEmail, eventName) {
//     try {
//         // Create a transporter with your SMTP server details
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'lakshin2563@gmail.com', // Replace with your email
//                 pass: 'ypoe jrma lcfz pmej', // Replace with your email password
//             },
//         });

//         // HTML content for the invitation card
//     //     const invitationHTML = `
//     //     <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif;">
//     //         <h2 style="color: #333; text-align: center;">Event Invitation</h2>
//     //         <p style="color: #555; font-size: 16px;">Dear ${guestName},</p>
//     //         <p style="color: #555; font-size: 16px;">
//     //             Welcome to <strong>${eventName}</strong>! You are invited to our special event.
//     //         </p>
//     //         <p style="color: #555; font-size: 16px;">
//     //             Please let us know if you'll be able to attend by responding to this email.
//     //         </p>
//     //         <p style="color: #555; font-size: 16px;">We look forward to seeing you!</p>
//     //     </div>
//     // `;
  
//     const url_img = "./rsvp_img.jpg";
//     const invitationHTML = `
//       <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif; width: 80%; margin: auto; border: 2px solid #333;">
//           <h2 style="color: #333; text-align: center;">Event Invitation</h2>
//           <img src="${url_img}" alt="RSVP Image" style="display: block; margin: auto; width: 50%; border-radius: 10px; margin-bottom: 20px;">
//           <p style="color: #555; font-size: 16px; text-align: center;">Dear ${guestName},</p>
//           <p style="color: #555; font-size: 16px; text-align: center;">
//               Welcome to <strong style="color: #0066cc;">${eventName}</strong>! You are invited to our special event.
//           </p>
//           <p style="color: #555; font-size: 16px; text-align: center;">
//               Please let us know if you'll be able to attend by responding to this email.
//           </p>
//           <p style="color: #555; font-size: 16px; text-align: center;">We look forward to seeing you!</p>
//       </div>
//     `;
    


//         // Options for html-pdf to generate PDF
//         const pdfOptions = { format: 'Letter' };

//         // Generate PDF from HTML content
//         pdf.create(invitationHTML, pdfOptions).toFile('./invitation.pdf', async (err, res) => {
//             if (err) {
//                 console.error('Error generating PDF:', err);
//                 return;
//             }

//             // Read the generated PDF file
//             const pdfContent = fs.readFileSync(res.filename);

//             // Email content
//             const mailOptions = {
//                 from: 'lakshin2563@gmail.com', // Replace with your email
//                 to: guestEmail,
//                 subject: 'RSVP Invitation',
//                 html: `
//                     <p>Greetings Of the Day!!!!😊</p>
//                 `,
//                 attachments: [{ filename: 'invitation.pdf', content: pdfContent }],
//             };

//             // Send email with PDF attachment
//             const info = await transporter.sendMail(mailOptions);

//             console.log('Email sent with PDF attachment:', info.response);
//         });
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// }



async function sendEmail(guestName, guestEmail, eventName) {
    try {
        // Create a transporter with your SMTP server details
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'lakshin2563@gmail.com', // Replace with your email
                pass: 'ypoe jrma lcfz pmej', // Replace with your email password
            },
        });

        // HTML content for the invitation card
       
        const invitationHTML = `
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif; width: 80%; margin: auto; border: 2px solid #333;">
            <h2 style="color: #333; text-align: center;">Event Invitation</h2>
            <p style="color: #555; font-size: 16px; text-align: center;">Dear ${guestName},</p>
            <p style="color: #555; font-size: 16px; text-align: center;">
                Welcome to <strong style="color: #0066cc;">${eventName}</strong>! You are invited to our special event.
            </p>
            <p style="color: #555; font-size: 16px; text-align: center;">
                Please let us know if you'll be able to attend by responding to this email.
            </p>
            <p style="color: #555; font-size: 16px; text-align: center;">We look forward to seeing you!</p>
        </div>
        `;

        // Options for html-pdf to generate PDF
        const pdfOptions = { format: 'Letter' };

        // Generate PDF from HTML content
        pdf.create(invitationHTML, pdfOptions).toFile('./invitation.pdf', async (err, res) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return;
            }

            // Read the generated PDF file
            const pdfContent = fs.readFileSync(res.filename);

            // Email content
            const mailOptions = {
                from: 'lakshin2563@gmail.com', // Replace with your email
                to: guestEmail,
                subject: 'RSVP Invitation',
                html: `
                    <p>Greetings Of the Day!!!!😊</p>
                `,
                attachments: [
                    { filename: 'invitation.pdf', content: pdfContent },
                    { filename: 'rsvp_img.jpg', path: './rsvp_img.jpg', cid: 'rsvp_image' },
                ],
            };

            // Send email with PDF and image attachments
            const info = await transporter.sendMail(mailOptions);

            console.log('Email sent with PDF and image attachments:', info.response);
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}



module.exports = {
    sendRegistrationEmail,
    sendEmail,
};



// Registration endpoint
app.post('/register', async (req, res) => {
    const { username,email, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: 'Username already exists. Please choose a different one.' });
        }

        // Create a new user
        const newUser = new User({ username, email, password,isAdmin: false });
        await newUser.save();

       
        
        await sendRegistrationEmail(email, username);

        return res.json({ success: true, message: 'Registration successful.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/send-email', async (req, res) => {
    const { guestName, guestEmail,eventName } = req.body;

    try {
        // Call the function to send email
        await sendEmail(guestName, guestEmail,eventName);

        // Respond with a success message
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Update Event endpoint
app.post('/updateevent', async (req, res) => {
    const { username, eventDetails, eventDate, eventName } = req.body;

    try {
        console.log(username+" "+eventDetails);

        // Update user settings in the collection
        const result = await Event.updateOne(
            { loggedInUser: username, eventName: eventName },
            {
                //eventName
                $set: {
                    eventDetails: eventDetails,
                    eventDate: eventDate,
                },
            }
        );
            console.log(result);

        if (result.modifiedCount > 0) {
            // Event updated successfully
            res.json({ success: true, message: 'Event updated successfully!' });
        } else {
            // No matching user or event found or no changes made
            res.json({ success: false, message: 'No matching user or event found or no changes made.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.json({ success: false, message: 'Username not found. Please register first.' , admin_var: false});
        }

        // Validate password
        if (existingUser.password !== password) {
            return res.json({ success: false, message: 'Incorrect password.' , admin_var: false });
        }
        var is_admin=false;
        if(existingUser.isAdmin == true)
        {
            console.log("hahahah1");
          is_admin=true;
        }

        return res.json({ success: true, message: 'Login successful.' , admin_var: is_admin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' , admin_var: false});
    }
});


app.post('/getUnapproved_Events_Admin', async (req, res) => {
    try {
       
    
        // Fetch unapproved events
        const unapprovedEvents = await Event.find({ isApproved: false }).exec();
        console.log(unapprovedEvents);
        // Respond with unapproved events
        res.json(unapprovedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// Settings update endpoint
app.post('/settings', async (req, res) => {
    const { username, newEmail, newPassword } = req.body;

    try {
        // Update user settings in the collection
        const result = await User.updateOne(
            { username: username },
            { $set: { email: newEmail, password: newPassword } }
        );

        if (result.modifiedCount > 0) {
            // Settings updated successfully
            res.json({ success: true, message: 'Settings updated successfully!' });
        } else {
            // No matching user found or no changes made
            res.json({ success: false, message: 'No matching user found or no changes made.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Add Event endpoint
app.post('/addEvent', async (req, res) => {
    const { eventName, eventDetails, eventDate, loggedInUser } = req.body;

    try {
        // Check if an event with the same name already exists for the loggedInUser
        const existingEvent = await Event.findOne({ eventName, loggedInUser });
        if (existingEvent) {
            return res.json({ success: false, message: 'Event with the same name already exists for the user.' });
        }
        let flag = false;

        // Create a new event
        const newEvent = new Event({
            eventName,
            eventDetails,
            eventDate,
            loggedInUser,
            isApproved: flag,
        });

        // Save the new event
        await newEvent.save();


        return res.json({ success: true, message: 'Event added successfully', event: newEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Delete Event endpoint
app.delete('/deleteEvent', async (req, res) => {
   //console.log("haha2");
    const { eventName, loggedInUser } = req.body;

    try {
      
        // Find the event in the collection and delete it
        const result = await Event.deleteOne({ eventName, loggedInUser });
      
        if (result.deletedCount > 0) {
            // Event deleted successfully
            
            res.json({ success: true, message: 'Event deleted successfully' });
        } else {
            // No matching event found
            res.json({ success: false, message: 'No matching event found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/getAllEvents', async (req, res) => {
    try {
        const { loggedInUser } = req.query;

       
        // Fetch all events for the logged-in user
        const userEvents = await Event.find({ loggedInUser }).exec();
      
        res.json(userEvents);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/getAllEvents_Admin', async (req, res) => {
    try {
        const { loggedInUser } = req.query;

       
        // Fetch all events for the logged-in user
        const userEvents = await Event.find({ }).exec();
      
        res.json(userEvents);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Approve User Event endpoint
app.post('/approveUserEvent', async (req, res) => {
    const { loggedInUser, eventName } = req.body;
    
    try {
        // Check if the user has admin privileges (you may want to implement proper admin authentication)
        const isAdmin = true; // Replace with your admin authentication logic
       
        if (!isAdmin) {
            return res.status(403).json({ success: false, message: 'Unauthorized request' });
        }

        // Update the isApproved field for the specific user event
        const result = await Event.updateOne(
            { loggedInUser, eventName },
            { $set: { isApproved: true } }
        );
       
        if (result.modifiedCount > 0) {
            // Event approval successful
          
            res.json({ success: true, message: 'Event approval successful!' });
        } else {
            // No matching user or event found or no changes made
            
            res.json({ success: false, message: 'No matching user or event found or no changes made.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Endpoint for creating an admin user

app.post('/createadmin', async (req, res) => {
    try {
        const { username, email, password } = req.body;


          const authorizationHeader = req.headers['authorization'];
      
        const isAdminRequest = authorizationHeader === 'mishra'; 
        console.log(authorizationHeader);
        if (!isAdminRequest) {
            return res.status(403).json({ success: false, message: 'Unauthorized request' });
        }
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: 'Username already exists. Please choose a different one.' });
        }

        // Create the admin user
        const adminUser = new User({
            username,
            email,
            password,
            isAdmin: true,
        });

        // Save the new admin user to the database
        await adminUser.save();

        // Respond with a success message
        res.json({ success: true, message: 'Admin user created successfully!' });
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Endpoint for fetching all user details
app.get('/getAllUsers', async (req, res) => {
    try {
        // Connect to MongoDB
        await connect();

        // Access the database
        const db = mongoose.connection;

        // Fetch all users
        const allUsers = await User.find().exec();

        // Respond with the user details
        res.json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Endpoint for deleting a user
app.delete('/deleteUser', async (req, res) => {
    const { username } = req.body;

    try {

        // Check if the username exists
        const existingUser = await User.findOne({ username });
        

        if (!existingUser) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Delete the user
        await User.deleteOne({ username });

        return res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});




// Update User endpoint
app.post('/updateuser', async (req, res) => {
    const { username, newEmail, newPassword } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Update user details
        user.email = newEmail || user.email; // Update email if provided, otherwise keep the existing one
        user.password = newPassword || user.password; // Update password if provided, otherwise keep the existing one

        // Save the updated user details
        await user.save();

        return res.json({ success: true, message: 'User details updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});





app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});
