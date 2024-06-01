const nodemailer = require('nodemailer');

const sendToUsers = async (json, emails, name, timestamp, created) =>{
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'info.datenbearbeitungen@gmail.com',
          pass: process.env.GOOGLE_KEY
      }
    });
  
    for (let i = 0; i < emails.length; i++){
      sendEmail(transporter, json, emails[i], name, timestamp, created)
    }
  }
  
  const sendEmail = async (transporter, json, email, name, timestamp, created) => {
    try{
      const result = generateText(name, created)

      const mailOptions = {
        from: 'info.datenbearbeitungen@gmail.com',
        to: email,
        subject: result.subject,
        text: result.text,
        attachments: [
          {
            filename: `Daten_Test_Unveraenderbarkeit_${timestamp}.json`,
            content: json,
            encoding: 'utf-8',
          },
        ],
      };
    
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error.message);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    catch(err){console.log(err)}
    
  }

  const generateText = (name, created) =>{
    let text
    let subject
    if (created){
      text = `Guten Tag\n\nSie sind von einem neuen Datenbearbeitungsprojekt betroffen. Informationen zum Projekt ${name} finden Sie direkt in der Lösung.\n\n Mit der im Anhang verfügbaren Datei können Sie ab sofort prüfen, ob der erstellte Eintrag des Datenbearbeiters zum obengenannten Projekt ohne Ihr Wissen verändert wurde. Wenn der Datenbearbeiter den Eintrag anpasst, sollten Sie erneut eine E-Mail mit der aktualisierten Datei erhalten. Informationen zum konkreten Vorgehen zur Prüfung der Unveränderbarkeit können Sie der Funktionalität “Datenintegrität prüfen” entnehmen.`
      subject = "Informationen zum neuen Datenbearbeitungsprojekt"
    }
    else {
      text = `Guten Tag\n\n der Datenbearbeiter J hat Anpassungen an dem Datenbearbeitungs-Projekt ${name} vorgenommen von dem Sie betroffen sind. Die im Anhang verfügbare Datei enthält die aktualisierten Daten des Projekteintrags. Sie können diese für die Funktionalität "Datenintegrität prüfen" nutzen.\n\nVielen Dank für Ihre Kenntnisnahme.`
      subject = "Informationen zu Anpassungen an einem für Sie relevanten Datenbearbeitungs-Projekt"
    }

    return {
      text: text,
      subject: subject
    }
  }

  module.exports = {sendToUsers, sendEmail}