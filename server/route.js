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
// async function sendEmail(guestName, guestEmail, eventName) {
//   try {
//       // Create a transporter with your SMTP server details
//       const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//               user: 'lakshin2563@gmail.com', // Replace with your email
//               pass: 'ypoe jrma lcfz pmej', // Replace with your email password
//           },
//       });

//       // HTML content for the invitation card
//   //     const invitationHTML = `
//   //     <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif;">
//   //         <h2 style="color: #333; text-align: center;">Event Invitation</h2>
//   //         <p style="color: #555; font-size: 16px;">Dear ${guestName},</p>
//   //         <p style="color: #555; font-size: 16px;">
//   //             Welcome to <strong>${eventName}</strong>! You are invited to our special event.
//   //         </p>
//   //         <p style="color: #555; font-size: 16px;">
//   //             Please let us know if you'll be able to attend by responding to this email.
//   //         </p>
//   //         <p style="color: #555; font-size: 16px;">We look forward to seeing you!</p>
//   //     </div>
//   // `;
//   const invitationHTML = `
//     <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif; width: 80%; margin: auto; border: 2px solid #333;">
//         <h2 style="color: #333; text-align: center;">Event Invitation</h2>
//         <img src="C://lakshin//CN//event_app//rsvp_img.jpg" style="display: block; margin: auto; width: 50%; border-radius: 10px; margin-bottom: 20px;">
//         <p style="color: #555; font-size: 16px; text-align: center;">Dear ${guestName},</p>
//         <p style="color: #555; font-size: 16px; text-align: center;">
//             Welcome to <strong style="color: #0066cc;">${eventName}</strong>! You are invited to our special event.
//         </p>
//         <p style="color: #555; font-size: 16px; text-align: center;">
//             Please let us know if you'll be able to attend by responding to this email.
//         </p>
//         <p style="color: #555; font-size: 16px; text-align: center;">We look forward to seeing you!</p>
//     </div>
// `;


//       // Options for html-pdf to generate PDF
//       const pdfOptions = { format: 'Letter' };

//       // Generate PDF from HTML content
//       pdf.create(invitationHTML, pdfOptions).toFile('./invitation.pdf', async (err, res) => {
//           if (err) {
//               console.error('Error generating PDF:', err);
//               return;
//           }

//           // Read the generated PDF file
//           const pdfContent = fs.readFileSync(res.filename);

//           // Email content
//           const mailOptions = {
//               from: 'lakshin2563@gmail.com', // Replace with your email
//               to: guestEmail,
//               subject: 'RSVP Invitation',
//               html: `
//               <p>Greetings Of the Day!!!!😊</p>
//               `,
//               attachments: [{ filename: 'invitation.pdf', content: pdfContent }],
//           };

//           // Send email with PDF attachment
//           const info = await transporter.sendMail(mailOptions);

//           console.log('Email sent with PDF attachment:', info.response);
//       });
//   } catch (error) {
//       console.error('Error sending email:', error);
//   }
// }


// async function sendEmail(guestName, guestEmail, eventName) {
//   try {
//     // Create a transporter with your SMTP server details
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'lakshin2563@gmail.com', // Replace with your email
//         pass: 'ypoe jrma lcfz pmej', // Replace with your email password
//       },
//     });

//     // Create a PDF document
//     const pdfDoc = new pdfkit();
//     pdfDoc.pipe(fs.createWriteStream('./invitation.pdf'));

//     // Add content to the PDF with styling
//     pdfDoc
//       .font('Helvetica-Bold')
//       .fontSize(20)
//       .text('Event Invitation', { align: 'center', color: '#333', margin: 10 })
//       .rect(50, 80, 500, 300) // Rectangle for the content
//       .lineWidth(2)
//       .stroke('#333') // Border color
//       .image('./rsvp_img.jpg', 80, 100, { width: 300, align: 'center' })
//       .fontSize(16)
//       .text(`Dear ${guestName},`, { align: 'center', color: '#555', margin: [0, 10] })
//       .text(`Welcome to ${eventName}! You are invited to our special event.`, { align: 'center', color: '#555', margin: [0, 10] })
//       .text('Please let us know if you\'ll be able to attend by responding to this email.', { align: 'center', color: '#555', margin: [0, 10] })
//       .text('We look forward to seeing you!', { align: 'center', color: '#555', margin: [0, 10] });

//     // Finalize the PDF
//     pdfDoc.end();

//     // Read the generated PDF file
//     const pdfContent = fs.readFileSync('./invitation.pdf');

//     // Email content
//     const mailOptions = {
//       from: 'lakshin2563@gmail.com', // Replace with your email
//       to: guestEmail,
//       subject: 'RSVP Invitation',
//       html: `
//       <p>Greetings Of the Day!!!!😊</p>
//       `,
//       attachments: [{ filename: 'invitation.pdf', content: pdfContent }],
//     };

