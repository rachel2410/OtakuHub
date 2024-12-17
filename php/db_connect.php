<?php
$host = 'localhost';
$db   = 'webtech_fall2024_rachel_yeboah';
$user = 'rachel.yeboah';
$pass = 'nhyirah13';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]));
}
?>
