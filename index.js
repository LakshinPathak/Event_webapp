const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const pdfkit = require('pdfkit');
const { PassThrough } = require('stream');
const fs = require('fs');
// const { exec } = require('child_process');

const path = require('path');
//const { google } = require('googleapis'); 
app.use(bodyParser.json({ limit: '100mb' }));
//const { MongoClient } = require('mongodb');
const port = 3000;
app.use(cors());

//const uri = "mongodb+srv://lakshin2563:nirma123@cluster0.qtmkizi.mongodb.net/?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const uri = "mongodb+srv://lakshinpathak2003:nirma123@cluster0.53mqvik.mongodb.net/?retryWrites=true&w=majority";
//mongodb+srv://lakshinpathak2003:<password>@cluster0.53mqvik.mongodb.net/


app.use(express.static('public'));
app.use(express.static('eliza-master'));
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


// const SCOPES = 'https://www.googleapis.com/auth/calendar';
// const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=\n-----END PRIVATE KEY-----\n";
// //"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzN1kbyerAhuKF\n9iUQAG35UF7A1CEUen2HkiHcqZEuBVYjTPgwZsqvKRliThVXoYcv/k6JhgZ1J2Q5\n9IETG0QAdpgqTqBVQl35k0faORqxfDPA3vhE8lMxEeLA2L05Wp0ooM3eHmbBRQli\nd2sxpjBCi9MHzY2KscMIfwFsVgzX+FY/CN6LqlRQShCDVPOW55yNAdOc65GDi90X\nYrAf+uTH7B9IsrjVp0o9uKj8FVlWVf/2ezZnssZcjmiUnZQxIdT4qvaueOM/CW+v\nUk174SMGuJ0R+/y9ZgicIYfR3f/OtvzR4eoXz7bdb5x2OIIMtBazkw3wHcwuGQlO\n/2m3TkwtAgMBAAECggEADgFRx9+oJkKEOkbJj64Q6g5TUUtiiGioHauYVNe1fjyx\nhhGyRYoK5dRW5P1IIrB/UYtUlN+x6n7ZEMRgP99+GXErJAc/9Vm54VKWp2GWCe+0\nVaq3CSBMywVkTIDDjNNde7rRS73hdtIP0S+W42ri05h8tdvk50VMAgJ22IIC/++J\nIJh5YrdGF/4hSGTPNkS+ASbYSG2MPezzuamRNpMlJKbK3S1Ccb7jOTyjRTDzy6Ew\n2Jt9J7Z2Ja4n7XydsbBy68SyR0L3t8BcrN7KOE3WlSmu8J5h3y6GDqJPeyS2QxuY\nJ93qN5BtwTrSrvCf5ZIig0Vhsm6foQ4N7F3q4puH4QKBgQDroKexJzwahpUqdrlr\npai4zsXA69WKmrzGBrNuGlDKKBN1tD8oULIktzvaWuvif2KAkA1991h4r7d0PXQq\npfLggt7K6BeqdWSZiG60meFQcjLnhGVKkcBYLc+IvXPz8Vip3osKCqpI1jerzg/P\nuff65azPdRvN1+5nUvwcPWOFsQKBgQDCthezJMQo+sGOX624bJyfnk0yPm2XxK9R\nHhDpF1D+hI67ueJgQhxPyCAPGB2xfk2FwiKN6o+lEUUkS1aKPmx7PBvLmu4hrvkD\n+hQ0FSgKnRtCnyR0ddsPxSbHP5eJqXDa/NVCTHIEM4bSQKyEIH944blPD1kqNv3S\nbJZ/Nd3BPQKBgHmnyA0KUdjsNaXoCJIQxQ0uDSIvYWCfxemEWi31vlKx4GI8PwOk\nrmWQiYGSwgl+dbAlMCIii/Y72z9T31+JsN3EFB21OUrUM62lqGrsrE1puOiaDeYz\nXJjqhiV2k6CWso16DlWP7h2PJM06piU9QlCzNsciEsnzu+5zBSHbfD/xAoGAec48\nCT+IzzH+/7fvDx4y5M+87x+Ko5TRL+elIIwLiQ0X1Ww1p43z9Bz3oTmu6ahfirul\nri38aoDhRhEzNAxVBMrXgImNStkQwmIhXWuWvv0FXqn7vjc0MSteVOr9O4saJIRi\nTLVR5jrtrn3y7jz+QXrD2Cd72iLIqmhvxWjHLukCgYEA0H5JrRritGjhGG5LTFID\nUYoidGUSzUdD8l4fbftdTMgHltB6mtp7W3FsH2n784LYeX/1L+0Tbp2NM4KyPio8\nhVgk4+4Gzjq+xZnW/MMkCnpUg1OaZmPXnAntJjxQAHX32J8mEP6QJCsLt2EtlmrM\nSokEQWxpoiZd6s4N416V0iQ=\n-----END PRIVATE KEY-----\n";
// // "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=\n-----END PRIVATE KEY-----\n";
// //"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=".split(String.raw`\n`).join('\n');

