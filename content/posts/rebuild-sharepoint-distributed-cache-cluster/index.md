---
title: Rebuild SharePoint Distributed Cache Cluster
description: ""
date: 2025-09-01T06:43:05.842Z
preview: ""
draft: false
showComments: true
tags:
    - sharepoint
    - distrubuted cache
categories:
    - SharePoint
slug: rebuild-sharepoint-distributed-cache-cluster
---

Habis ngepatch sharepoint beberapa waktu yang lalu pas ada zero day vulnerability, trus kirain semua udah normal. Ternyata dapat alert disk drive di sharepoint full, gak biasanya.

Pas ngecek ternyata kebanyakan isinya itu log file, satu file ukurannya bisa hampir 1GB, pas ngecek isinya, banyak banget error terkait Distributed Cache. Salah satu contohnya :

```
Unexpected Exception in SPDistributedCachePointerWrapper::InitializeDataCacheFactory for usage 'DistributedLogonTokenCache' 
- Exception 'Microsoft.ApplicationServer.Caching.DataCacheException: ErrorCode<ERRCA0017>:SubStatus<ES0006>:
There is a temporary failure. Please retry later. 
(One or more specified cache servers are unavailable, which could be caused by busy network or servers. 
For on-premises cache clusters, also verify the following conditions. 
Ensure that security permission has been granted for this client account, 
and check that the AppFabric Caching Service is allowed through the firewall on all cache hosts. 
Also the MaxBufferSize on the server must be greater than or equal to the serialized object size sent from the client.) 
```

Coba restart service `AppFabric Caching Service`, trus coba restart servernya juga tapi tetep aja nulis banyak log kayak gini. Jadinya mikir mending coba rebuild distributed cache clusternya aja. 
- Jalanin powershell di sharepoint servernya, run as admin
- Load powershell module buat sharepoint pake perintah ini :
  ```PowerShell
  Add-PSSnapin Microsoft.SharePoint.PowerShell
  ```
- Stop dulu distributed cache service instancenya
  ```PowerShell
  Stop-SPDistributedCacheServiceInstance
  ```
- Hapus dulu cache hostnya
  ```PowerShell
  Remove-SPDistributedCacheServiceInstance
  ```
- Tunggu 30 detik sampe satu menit baru tambahin lagi distributed cache hostnya
  ```PowerShell
  Add-SPDistributedCacheServiceInstance
  ```
- Cek dulu status Distributed cache instancnya 
  ```PowerShell
  Get-SPServiceInstance | Where-Object {$_.TypeName -like "*Distributed*"}
  ```
- Kalau statusnya disabled, enable pake perintah di bawah, kalau udah online statusnya, langsung aja ke langkah berikut
  ```PowerShell
  $serviceInstance = Get-SPServiceInstance | Where-Object {$_.TypeName -like "*Distributed*"}
  $serviceInstance.Provision()
  Get-SPServiceInstance | Where-Object {$_.TypeName -like "*Distributed*"}
  ```
- Restart lagi service `AppFabric Caching Service` 
  ```PowerShell
  Restart-Service -Name "AppFabricCachingService"
  ```
- Restart lagi servernya biar lebih yakin.

Setelah restart server, coba cek lagi status distributed cache service instancenya, ternyata masih online.
Cek log filenya juga masih banyak sih sebenarnya lognya, cuma yang terkait Distributed Cache udah gak sesering sebelumnya.
Kalau temen-temen pernah ngalamin ini dan punya solusi yang lebih baik, tolong kasih komentar yah. Terima kasih.
