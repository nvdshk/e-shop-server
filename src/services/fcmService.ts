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

export default sendPushNotification
