const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
//const { exec } = require('child_process');
//const { google } = require('googleapis'); 

const app = express();
app.use(express.static('eliza-master'));
// Connection URL for your MongoDB database
//const url = "mongodb+srv://lakshin2563:nirma123@cluster0.qtmkizi.mongodb.net/?retryWrites=true&w=majority";

const url = "mongodb+srv://lakshinpathak2003:nirma123@cluster0.53mqvik.mongodb.net/?retryWrites=true&w=majority";


// Name of the database
const dbName = 'Lakshin25'; // Change this to your database name


//const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });









// const SCOPES = 'https://www.googleapis.com/auth/calendar';
// const GOOGLE_PRIVATE_KEY ="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=\n-----END PRIVATE KEY-----\n";


// //"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzN1kbyerAhuKF\n9iUQAG35UF7A1CEUen2HkiHcqZEuBVYjTPgwZsqvKRliThVXoYcv/k6JhgZ1J2Q5\n9IETG0QAdpgqTqBVQl35k0faORqxfDPA3vhE8lMxEeLA2L05Wp0ooM3eHmbBRQli\nd2sxpjBCi9MHzY2KscMIfwFsVgzX+FY/CN6LqlRQShCDVPOW55yNAdOc65GDi90X\nYrAf+uTH7B9IsrjVp0o9uKj8FVlWVf/2ezZnssZcjmiUnZQxIdT4qvaueOM/CW+v\nUk174SMGuJ0R+/y9ZgicIYfR3f/OtvzR4eoXz7bdb5x2OIIMtBazkw3wHcwuGQlO\n/2m3TkwtAgMBAAECggEADgFRx9+oJkKEOkbJj64Q6g5TUUtiiGioHauYVNe1fjyx\nhhGyRYoK5dRW5P1IIrB/UYtUlN+x6n7ZEMRgP99+GXErJAc/9Vm54VKWp2GWCe+0\nVaq3CSBMywVkTIDDjNNde7rRS73hdtIP0S+W42ri05h8tdvk50VMAgJ22IIC/++J\nIJh5YrdGF/4hSGTPNkS+ASbYSG2MPezzuamRNpMlJKbK3S1Ccb7jOTyjRTDzy6Ew\n2Jt9J7Z2Ja4n7XydsbBy68SyR0L3t8BcrN7KOE3WlSmu8J5h3y6GDqJPeyS2QxuY\nJ93qN5BtwTrSrvCf5ZIig0Vhsm6foQ4N7F3q4puH4QKBgQDroKexJzwahpUqdrlr\npai4zsXA69WKmrzGBrNuGlDKKBN1tD8oULIktzvaWuvif2KAkA1991h4r7d0PXQq\npfLggt7K6BeqdWSZiG60meFQcjLnhGVKkcBYLc+IvXPz8Vip3osKCqpI1jerzg/P\nuff65azPdRvN1+5nUvwcPWOFsQKBgQDCthezJMQo+sGOX624bJyfnk0yPm2XxK9R\nHhDpF1D+hI67ueJgQhxPyCAPGB2xfk2FwiKN6o+lEUUkS1aKPmx7PBvLmu4hrvkD\n+hQ0FSgKnRtCnyR0ddsPxSbHP5eJqXDa/NVCTHIEM4bSQKyEIH944blPD1kqNv3S\nbJZ/Nd3BPQKBgHmnyA0KUdjsNaXoCJIQxQ0uDSIvYWCfxemEWi31vlKx4GI8PwOk\nrmWQiYGSwgl+dbAlMCIii/Y72z9T31+JsN3EFB21OUrUM62lqGrsrE1puOiaDeYz\nXJjqhiV2k6CWso16DlWP7h2PJM06piU9QlCzNsciEsnzu+5zBSHbfD/xAoGAec48\nCT+IzzH+/7fvDx4y5M+87x+Ko5TRL+elIIwLiQ0X1Ww1p43z9Bz3oTmu6ahfirul\nri38aoDhRhEzNAxVBMrXgImNStkQwmIhXWuWvv0FXqn7vjc0MSteVOr9O4saJIRi\nTLVR5jrtrn3y7jz+QXrD2Cd72iLIqmhvxWjHLukCgYEA0H5JrRritGjhGG5LTFID\nUYoidGUSzUdD8l4fbftdTMgHltB6mtp7W3FsH2n784LYeX/1L+0Tbp2NM4KyPio8\nhVgk4+4Gzjq+xZnW/MMkCnpUg1OaZmPXnAntJjxQAHX32J8mEP6QJCsLt2EtlmrM\nSokEQWxpoiZd6s4N416V0iQ=\n-----END PRIVATE KEY-----\n";
// //"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=\n-----END PRIVATE KEY-----\n";
// // "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=".split(String.raw`\n`).join('\n');

