import nodemailer from 'nodemailer';
import multer from 'multer';

const storage = multer.memoryStorage(); // This will store the file in memory. You can use other storage options if needed.
const upload = multer({ storage: storage }).fields([{ name: 'audio' }, { name: 'username' }]);

const g_admin = process.env.ADMIN_EMAIL;
const g_pass = process.env.ADMIN_PASS;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const processUpload = new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  try {
    await processUpload;

    if (!req.files || !req.files.audio || req.files.audio.length === 0) {
      return res.status(400).json({ message: 'Audio file is missing' });
    }
  
    const audioFile = req.files.audio[0];
    const username = req.body.username;
    const email = req.body.email;

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: g_admin,
        pass: g_pass,
      },
    });

    const mailOptions = {
      from: g_admin ,
      to: `${email};${g_admin}`,
      subject: 'Accent Coach Sample Recording',
      text: `Hi ${username},\n thank you to attend your recording test, here is your recording! \n Our Accnet Coach will give you a feedback through the the email \n thank you for your paitant! `,
      attachments: [
        {
          filename: `recoding-${username}.wav`,
          content: audioFile.buffer,
          contentType: 'audio/wav',
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'success' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
}


export const config = {
  api: {
    bodyParser: false,
  },
};