//  //"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5yPR8+2HhkQ74\nnL2LKcxDDRU+v/+pQJbfkdc8CEV5lRhA5rkNpbNN36wbwMerpeEfNveaKgivibox\nGiD3opP+/qxmHl24Y7aGVN63VIvHfScr6QBLOBAFf76bmYKdbX1OIpaKhswdC7ch\nfGuyunVisKLvxR1dXUbBTpxoIzEfHx7kR3jqNqtgQzVl+XB4Zu4vWjoeQqw4sKDq\nACeGT2WvHt340tdn37CoZDBj+qh24EY9PqzU0313sI3hnsmpdBxdxU0dV0Ocpams\nYfoJ6tLoSifOpsvdQwwtIBiyDk4Bz91tMhXMwko2V2TDP+t4Xv7IrMsQ9l6Vhjbd\nM/XHEihJAgMBAAECggEAAtaO5EE42mfLY+viZLeuPvtPrvDi7cnRTuKyTYtOIxCD\n2YCiJL26cqmZ6PtLHD8BTzyZOrnX/nUrACix2+aYE9tTHzo+h0cVWOb/V1X2JAWF\nmCuhOATyuwrGYCfPsX+khubgstwNToeedBIBA9l1BUgagnGEmdJczC4wayeCeW21\nw7E0HGa24PwZAe2sjyldUTCWQJTtumFoB1poyh4lL+E888L8NB8AMrxHeTMbAIUT\ny6I7M4pmkailENEMEgWsETSI7AQZrvQYSaTnkZVshW8W56knbOmcTOIShqu7MPXx\niAa+bfE5gHCQqEzBWYDzksG7y3C1eINl8eXUYVU82wKBgQDqc2MIIxa3d+/KYGko\nxnf2v6DofcRAcGBdPIzjzEg0E2UIREq84ElOGWX9NMxwZwdwzKLGc6rFCy0xLysk\niGphNjdmBRepMvebmejizQVAnyC7jmiM3LpymuJVM4XGpAxvn9L0619LTuDKWGqh\ni0SuqssLUB9YhsR+YKwUcAIxywKBgQDK3Hc4lPd688u6SFctL80Bm6TVvSvgxa31\nqi9BCO3CPmn4kOCV1f40Fpsa0BT7Fm6t9xnq9IuFZW06p/Bp6pjF98wXSA8Ywh/H\n0ihR4b2yoDMuQ7kA5GWvTrnYRZLrgnb55FB6wSvoBPrRmSMya67w8UTHFOEwcoON\nn5OzBDo7uwKBgHFXlSHC7OGHfwpkb5JB2I8WdzDOVEkeysdoVWhvQtzCH47OjR8g\ngu/ZwX+Wvdr9RBCZLXwpQP5/d7qWZhIETQFwF3ofrh+jPycfUgILQaXLCCUEJLEs\nqIptLEwqW1r7xfNU3cR/4ZLjsDLCadJtJKgYc46ljnHavTWngKlkuPrfAoGBAJmO\n42xgTymyLFA5fEwHOA70i4UD6pf9613f0l9Pa/KynjL7MBYb4434YracNpWOeH+V\nYfgZ3xc+HL3e7Dywya5pkgM5l7vtDnOK4NyCnb7+R1/JAdzsBxD57fIJUFqX6onk\nywrw+NRsGJTab+s12jom2CI+6utqc6yb1AkZtR8LAoGAKX+BDovZ9ZNLF9ySGPq/\ndmfMssAj8lDQ6TcaNvco3kErsatHBUn1z+2Iak6jlj95lM1YqvqBusvEaHR2ZLGi\nLQ1lYQihvacruxST2cDXuPvgL5jD2ACZGijIzUzqap7HcTaf2b/lnPRjd1WWl/o+\n1eJmJpG8zG5RfINeaGZMMTc=".split(String.raw`\n`).join('\n');

//  const GOOGLE_CLIENT_EMAIL ="lakshin2563@gmail.com";
//  // "calender-key@event-calender-411413.iam.gserviceaccount.com";
// const GOOGLE_PROJECT_NUMBER = "771496546384";

