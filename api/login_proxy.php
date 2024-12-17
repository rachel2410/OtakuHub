<?php
// URL of the insecure resource
$url = 'http://169.239.251.102:3341/~rachel.yeboah/otakuhub/login.php';

// Initialize a cURL session
$ch = curl_init();

// Set the URL
curl_setopt($ch, CURLOPT_URL, $url);

// Return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// Execute the session and store the contents in $response
$response = curl_exec($ch);

// Close the cURL session
curl_close($ch);

// Set the appropriate content type header
header('Content-Type: application/json');

// Output the response
echo $response;
?>
