# WebRTC Dial In
Please note:

This project is highly in development. Key feature is working, but a plenty of todos are waiting to be done.

This application is meant to be a demo for WebRTC call features.
Every user can obtain an identity. Once it is done you can call the other user.

### Demo video

Please check this demo video to get to know about this project.

[![Demo Video](https://raw.githubusercontent.com/gabrielmicko/WebRTCDialIn/master/public/img/demovideo.png)](https://www.youtube.com/watch?v=XIupxMnlGfU)
### What it does:
* obtaining identity
* call somebody
* live p2p video call with someone

### Configuration
For the proper functionality you will need to run WebRTCDialInServer (signalling for WebRTC). You can find it inside my repositories.
Set the address for the WebRTCDialInServer in the **app/config/config.json**.

```js
{
  "dialInServer": "localhost:3050"
}
```

### Running the application
```sh
npm install
npm run build
npm start
```

### Running for development
```sh
npm install
npm run dev
npm start
```

### Version
0.0.1
