const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

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

    if (result.deletedCount > 0) {
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

module.exports = router;
