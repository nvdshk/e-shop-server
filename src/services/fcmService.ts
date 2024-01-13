import firebase from 'firebase-admin'
import Notification from '../models/notification'

const notification_options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24,
}

const sendPushNotification = async (
  fcmToken: string,
  userId: string,
  title: string,
  body: string
) => {
  const notificationData = {
    message: {
      notification: {
        title: title,
        body: body,
      },
      token: fcmToken,
    },
    user: userId,
    sent: false,
    error: '',
    date: new Date(),
  }

  if (!fcmToken) {
    notificationData.error = 'No tokens found'
  } else {
    try {
      const response = await firebase.messaging().send(notificationData.message)
      notificationData.sent = true

      // remove all expired tokens from db.
      //    const failedTokens = response.results
      //    .map((r, i) => r.error && tokens[i])
      //    .filter(r => r);
      //  await Devices.deleteMany({ token: { $in: failedTokens } });
    } catch (error: any) {
      notificationData.error = error.message
    }
  }

  /* 
    Its always a good practice to log the notification sent to the user, 
    so that, the user can view all the notification at one place.
    This also helps in debugging.
    */

  const notification = new Notification(notificationData)
  await notification.save()
}

export const sendToAllPushNotification = async (
  fcmTokens: string[],
  title: string,
  body: string,
  image: string
) => {
  const notificationData = {
    message: {
      notification: {
        title: title,
        body: body,
        image: image,
      },
      tokens: fcmTokens,
    },

    sent: false,
    error: '',
    date: new Date(),
  }

  if (fcmTokens.length === 0) {
    notificationData.error = 'No tokens found'
  } else {
    try {
      console.log('send notification')
      const response = await firebase
        .messaging()
        .sendEachForMulticast(notificationData.message)

      notificationData.sent = true

      // remove all expired tokens from db.
      //    const failedTokens = response.results
      //    .map((r, i) => r.error && tokens[i])
      //    .filter(r => r);
      //  await Devices.deleteMany({ token: { $in: failedTokens } });
    } catch (error: any) {
      notificationData.error = error.message
    }
  }

  const notification = new Notification(notificationData)
  await notification.save()
}

export const sendTopicPushNotification = async (
  title: string,
  body: string,
  image: string
) => {
  const topic = 'all'

  const notificationData = {
    message: {
      notification: {
        title: title,
        body: body,
      },
    },
    topic: topic,
    sent: false,
    error: '',
    date: new Date(),
  }

  try {
    const response = await firebase
      .messaging()
      .sendToTopic(notificationData.topic, notificationData.message)
    notificationData.sent = true

    // remove all expired tokens from db.
    //    const failedTokens = response.results
    //    .map((r, i) => r.error && tokens[i])
    //    .filter(r => r);
    //  await Devices.deleteMany({ token: { $in: failedTokens } });
  } catch (error: any) {
    notificationData.error = error.message
  }

  const notification = new Notification(notificationData)
  await notification.save()
}

export default sendPushNotification
