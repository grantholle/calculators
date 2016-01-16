<?php

// App key value pair for pretty strings
// 'Type' is what each app will be called in the email
$apps = array(
  'mow' => array(
    'type' => 'Propane Mower Calculator',
    'app_url' => 'http://www.propanecostcalculator.com/mowers'
  ),
  'onroad' => array(
    'type' => 'Propane Autogas Calculator',
    'app_url' => 'http://www.propanecostcalculator.com/autogas'
  ),
  'ag' => array(
    'type' => 'Propane Irrigation Engine Calculator',
    'app_url' => 'http://www.propanecostcalculator.com/irrigation'
  )
);

// From email name and address
$from_address = 'PERC@propanecostcalculator.com';
$from_name = 'PERC';

// SMTP creds
$smtp_server = 'smtp.mailgun.org';
$smtp_username = 'postmaster@propanecostcalculator.com';
$smtp_password = 'c1d4ae2d10db94b7fc7707a794ac6768';

// PDF generator url
$pdf_url = 'http://www.propanecostcalculator.com/scripts/';