//     // Send email with PDF attachment
//     const info = await transporter.sendMail(mailOptions);

//     console.log('Email sent with PDF attachment:', info.response);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

// async function sendEmail(guestName, guestEmail, eventName) {
//   try {
//     // Create a transporter with your SMTP server details
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'lakshin2563@gmail.com', // Replace with your email
//         pass: 'ypoe jrma lcfz pmej', // Replace with your email password
//       },
//     });

//     // Create a PDF document
//     const pdfDoc = new pdfkit();
//     pdfDoc.pipe(fs.createWriteStream('./invitation.pdf'));

//     // Add content to the PDF with styling
//     pdfDoc
//       .font('Helvetica-Bold')
//       .fontSize(20)
//       .text('Event Invitation', { align: 'center', color: '#333', margin: 10 })
//       .moveDown(1) // Add some space
//       .image('./rsvp_img.jpg', { width: 300, align: 'center' })
//       .moveDown(2) // Add some space after the image
//       .font('Helvetica')
//       .fontSize(16)
//       .text(`Dear ${guestName},`, { align: 'center', color: '#555', margin: [0, 10] })
//       .text(`Welcome to ${eventName}! You are invited to our special event.`, { align: 'center', color: '#555', margin: [0, 10] })
//       .text('Please let us know if you\'ll be able to attend by responding to this email.', { align: 'center', color: '#555', margin: [0, 10] })
//       .text('We look forward to seeing you!', { align: 'center', color: '#555', margin: [0, 10] })
//       .moveDown(2) // Add some space before the table

//     // Create a table for colorful content
//     const table = {
//       headers: ['Header 1', 'Header 2', 'Header 3'],
//       rows: [
//         ['Content 1', 'Content 2', 'Content 3'],
//         ['Content 4', 'Content 5', 'Content 6'],
//       ],
//       // Customize the style of the table
//       headerStyles: { fillColor: '#337ab7', color: 'white' },
//       bodyStyles: { fillColor: '#d9edf7' },
//     };

//     pdfDoc.moveDown().table(table, 100, pdfDoc.y + 30, { width: 400 });

//     // Finalize the PDF
//     pdfDoc.end();

//     // Read the generated PDF file
//     const pdfContent = fs.readFileSync('./invitation.pdf');

//     // Email content
//     const mailOptions = {
//       from: 'lakshin2563@gmail.com', // Replace with your email
//       to: guestEmail,
//       subject: 'RSVP Invitation',
//       html: `
//       <p>Greetings Of the Day!!!!😊</p>
//       `,
//       attachments: [{ filename: 'invitation.pdf', content: pdfContent }],
//     };

//     // Send email with PDF attachment
//     const info = await transporter.sendMail(mailOptions);

//     console.log('Email sent with PDF attachment:', info.response);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }


// async function sendEmail(guestName, guestEmail, eventName) {
//   try {
//       // Create a transporter with your SMTP server details
//       const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//               user: 'lakshin2563@gmail.com', // Replace with your email
//               pass: 'ypoe jrma lcfz pmej', // Replace with your email password
//           },
//       });

//       // HTML content for the invitation card
//   //     const invitationHTML = `
//   //     <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif;">
//   //         <h2 style="color: #333; text-align: center;">Event Invitation</h2>
//   //         <p style="color: #555; font-size: 16px;">Dear ${guestName},</p>
//   //         <p style="color: #555; font-size: 16px;">
//   //             Welcome to <strong>${eventName}</strong>! You are invited to our special event.
//   //         </p>
//   //         <p style="color: #555; font-size: 16px;">
//   //             Please let us know if you'll be able to attend by responding to this email.
//   //         </p>
//   //         <p style="color: #555; font-size: 16px;">We look forward to seeing you!</p>
//   //     </div>
//   // `;

//   const url_img = "./rsvp_img.jpg";
//   const invitationHTML = `
//     <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif; width: 80%; margin: auto; border: 2px solid #333;">
//         <h2 style="color: #333; text-align: center;">Event Invitation</h2>
//         <img src="${url_img}" alt="RSVP Image" style="display: block; margin: auto; width: 50%; border-radius: 10px; margin-bottom: 20px;">
//         <p style="color: #555; font-size: 16px; text-align: center;">Dear ${guestName},</p>
//         <p style="color: #555; font-size: 16px; text-align: center;">
//             Welcome to <strong style="color: #0066cc;">${eventName}</strong>! You are invited to our special event.
//         </p>
//         <p style="color: #555; font-size: 16px; text-align: center;">
//             Please let us know if you'll be able to attend by responding to this email.
//         </p>
//         <p style="color: #555; font-size: 16px; text-align: center;">We look forward to seeing you!</p>
//     </div>
//   `;
  


//       // Options for html-pdf to generate PDF
//       const pdfOptions = { format: 'Letter' };

