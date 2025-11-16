import nodemailer from "nodemailer";

// =======================================
//          API KEY VALID
// =======================================
const validAPI = {
  adminv: true,
  totok: true,
  premium: true
};

// =======================================
//      EMAIL PENGIRIM (RANDOM)
// TAMBAH EMAIL SESUKA KAMU DI ARRAY INI
// =======================================
const EMAIL_POOL = [
  {
    user: "andi081287@gmail.com",
    pass: "kamoisyxvkqunhro"
  },
  {
    user: "teletongbosok1@gmail.com",
    pass: "gphsscqotnrxsabk"
  },
  {
    user: "tinxyz889@gmail.com",
    pass: "xamgmwobishfjion"
  }
];

export default async function handler(req, res) {
  const { nomor, apikey } = req.query;

  // CEK APIKEY
  if (!apikey || !validAPI[apikey]) {
    return res.status(403).json({
      status: false,
      message: "APIKEY salah!"
    });
  }

  // CEK NOMOR
  if (!nomor) {
    return res.status(400).json({
      status: false,
      message: "Parameter nomor wajib diisi!"
    });
  }

  // =======================================
  //    PILIH EMAIL ACAK UNTUK MENGIRIM
  // =======================================
  const randomSender = EMAIL_POOL[Math.floor(Math.random() * EMAIL_POOL.length)];

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: randomSender.user,
      pass: randomSender.pass
    }
  });

  // =======================================
  //         FORMAT PESAN TEXT
  // =======================================
  const pesan = `
BANDING WHATSAPP (TEXT)

Nomor  : ${nomor}
APIKEY : ${apikey}
Pengirim Email : ${randomSender.user}
Waktu  : ${new Date().toLocaleString("id-ID")}

Status: Permintaan banding berhasil dikirim. AQ
  `;

  try {
    // =======================================
    //        KIRIM EMAIL BANDING
    // =======================================
    await transporter.sendMail({
      from: `BANDING BOT <${randomSender.user}>`,
      to: "support@whatsapp.com",   // kalau mau ganti → ganti di sini
      subject: `Banding WhatsApp ${nomor}`,
      text: pesan
    });

    // =======================================
    //      RESPON KE WEB (INDEX.HTML)
    // =======================================
    return res.status(200).json({
      status: true,
      nomor: nomor,
      dikirim_dengan: randomSender.user,
      message: "Banding berhasil dikirim TEXT!"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Gagal mengirim banding",
      error: error.message
    });
  }
         }
