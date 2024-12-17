<?php
// Allow requests from your Vercel app
header("Access-Control-Allow-Origin: https://otakuhub-ray.vercel.app");

// If you need to allow credentials (e.g., cookies, authorization headers)
header("Access-Control-Allow-Credentials: true");

// Specify which request methods are allowed
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Specify which headers are allowed in the request
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with 200 OK for preflight requests
    http_response_code(200);
    exit();
}

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

// Check for cURL errors
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch resource']);
    exit();
}

// Close the cURL session
curl_close($ch);

// Set the appropriate content type header
header('Content-Type: application/json');

// Output the response
echo $response;
?>
