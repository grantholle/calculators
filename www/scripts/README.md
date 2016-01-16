# PERC Server Side Assets
This is a project for sending an email via the share feature in the apps and also generating a PDF to be printed or downloaded.

## Sending an email
`index.php` generates the PDF file, `email.php` is responsible for sending the email.

Currently the script is set up to send via SMTP. To send using alternative methods, see the [SwiftMailer](http://swiftmailer.org/docs/sending.html) documentation and update `email.php` around lines `47`.

## Configuration
Inside of `config.php` you will find several variables that need to be set, particularly each App's online counterpart and the SMTP settings.

They should be self explainitory. `$pdf_url` is the URL to `index.php` to generate the PDF.

Keep in mind also that the contents of `.htaccess` is necessary for getting the request to send the emails.
