<?php
    // Informations d'identification
    define('DB_SERVER', 'mysql-duquerroixpro.alwaysdata.net');
    define('DB_USERNAME', '203453_duqpro');
    define('DB_PASSWORD', 'duquerroixPRO95123456&');
    define('DB_NAME', 'duquerroixpro_starthief');
    
    // Connexion à la base de données MySQL 
    $conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    
    // Vérifier la connexion
    if($conn === false){
        die("ERREUR : Impossible de se connecter. " . mysqli_connect_error());
    }
?>