---
title: Tambahkan database ke dalam Availability Group
date: 2025-09-12T20:25:06+08:00
thumbnail: img/placeholder.png
tags:
  - sql server
  - database
  - availability group
  - failover
categories:
  - "SQL Server"
slug: "tambah-database-ke-availability-group"
---

----------
Pagi-pagi dapat telpon dari pak boss, katanya tolong cek dulu database server ini kok satu databasenya hilang yah. 
Pas ngecek ternyata Availability Groupy nya ke failover ke secondary node, sementara database yang dicari itu bukan member dari availability group, jadinya pas failover, gak ikut kebawa, dia masih tinggal di primary nodenya.
<!--more-->
Buat cepet-cepetan biar gak menunda kerjaan temen-temen developer, jadinya failover lagi dulu databasenya ke primary node. Pas ngecek synchroniation statenya juga semua database di dalam availability group udah synchronized jadi harusnya gak ada resiko kehilangan data kalau mau failover. Langsung gas command di bawah :

```sql
USE [master]
GO
ALTER AVAILABILITY GROUP [NamaAG] FAILOVER
GO
```

Udah failover ke primary node langsung infoin ke pak boss untuk cek lagi dan databasenya udah muncul. Tapi masa harus failover setiap kali AG nya pindah ke secondary node kan. Jadinya biar gak perlu failover lagi balik mending databasenya ditambahin ke dalam availability group aja

1. Ubah dulu recovery model dari databasenya ke full recovery model
    ```sql
    USE [master]
    GO
    ALTER DATABASE [NamaDB] SET RECOVERY FULL WITH NO_WAIT
    GO
    ```
2. Bikin dulu full backup sama transaction log backup dari database (kalau ada job yang jalanin transaction log backup, matiin dulu atau exclude database yang mau ditambahin ke AG dari jobnya yah)
    ```sql
    -- Execute dulu full backup
    USE [master]
    GO
    BACKUP DATABASE [NamaDB] TO DISK = N'\\sharedstorage\sql_backup$\NamaDB_FULL_Backup_12092025.bak'
    WITH NAME = N'NamaDB Full Database Backup',
      INIT,
      CHECKSUM,
      COMPRESSION,
      STATS = 10
    GO

    -- lanjut backup transaction log
    USE [master]
    GO
    BACKUP LOG [NamaDB] TO DISK = N'\\sharedstorage\sql_backup$\NamaDB_TLOG_Backup_12092025.trn'
    WITH INIT, CHECKSUM, COMPRESSION, STATS = 10
    GO
    ```
3. Restore databasenya ke secondary node tapi opsinya NORECOVERY biar databasenya tetap dalam Restore state atau gak aktif dulu lah intinya
    ```sql
    -- restore dulu dari full backup
    USE [master]
    GO
    RESTORE DATABASE [NamaDB] FROM DISK = N'\\sharedstorage\sql_backup$\NamaDB_FULL_Backup_12092025.bak'
    WITH FILE = 1,
      MOVE N'NamaDB_data' TO N'E:\MSSQL\Data\NamaDB_data.mdf',
      MOVE N'NamaDBB_log' TO N'F:\MSSQL\Log\NamaDB_log.ldf',
      NORECOVERY,
      STATS = 10
    GO

    -- lanjut restore transaction lognya
    USE [master]
    GO
    RESTORE LOG [NamaDB] FROM DISK = N'\\sharedstorage\sql_backup$\NamaDB_TLOG_Backup_12092025.trn'
    WITH NORECOVERY, STATS = 10
    GO
    ```
4. Sekarang balik ke primary node untuk tambahin databasenya ke Availability group
    ```sql
    USE [master]
    GO
    ALTER AVAILABILITY GROUP [NamaAG] ADD DATABASE [NamaDB]
    GO
    ```
5. Verifikasi statusnya bisa cek dari availability group dashboard atau jalanin perintah :
    ```sql
    USE [master]
    GO
    SELECT 
      ag.name AS AG_Name,
      db.database_name,
      db.synchronization_state_desc,
      db.synchronization_health_desc
    FROM sys.dm_hadr_database_replica_states db
      JOIN sys.availability_groups ag ON db.group_id = ag.group_id
    WHERE db.database_name = 'NamaDB'
    GO
    ```

Kalau gak ada masalah harusnya synchronization_state_desc nya itu `SYNCHRONIZZING` atau kalau udah selesai bisa jadi `SYNCHRONIZED`. Selain itu berarti ada masalah jadi harus dicek lebih lanjut untuk troubleshoot.

----------

Silahkan tinggalin komentar yah kalau ada yang mau didiskusikan atau ditanyakan.