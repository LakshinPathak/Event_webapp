const { google } = require('googleapis');

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_PRIVATE_KEY = "f5e87b9500f260cfb3834365785f892775a1a97d";
const GOOGLE_CLIENT_EMAIL = "lakshinpathak2003@gmail.com";
const GOOGLE_PROJECT_NUMBER = "771496546384";
const GOOGLE_CALENDAR_ID = "4a80cfaebace8d0965cfa4f5c1215249810dc0cd43372bca80a5964a1100c1a3@group.calendar.google.com";

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

module.exports = {
  listEvents: (callback) => {
    calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, callback);
  },
  createEvent: (event, callback) => {
    const auth = new google.auth.GoogleAuth({
      keyFile: '<full-path-of-JSON-file>',
      scopes: 'https://www.googleapis.com/auth/calendar',
    });

    auth.getClient().then((a) => {
      calendar.events.insert({
        auth: a,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: event,
      }, callback);
    });
  },
};
