const express = require('express');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const fileupload = require('./express-fileupload/lib');
const app = express();
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
let key = 'MySuperSecretKey';
key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
if (!fs.existsSync(path.join(__dirname, './uploaded'))) {
    fs.mkdirSync(path.join(__dirname, './uploaded'))
}

app.use(fileupload());
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, './website_files'));

app.get('/upload', (request, response) => {
    return response.sendFile(path.join(__dirname, './website_files/upload.html'))
})

app.post('/upload', (request, response) => {
    let file_given = request.files.given_file;
    let encrypted_buffer = encrypt(file_given.data)
    let upload_path = path.join(__dirname,  './uploaded/' + file_given.name)
    file_given.mv({filePath: upload_path, buffer: encrypted_buffer }, (err) => {
        if (err) {
            let error = JSON.stringify({error: `${err}`})
            response.send(error)
        }
        else{
            response.redirect(`http://localhost:3000/get_image/${file_given.name}`)
        }
    })
})

app.get('/get_image/(:image_name)', (request, response) => {
    fs.readFile(path.join(__dirname, `./uploaded/${request.params.image_name}`), function (err, data) {
        if (err) throw err;
        response.render('image_viewer.html', {
            base64_image: decrypt(data).toString('base64')
        })

    });
})

function encrypt(buffer){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
}

function decrypt(encrypted_buffer) {
    const iv = encrypted_buffer.slice(0, 16);
    encrypted_buffer = encrypted_buffer.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const result = Buffer.concat([decipher.update(encrypted_buffer), decipher.final()]);
    return result;
 };

app.listen(3000, () => {
    console.log('runnin')
})
