const twilio = require('twilio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendWhatsapp = async (phone, message, img) => {
    try {
        let data = {
            from: 'whatsapp:+14155238886',
            to: `whatsapp:+91${phone}`,
            body: message,
        }
        if(img){
            data.mediaUrl = img;
        }
        const result = await client.messages.create(data);
        console.log('Whatsapp message sent successfully: ' + result.sid);
        return result;  // Return the result from Twilio
    } catch (error) {
        console.error('Error sending WhatsApp message: ', error);
        throw error;  // Throw the error to be caught in the route handler
    }
}

module.exports = sendWhatsapp;
