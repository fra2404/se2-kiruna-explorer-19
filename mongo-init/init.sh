#!/bin/bash

# Variabili
SOURCE_URI="mongodb+srv://fransyalbano:Francesco24@cluster0.fildj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
SOURCE_DB="test"
DESTINATION_DB="admin"
BACKUP_PATH="/tmp/backup"
DESTINATION_URI="mongodb://admin:secret@localhost:27017/admin"

# Esegui il backup del database sorgente
mongodump --uri $SOURCE_URI --db $SOURCE_DB --out $BACKUP_PATH

# Attendi che MongoDB sia avviato
until mongo --host localhost --username admin --password secret --authenticationDatabase admin --eval "print(\"waited for connection\")"
do
    sleep 5
done

# Ripristina il backup nel database di destinazione
mongorestore --uri $DESTINATION_URI --db $DESTINATION_DB $BACKUP_PATH/$SOURCE_DB
