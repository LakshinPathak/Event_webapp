const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { exec } = require('child_process');

const app = express();
app.use(express.static('eliza-master'));
// Connection URL for your MongoDB database
//const url = "mongodb+srv://lakshin2563:nirma123@cluster0.qtmkizi.mongodb.net/?retryWrites=true&w=majority";

const url = "mongodb+srv://lakshinpathak2003:nirma123@cluster0.53mqvik.mongodb.net/?retryWrites=true&w=majority";
// Name of the database
const dbName = 'Lakshin25'; // Change this to your database name

// Create a MongoDB client outside of the route handlers
//const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//"mongodb://localhost:27017"

// Define a route for handling registration requests
router.post('/register', async (req, res) => {
  try {
    const { username,email, password } = req.body;

    // Connect to MongoDB
    await client.connect();
    
  

    // Access the database
    const db = client.db(dbName);


    console.log('');

    // Check if the username already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists. Please choose a different one.' });
    }

    // Insert the new user into the database
    await db.collection('users').insertOne({ username, password });

    // Respond with a success message
    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});



router.get('/getAllEvents', async (req, res) => {
  try {
    const { user } = req.query;

    await client.connect();
    const db = client.db(dbName);

    // Fetch all events for the logged-in user
    const userEvents = await db.collection('events').find({ username: user }).toArray();

    res.json(userEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
  }
});



router.post('/getUnapproved_Events_Admin', async (req, res) => {
  try {
   

    await client.connect();
    const db = client.db(dbName);

      // Fetch unapproved events
      const unapprovedEvents = await db.collection('events').find({ isApproved: false }).toArray();
   
    console.log(unapprovedEvents);
      // Respond with unapproved events
      res.json(unapprovedEvents);
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
      // Close the MongoDB connection
      await client.close();
  }
});


router.get('/getAllEvents_Admin', async (req, res) => {
  try {
    const { user } = req.query;

    await client.connect();
    const db = client.db(dbName);

    // Fetch all events for the logged-in user
    const userEvents = await db.collection('events').find({}).toArray();

    res.json(userEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

// Define a route for handling login requests
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Connect to MongoDB
    await client.connect();
    //console.log('ok');
    // Access the database
    const db = client.db(dbName);

    // Check if the username exists
    const existingUser = await db.collection('users').findOne({ username });
    if (!existingUser) {
      return res.json({ success: false, message: 'Username not found. Please register first.',  admin_var: false });
    }

    // Validate password
    if (existingUser.password !== password) {
      return res.json({ success: false, message: 'Incorrect password.', admin_var: false });
    }

    var is_admin=false;
    if(existingUser.isAdmin == true)
    {
      console.log("hahahah");
      is_admin=true;
    }

    // Respond with a success message
    res.json({ success: true, message: 'Login successful!', admin_var: is_admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' , admin_var: false});
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});


router.route('/addEvent')
  .get(async (req, res) => {
    try {
      const { user } = req.query;

      await client.connect();
      const db = client.db(dbName);
      console.log(user);
      const userEvents = await db.collection('events').find({ username: user }).toArray();
      res.json(userEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  })
  .post(async (req, res) => {
    try {
    
      const { username, eventName, eventDate, eventDetails } = req.body;
      console.log('haha');
      await client.connect();
      const db = client.db(dbName);

      const existingUser = await db.collection('users').findOne({ username });
      if (!existingUser) {
        return res.json({ success: false, message: 'User not found. Please register first.' });
      }

      // Check if the event name already exists for the current user
      const existingEvent = await db.collection('events').findOne({ username, eventName });
      if (existingEvent) {
        return res.json({ success: false, message: 'Event name already exists. Please choose a different one.' });
      }

      await db.collection('events').insertOne({ username, eventName, eventDate, eventDetails, isApproved: false });

      res.json({ success: true, message: 'Event registration successful!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  });


// Route for handling event deletion
router.delete('/deleteEvent', async (req, res) => {
  try {
  //  console.log("delete this fast!!");
    const { user, eventName } = req.query;

    await client.connect();
    const db = client.db(dbName);

    const result = await db.collection('events').deleteOne({ username: user, eventName: eventName });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Event deleted successfully!' });
    } else {
      res.json({ success: false, message: 'Event not found or already deleted.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
  }
});


//Define a route for handling events update requests
router.post('/updateevent', async (req, res) => {
  try {
    const { username, eventDetails, eventDate, eventName } = req.body;

    // Connect to MongoDB
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Update user settings in the collection
    const result = await db.collection('events').updateOne(
      { username: username, 'events.eventName': eventName },
      {
        $set: {
          'events.$.eventDetails': eventDetails,
          'events.$.eventDate': eventDate,
        },
      }
    );

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
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});



// Define a route for handling settings update requests
router.post('/settings', async (req, res) => {
    try {
      const { username, newEmail, newPassword } = req.body;
       
      // Connect to MongoDB
      const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database
      const db = client.db(dbName);
  
      // Update user settings in the collection
      const result = await db.collection('users').updateOne(
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
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  });


// Route for handling user event approval
router.post('/approveUserEvent', async (req, res) => {
  try {
      const { loggedInUser, eventName } = req.body;

      // Connect to MongoDB
      await client.connect();

      // Access the database
      const db = client.db(dbName);

      // Update the isApproved field for the specific user event
      const result = await db.collection('events').updateOne(
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
  } finally {
      // Close the MongoDB connection
      await client.close();
  }
});


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

      // Create a PassThrough stream for the PDF
      const pdfStream = new PassThrough();

      // Create a PDF document with enhanced styling
      const pdfDoc = new pdfkit();
      pdfDoc.pipe(pdfStream);

      // Styling for the invitation text
      pdfDoc.fontSize(18).font('Helvetica-Bold').fillColor('#333').text(`Dear ${guestName},\n\n`, { align: 'center' });

      pdfDoc.fontSize(16).font('Helvetica').fillColor('#555').text(`Welcome to ${eventName}! You are invited to our special event.`, { align: 'left', indent: 20 });

      pdfDoc.fontSize(16).font('Helvetica-Oblique').fillColor('#555').text(`Please let us know if you'll be able to attend by responding to this email.`, { align: 'left', indent: 20 });

      pdfDoc.fontSize(16).font('Helvetica-Bold').fillColor('#333').text('We look forward to seeing you!\n\n', { align: 'center' });

      // End the PDF document
      pdfDoc.end();

      // Email content
      const mailOptions = {
          from: 'your-email@gmail.com', // Replace with your email
          to: guestEmail,
          subject: 'RSVP Invitation',
          html: '<p>Greetings Of the Day!!!!😊</p>',
          attachments: [
              { filename: 'invitation.pdf', content: pdfStream },
              { filename: 'rsvp_img.jpg', path: './rsvp_img.jpg', cid: 'rsvp_image' },
          ],
      };

      // Send email with PDF and image attachments
      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent with PDF and image attachments:', info.response);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}


router.post('/send-email', async (req, res) => {
  try {
      const { guestName, guestEmail,eventName } = req.body;

      // // Connect to MongoDB
      // await client.connect();

      // // Access the database
      // const db = client.db(dbName);

      // Perform any additional logic related to sending email or saving details to the database if needed

      // Call the function to send email
      await sendEmail(guestName, guestEmail,eventName);

      // Respond with a success message
      res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
      // Close the MongoDB connection
      await client.close();
  }
});




router.post('/createadmin', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    // Connect to MongoDB
    await client.connect();

    // Access the database
    const db = client.db(dbName);


      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser) {
          return res.json({ success: false, message: 'Username already exists. Please choose a different one.' });
      }

      // // Create the admin user
      const adminUser = {
          username,
          email,
          password,
          isAdmin: true,
      };

      // // Insert the new admin user into the database
       await db.collection('users').insertOne(adminUser);

      // Respond with a success message
      res.json({ success: true, message: 'Admin user created successfully!' });
  } catch (error) {
      console.error('Error creating admin user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
      // Close the MongoDB connection
      await client.close();
  }
});


router.get('/getAllUsers', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Fetch all users
    const allUsers = await db.collection('users').find().toArray();

    // Respond with the user details
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});



// Route for handling user deletion
router.delete('/deleteUser', async (req, res) => {
  try {
    const { username } = req.query;

    // Connect to MongoDB
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Delete the user
    const result = await db.collection('users').deleteOne({ username });
    const result2= await db.collection('events').deleteOne({ loggedInUser: username });
//&& result2.deletedCount>0 
    if (result.deletedCount > 0 && result2.deletedCount>0 ) {
      res.json({ success: true, message: 'User deleted successfully!' });
    } else {
      res.json({ success: false, message: 'User not found or already deleted.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

router.post('/updateuser', async (req, res) => {
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

router.post('/runcode', async (req, res) => {
  try {
    const { codePath } = req.body;
   
    // Validate the input code (you may want to add more validation)
    if (!codePath || typeof codePath !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid code provided.' });
    }

    // Call your code execution function (replace runUserCode with your actual function)
    const result = await runUserCode(codePath);

    // Respond with the result of code execution
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Function to execute Python code (replace this with your actual function)
// async function runUserCode(codePath) {
//   return new Promise((resolve, reject) => {
//     // Execute the Python code using child_process
//     exec(`python -c "${codePath}"`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         reject('Error executing Python code.');
//       } else {
//         console.log(`stdout: ${stdout}`);
//         console.error(`stderr: ${stderr}`);
//         resolve(stdout);
//       }
//     });
//   });
// }

async function runUserCode(codePath) {
  return new Promise((resolve, reject) => {
      // Execute the Python code using child_process
      exec(`python "${codePath}"`, (error, stdout, stderr) => {
          if (error) {
              console.error(`Error: ${error.message}`);
              console.error(`stderr: ${stderr}`);
              reject('Error executing Python code.');
          } else {
            console.log("hiiiiiii-route")
              console.log(`stdout: ${stdout}`);
              console.error(`stderr: ${stderr}`);
              resolve(stdout);
          }
      });
  });
}

module.exports = router;
