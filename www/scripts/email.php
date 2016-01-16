<?php

// If there's no data set, no need to continue
if (!isset($_GET['data']))
  exit;

// Include the config file
include_once('config.php');

// Require the library
require_once('swiftmailer/swift_required.php');

// Decode the json
$data = json_decode($_GET['data']);

// Set the pretty type string
$type = $apps[$data->app]['type'];
$app = $apps[$data->app]['app_url'] . '?data=' . base64_encode(json_encode($data->import));
$pdf_url = $pdf_url . '?data=' . $data->results;
$emails = array();

foreach (explode(',', $data->email) as $email)
  $emails[] = trim($email);

// Create the message object with the subject
$message = Swift_Message::newInstance('See results from the ' . $type);

// Create the message body
$message->setBody(
'<html>' .
'<head></head>' .
'<body>' .
'<p>A FRIEND SHARED THEIR ' . strtoupper($type) . ' RESULTS.<br>' .
'Someone wants you to know about the cost savings of clean, American-made propane. Below, you’ll find results from the ' . $type . '.</p>' .
'<p><a href="' . $pdf_url . '">Print the ' . $type . ' Results.</a></p>' .
'<p>CALCULATE YOUR OWN COST SAVINGS.<br>' .
'Find out how much propane could be saving you with the ' . $type . '. Follow the link to complete your own cost comparison, and then share it with friends.</p>' .
'<p><a href="' . $app . '">Create your own comparison.</a></p>' .
'</body>' .
'</html>',
'text/html'
);

$message->setFrom(array($from_address => $from_name));
$message->setTo($emails);

// Create the transport - didn't work on our dev server
// see - http://swiftmailer.org/docs/sending.html
// $transport = Swift_SendmailTransport::newInstance();

// SMTP
$transport = Swift_SmtpTransport::newInstance($smtp_server, 25)
  ->setUsername($smtp_username)
  ->setPassword($smtp_password);

// Create the mailer
$mailer = Swift_Mailer::newInstance($transport);

$result = $mailer->send($message);

// Log sent with analytics
$ga_id = 'UA-50455296-1';
$cid = rand(1000,5000);
$ga_category = 'costcalculator-email';
$ga_action = 'sent';
$ga_label = urlencode($type);

// Fire collect request
file_get_contents('http://www.google-analytics.com/collect?v=1&tid=' . urlencode($ga_id) . '&cid=' . $cid . '&t=event&ec=' . $ga_category . '&ea=' . $ga_action . '&el=' . $ga_label);


