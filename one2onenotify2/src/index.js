const admin = require("firebase-admin");
var serviceAccount = require("./creds.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export default ({ action }, { services }) => {
  const { ItemsService } = services;
  action("notifications.items.create", async (context, { schema }) => {
    const NotificationCollection = new ItemsService("notifications", {
      schema,
    });
    const notificationObject = await NotificationCollection.readOne(
      context.key
    );
    try {
      let payload;
      if (notificationObject.image == null) {
        payload = {
          notification: {
            title: notificationObject.title,
            body:
              notificationObject.body == null ? "" : notificationObject.body,
          },
          data: {
            "type" : notificationObject.type,
            "product" : notificationObject.product == null ? "" : notificationObject.product,
            "custom_url" : notificationObject.custom_url == null ? "" : notificationObject.custom_url,
          },
        };
      } else {
        payload = {
          notification: {
            title: notificationObject.title,
            body:
              notificationObject.body == null ? "" : notificationObject.body,
            image:
              "https://farmer.kodagu.today/assets/" +
              notificationObject.image,
          },
          data: {
            "type" : notificationObject.type,
            "product" : notificationObject.product == null ? "" : notificationObject.product,
            "custom_url" : notificationObject.custom_url == null ? "" : notificationObject.custom_url,
          },
        };
      }
      var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
      };
      const response = await admin
        .messaging()
        .sendToTopic("app", payload, options);
      console.log("response", response);
    } catch (error) {
      console.log(error);
    }
  });
};
