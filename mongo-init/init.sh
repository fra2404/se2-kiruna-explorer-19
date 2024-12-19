#!/bin/bash

# Variabili
SOURCE_URI="mongodb+srv://fransyalbano:Francesco24@cluster0.fildj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
SOURCE_DB="test"
DESTINATION_DB="admin"
BACKUP_PATH="/tmp/backup"

# Esegui il backup del database sorgente
mongodump --uri $SOURCE_URI --db $SOURCE_DB --out $BACKUP_PATH

# Ripristina il backup nel database di destinazione
mongorestore --db $DESTINATION_DB $BACKUP_PATH/$SOURCE_DB