//       // Generate PDF from HTML content
//       pdf.create(invitationHTML, pdfOptions).toFile('./invitation.pdf', async (err, res) => {
//           if (err) {
//               console.error('Error generating PDF:', err);
//               return;
//           }

//           // Read the generated PDF file
//           const pdfContent = fs.readFileSync(res.filename);

//           // Email content
//           const mailOptions = {
//               from: 'lakshin2563@gmail.com', // Replace with your email
//               to: guestEmail,
//               subject: 'RSVP Invitation',
//               html: `
//                   <p>Greetings Of the Day!!!!😊</p>
//               `,
//               attachments: [{ filename: 'invitation.pdf', content: pdfContent }],
//           };

//           // Send email with PDF attachment
//           const info = await transporter.sendMail(mailOptions);

//           console.log('Email sent with PDF attachment:', info.response);
//       });
//   } catch (error) {
//       console.error('Error sending email:', error);
//   }
// }


// async function sendEmail(guestName, guestEmail, eventName) {
//   try {
//       // Create a transporter with your SMTP server details
//       const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//               user: 'lakshin2563@gmail.com', // Replace with your email
//               pass: 'ypoe jrma lcfz pmej', // Replace with your email password
//           },
//       });

//       // HTML content for the invitation card
     
//       const invitationHTML = `
//       <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif; width: 80%; margin: auto; border: 2px solid #333;">
//           <h2 style="color: #333; text-align: center;">Event Invitation</h2>
//            <p style="color: #555; font-size: 16px; text-align: center;">Dear ${guestName},</p>
//           <p style="color: #555; font-size: 16px; text-align: center;">
//               Welcome to <strong style="color: #0066cc;">${eventName}</strong>! You are invited to our special event.
//           </p>
//           <p style="color: #555; font-size: 16px; text-align: center;">
//               Please let us know if you'll be able to attend by responding to this email.
//           </p>
//           <p style="color: #555; font-size: 16px; text-align: center;">We look forward to seeing you!</p>
//       </div>
//       `;

//       // Options for html-pdf to generate PDF
//       const pdfOptions = { format: 'Letter' };

//       // Generate PDF from HTML content
//       pdf.create(invitationHTML, pdfOptions).toFile('./invitation.pdf', async (err, res) => {
//           if (err) {
//               console.error('Error generating PDF:', err);
//               return;
//           }

//           // Read the generated PDF file
//           const pdfContent = fs.readFileSync(res.filename);

//           // Email content
//           const mailOptions = {
//               from: 'lakshin2563@gmail.com', // Replace with your email
//               to: guestEmail,
//               subject: 'RSVP Invitation',
//               html: `
//                   <p>Greetings Of the Day!!!!😊</p>
//               `,
//               attachments: [
//                   { filename: 'invitation.pdf', content: pdfContent },
//                   { filename: 'rsvp_img.jpg', path: './rsvp_img.jpg', cid: 'rsvp_image' },
//               ],
//           };

//           // Send email with PDF and image attachments
//           const info = await transporter.sendMail(mailOptions);

//           console.log('Email sent with PDF and image attachments:', info.response);
//       });
//   } catch (error) {
//       console.error('Error sending email:', error);
//   }
// }


// async function sendEmail(guestName, guestEmail, eventName) {
//   try {
//       // Create a transporter with your SMTP server details
//       const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: 'lakshin2563@gmail.com', // Replace with your email
//             pass: 'ypoe jrma lcfz pmej', // Replace with your email password
//           },
//       });

//       // Create a PassThrough stream for the PDF
//       const pdfStream = new PassThrough();

//       // Create a PDF document
//       const pdfDoc = new pdfkit();
//       pdfDoc.pipe(pdfStream);
//       pdfDoc.text(`Dear ${guestName},\n\n`);
//       pdfDoc.text(`Welcome to ${eventName}! You are invited to our special event.\n`);
//       pdfDoc.text(`Please let us know if you'll be able to attend by responding to this email.\n`);
//       pdfDoc.text(`We look forward to seeing you!\n`);
//       pdfDoc.end();

//       // Email content
//       const mailOptions = {
//           from: 'your-email@gmail.com', // Replace with your email
//           to: guestEmail,
//           subject: 'RSVP Invitation',
//           html: '<p>Greetings Of the Day!!!!😊</p>',
//           attachments: [
//               { filename: 'invitation.pdf', content: pdfStream },
//               { filename: 'rsvp_img.jpg', path: './rsvp_img.jpg', cid: 'rsvp_image' },
//           ],
//       };

//       // Send email with PDF and image attachments
//       const info = await transporter.sendMail(mailOptions);

//       console.log('Email sent with PDF and image attachments:', info.response);
//   } catch (error) {
//       console.error('Error sending email:', error);
//   }
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