// //"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=";
// const GOOGLE_CLIENT_EMAIL = "lakshin2563@gmail.com";
// //"calender-key@event-calender-411413.iam.gserviceaccount.com";
// const GOOGLE_PROJECT_NUMBER = "771496546384";
// const GOOGLE_CALENDAR_ID = "4a80cfaebace8d0965cfa4f5c1215249810dc0cd43372bca80a5964a1100c1a3@group.calendar.google.com";

// const jwtClient = new google.auth.JWT( 
//   GOOGLE_CLIENT_EMAIL, 
//   null, 
//   GOOGLE_PRIVATE_KEY, 
//   SCOPES 
// ); 
  
// const calendar = google.calendar({ 
//   version: 'v3', 
//   project: GOOGLE_PROJECT_NUMBER, 
//   auth: jwtClient 
// });



// // Endpoint to create a Google Calendar event
// router.post('/createGoogleCalendarEvent', async (req, res) => {
//   const {eventData }= req.body;

//   try {
//       // Authenticate with Google Calendar API
//     //  const auth = await jwtClient.authorize();

//     const auth = new google.auth.GoogleAuth({ 
//       keyFile: 'C:\\Users\\laksh\\Downloads\\event-calender-411413-07a49e22134c.json', 
//       scopes: 'https://www.googleapis.com/auth/calendar', 
//     }); 

//       // Create Google Calendar event
//       calendar.events.insert({
//           auth,
//           calendarId: GOOGLE_CALENDAR_ID,
//           resource: eventData,
//       }, (err, event) => {
//           if (err) {
//               console.error('Error creating Google Calendar Event:', err);
//               res.status(500).json({ success: false, message: 'Internal server error' });
//           } else {
//               console.log('Google Calendar Event created:', event.data);
//               res.json({ success: true, message: 'Google Calendar Event created successfully!' });
//           }
//       });
//   } catch (error) {
//       console.error('Error creating Google Calendar Event:', error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });


// Endpoint to get Google Calendar events
// router.get('/getGoogleCalendarEvents', async (req, res) => {
//   try {
//       // Authenticate with Google Calendar API
//       const auth = await jwtClient.authorize();

//       // Fetch Google Calendar events
//       calendar.events.list({
//           auth,
//           calendarId: GOOGLE_CALENDAR_ID,
//           timeMin: (new Date()).toISOString(),
//           maxResults: 10,
//           singleEvents: true,
//           orderBy: 'startTime',
//       }, (error, result) => {
//           if (error) {
//               console.error('Error fetching Google Calendar Events:', error);
//               res.status(500).json({ success: false, message: 'Internal server error' });
//           } else {
//               if (result.data.items.length) {
//                   res.json({ success: true, events: result.data.items });
//               } else {
//                   res.json({ success: true, message: 'No upcoming events found.' });
//               }
//           }
//       });
//   } catch (error) {
//       console.error('Error fetching Google Calendar Events:', error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });



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
   
   // const result2= await db.collection('events').deleteOne({ loggedInUser: username , isApproved: true});
    const result2 = await db.collection('events').deleteMany({ loggedInUser: username, isApproved: true });

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

// router.post('/runcode', async (req, res) => {
//   try {
//     const { codePath } = req.body;
   
//     // Validate the input code (you may want to add more validation)
//     if (!codePath || typeof codePath !== 'string') {
//       return res.status(400).json({ success: false, message: 'Invalid code provided.' });
//     }

//     // Call your code execution function (replace runUserCode with your actual function)
//     const result = await runUserCode(codePath);

//     // Respond with the result of code execution
//     res.json({ success: true, result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });


// async function runUserCode(codePath) {
//   return new Promise((resolve, reject) => {
//       // Execute the Python code using child_process
//       exec(`python "${codePath}"`, (error, stdout, stderr) => {
//           if (error) {
//               console.error(`Error: ${error.message}`);
//               console.error(`stderr: ${stderr}`);
//               reject('Error executing Python code.');
//           } else {
//             console.log("hiiiiiii-route")
//               console.log(`stdout: ${stdout}`);
//               console.error(`stderr: ${stderr}`);
//               resolve(stdout);
//           }
//       });
//   });
// }

module.exports = router;
