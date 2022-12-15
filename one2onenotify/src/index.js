const admin = require("firebase-admin");
var serviceAccount = require("./creds.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export default (router) => {
  router.get("/", async (req, res) => {
    const payload = {
      notification: {
        title: "notificationObject.title",
        body: "notificationObject.body",
      },
    };
    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24,
    };
    const response = await admin
      .messaging()
      .sendToTopic("app", payload, options);
    console.log("response", response);
    res.send("Hello, World!");
  });
};