// const GOOGLE_CALENDAR_ID = "4a80cfaebace8d0965cfa4f5c1215249810dc0cd43372bca80a5964a1100c1a3@group.calendar.google.com";

 
// const jwtClient = new google.auth.JWT( 
//     GOOGLE_CLIENT_EMAIL, 
//     null, 
//     GOOGLE_PRIVATE_KEY, 
//     SCOPES 
//   ); 
    
//   const calendar = google.calendar({ 
//     version: 'v3', 
//     project: GOOGLE_PROJECT_NUMBER, 
//     auth: jwtClient 
//   });

// // Endpoint to create a Google Calendar event
// app.post('/createGoogleCalendarEvent', async (req, res) => {
//     const { eventData } = req.body;

//     try {
//         // Authenticate with Google Calendar API
//        // const auth = await jwtClient.authorize();

//        const auth = new google.auth.GoogleAuth({ 
//         keyFile: 'C:\\Users\\laksh\\Downloads\\event-calender-411413-07a49e22134c.json', 
//         scopes: 'https://www.googleapis.com/auth/calendar', 
//       });

//         // Set the 'auth' property after authentication
//         auth.getClient().then(a=>{
//             calendar.events.insert({
//                 auth: a,
//                 calendarId: GOOGLE_CALENDAR_ID,
//                 resource: eventData,
//             }, (err, event) => {
//                 if (err) {
//                     console.error('Error creating Google Calendar Event:', err);
//                     res.status(500).json({ success: false, message: 'Internal server error' });
//                 } else {
//                     console.log('Google Calendar Event created:', event.data);
//                     res.json({ success: true, message: 'Google Calendar Event created successfully!' });
//                 }
//         })
       
//         });
//     } catch (error) {
//         console.error('Error creating Google Calendar Event:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });



//   // Endpoint to get Google Calendar events
// app.get('/getGoogleCalendarEvents', async (req, res) => {
//     try {
//         // Authenticate with Google Calendar API
//         const auth = await jwtClient.authorize();

//         // Fetch Google Calendar events
//         calendar.events.list({
//             auth,
//             calendarId: GOOGLE_CALENDAR_ID,
//             timeMin: (new Date()).toISOString(),
//             maxResults: 10,
//             singleEvents: true,
//             orderBy: 'startTime',
//         }, (error, result) => {
//             if (error) {
//                 console.error('Error fetching Google Calendar Events:', error);
//                 res.status(500).json({ success: false, message: 'Internal server error' });
//             } else {
//                 if (result.data.items.length) {
//                     res.json({ success: true, events: result.data.items });
//                 } else {
//                     res.json({ success: true, message: 'No upcoming events found.' });
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching Google Calendar Events:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });








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
     //   console.log(username+" "+eventDetails);

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
          //  console.log(result);

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
           // console.log("hahahah1");
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
      //  console.log(unapprovedEvents);
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
      
        const isAdminRequest = authorizationHeader === 'pathak'; 
       // console.log(authorizationHeader);
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
    //console.log(req.body);
    //console.log(username);

    try {

        // Check if the username exists
        const existingUser = await User.findOne({ username });
       
        

        if (!existingUser) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Delete the user
        await User.deleteOne({ username });
       
       // Delete the user's  registered event
       // await Event.deleteOne({loggedInUser: username , isApproved: true});  
       await Event.deleteMany({ loggedInUser: username, isApproved: true });


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





// app.post('/runcode', async (req, res) => {
   
//         // const { codePath } = req.body;
//         // console.log("lakshinnnnnnn");
//         // console.log(codePath)
       
//         try {
//             const { codePath } = req.body;
           
//             console.log('index.js here')
//             // Validate the input code (you may want to add more validation)
//             if (!codePath || typeof codePath !== 'string') {
//               return res.status(400).json({ success: false, message: 'Invalid code provided.' });
//             }
          
//             // Call your code execution function (replace runUserCode with your actual function)
//             const result = await runUserCode(codePath);
           
//             // Respond with the result of code execution
//             res.json({ success: true, result });
//           } catch (error) {
//             console.error(error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//           }
// });


// async function runUserCode(codePath) {
 
//     return new Promise((resolve, reject) => {
//       // Execute the Python code using child_process
//       exec(`python "${codePath}"`, (error, stdout, stderr) => {
       
//         if (error) {
//           console.error(`Error: ${error.message}`);
          
//           reject('Error executing Python code.');
//         } else {
            
//           console.log(`stdout: ${stdout}`);
//           console.error(`stderr: ${stderr}`);
//           resolve(stdout);
//         }
//       });
//     });
//   }

  


app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});

