import Notification from '../models/Notification.js';

// Stub functions for future integrations[cite: 1]
const sendEmail = async (recipients, title, message) => { /* future Email logic */ };
const sendSMS = async (recipients, message) => { /* future SMS logic */ };
const sendWhatsApp = async (recipients, message) => { /* future WhatsApp logic */ };

export const dispatchNotification = async (data, channels = ['IN_APP']) => {
  const { title, message, type, recipientUsers, recipientRoles, createdBy } = data;

  // 1. Always save to database for the in-app notification center
  const newNotification = await Notification.create({
    title,
    message,
    type,
    recipientUsers,
    recipientRoles,
    createdBy
  });

  // 2. Extensible channel routing[cite: 1]
  if (channels.includes('EMAIL')) {
    await sendEmail(recipientUsers, title, message);
  }
  if (channels.includes('SMS')) {
    await sendSMS(recipientUsers, message);
  }
  if (channels.includes('WHATSAPP')) {
    await sendWhatsApp(recipientUsers, message);
  }

  return newNotification;
};