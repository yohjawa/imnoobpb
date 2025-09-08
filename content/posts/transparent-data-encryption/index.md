---
title: Aktifkan Transparent Data Encryption di SQL Server
date: 2025-09-08T11:38:06+08:00
thumbnail: img/placeholder.png
tags:
  - sql server
  - encrption at rest
  - tde
categories:
  - SQL Server
slug: sql-server-transparent-data-encryption
---

----------

SQL Server punya salah satu feature buat proteksi data namanya Transparent Data Encryption. Ini hanya ada di SQL Server Enterprise Edition. Jadi kalau mau pake buat di server production mesti punya license enterprise edition dulu. Kalau buat belajar atau buat development aja bisa pake yang Developer Edition sih.

Feature ini buat enkripsi data at-rest. Maksudnya hanya data yang sudah kesimpen di disk aja yang di encrypt, jadi kayak data filenya, atau backup file dari database, itu yang akan ke encrypt. <!--more--> Nah, kebetulan di tempat kerja pada rame bahas mengenai perlindungan data pribadi, jadi semua database yang ada nyimpen data pribadi pengguna itu mesti di enkripsi, minimal ekripsi at-rest. Makanya Transparent Data Encryption atau TDE nya SQL Server ini cocok lah.

Langsung aja buka SQL Server Management Studio (SSMS), connect ke instance yang ada database yang mau di encrypt trus ikutin langkah-langkah di bawah:
1. Buat dulu master keynya di database master
   ```sql
   USE [master]
   GO
   CREATE MASTER KEY ENCRYPTION BY PASSWORD = N'password-master-keynya'
   GO
   ```
   Perintah di atas untuk bikin master key nya dulu, 
2. Buat certificatenya, disini kita pake self-signed certificate aja biar simple. Kalau mau pake certificate yang di dapat dari CA bisa juga tapi saya gak punya certificatenya
    ```sql
    USE [master]
    GO
    CREATE CERTIFICATE [CertificateTDE] WITH
        SUBJECT = N'Certificate TDE Saya',
        EXPIRY_DATE = '2026-12-31'
    GO
    ```
    Jadi perintah ini buat create certificate dengan nama `CertificateTDE`, trus subjectnya `Certificate TDE Saya` dan expired datenya tanggal `31 Desember 2026`, ini bisa disesuaikan dengan kebutuhan
3. Lanjut buat database encryption key
   ```sql
   USE [DatabaseName]
   GO
   CREATE DATABASE ENCRYPTION KEY
    WITH ALGORITHM = AES_256
    ENCRYPTION BY SERVER CERTIFICATE [CertificateTDE]
   GO
   ```
   Disini kita buat encryption key di database `DatabaseName` pake certificate dengan nama yang dibuat sebelumnya
4. Lanjut, aktifin enkripsi di databasenya
   ```sql
   USE [master]
   GO
   ALTER DATABASE [DatabaseName] SEt ENCRYPTION ON
   GO
   ```
5. Bisa cek status enkripsinya pake query di bawah
   ```sql
   SELECT
    db.name,
    db.is_encrypted,
    dm.encryption_state,
    dm.key_algorithm,
    dm.key_length
   FROM sys.databases db
    JOIN sys.dm_database_encryption_keys dm ON db.database_id = dm.database_id
    WHERE db.name = 'DatabaseName'
   GO
   ```
   Kalau databasenya sudah selesai terenkripsi, encryption_state = 3
6. Udah selesai, sekarang semua data file dari database ini akan terenkripsi, kalau databasenya di backup, backup filenya juga terenkripsi. Dan gak akan bisa di restore ke instance lain kalau certificatenya gak ikut ke restore.

----------

Silahkan tinggalin komentar kalau ada yang mau ditanyain. Terima kasih.