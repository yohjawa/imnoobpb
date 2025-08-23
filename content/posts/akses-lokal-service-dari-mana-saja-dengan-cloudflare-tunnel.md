---
title: "Akses Service Lokal dari Mana Saja dengan Aman? Gunakan Cloudflare Tunnel!"
date: 2020-03-22T04:54:06+08:00
draft: false
cascade:
  showEdit: false
  showSummary: true
  showComment: true
---

### **Akses Service Lokal dari Mana Saja dengan Aman? Gunakan Cloudflare Tunnel!**

**Katakan Selamat Tinggal pada Port Forwarding yang Berisiko dan Konfigurasi VPN yang Rumit.**

----------

Apakah Anda pernah ingin mengakses server media, dashboard Home Assistant, atau website development yang berjalan di Raspberry Pi atau server rumah Anda, tetapi dari luar jaringan? Selama ini, solusinya selalu  **port forwarding**  yang membutuhkan alamat IP publik sementara kebanyakan provider internet akhir-akhir ini (setidaknya di daerah rumah saya) hanya mengalokasikan private ip address sehingg hal ini tidak memungkinkan. Selain itu port forwarding juga penuh dengan risiko keamanan atau setup  **VPN**  yang bisa dibilang... agak ribet untuk teman atau keluarga yang kurang tech-savvy.

Saya pun mengalami hal yang sama. Sampai akhirnya saya menemukan solusi yang elegan, aman, dan yang terpenting,  **gratis**:  **Cloudflare Tunnel**.

Baru saja saya berhasil menyiapkannya dan hasilnya luar biasa. Blog post ini akan menceritakan pengalaman saya dan mengapa Anda harus mempertimbangkan untuk beralih.

#### **Apa Itu Cloudflare Tunnel? **

Bayangkan Anda memiliki harta karun (service Anda) di dalam kastil (router/jaringan rumah Anda). Port forwarding itu seperti membuka pintu belakang kastil dan berharap tidak ada penjahat yang masuk. VPN seperti membangun jembatan rahasia ke kastil, tapi hanya untuk orang-orang yang punya kunci khusus (klien VPN).

Cloudflare Tunnel bekerja dengan cara yang berbeda.  **Alih-alih Anda yang membuka jalan masuk, service Anda-lah yang menjulurkan "terowongan" yang aman ke luar.**

Service di server rumah Anda (`cloudflared`) membuat koneksi  _outbound_  yang aman dan terenkripsi ke jaringan Cloudflare yang global. Karena koneksinya keluar (outbound), Anda  **tidak perlu membuka port apa pun di router**. Firewall Anda bisa tetap tertutup rapat!

Kemudian, Cloudflare yang akan menangani semua lalu lintas dari internet. Mereka yang mengurus SSL/TLS, proteksi DDoS, dan autentikasi. Pengguna hanya perlu mengakses subdomain Anda yang cantik seperti mengakses website biasa. Sama seperti blog pribadi saya ini, di hosting di Raspberry PI di rumah saya lho.

#### **Mengapa Saya Memilih Cloudflare Tunnel?**

1.  **Keamanan Maksimal:**  Tidak ada port yang terbuka di router = tidak ada celah untuk ditembus dari luar. Ini adalah peningkatan keamanan yang dramatis.
2.  **Sangat Mudah:**  Setup-nya jauh lebih sederhana daripada VPN. Hanya perlu instal sebuah daemon (`cloudflared`) dan konfigurasinya juga mudah, bisa lewat cloudflare dashboard.
3.  **Gratis!**  Untuk penggunaan pribadi, fitur yang disediakan oleh Cloudflare dalam paket gratisnya sudah lebih dari cukup.
4.  **Termasuk Fitur Keamanan Tambahan:**  Anda bisa dengan mudah menambahkan lapisan keamanan seperti  **Autentikasi Cloudflare Access**. Jadi, sebelum bisa mengakses service Anda, orang harus login dengan Google, GitHub, atau email one-time password terlebih dahulu. Sangat cocok untuk service yang tidak ingin dipublikasikan secara luas!

#### **Apa yang Saya Akses dengan Tunnel Ini?**

Saat ini, saya sudah membuat tunnel untuk beberapa service di jaringan rumah:

-   **Monitoring & Control : ** Memonitoring & mengontrol perangkat-perangkat elektronik di rumah termasuk CCTV, AC, server
-   **Website Development :**  Project website yang saya kerjakan di localhost bisa langsung di share ke client, gak perlu di deploy ke server publik yang tentunya butuh biaya tambahan lagi.
-   **Penyimpanan Cloud:**  Tempat penyimpanan seperti google drive atau onedrive yang sebetulnya ada di device rumah saya dan bisa di akses dari mana saja selama terhubung ke internet.
-   **SSH / Remote Desktop :**  Mengakses server/PC di rumah saya melalui SSH atau remote desktop client (Bisa juga menggunakan web browser).

#### **Bagaimana Rasanya Setelah Menggunakannya?**

**Game Changer.**

Perasaan lega karena tahu router tidak lagi "dibobol" port-nya itu sangat menyenangkan. Performanya juga sangat baik karena lalu lintas di-routing melalui jaringan Cloudflare yang cepat dan andal.

Yang paling saya suka adalah kemudahannya. Saya bisa share link file yang saya upload ke cloud drive (saya menggunakan OwnCloud)  ke teman atau keluarga, mereka langsung bisa buka tanpa perlu instal aplikasi VPN atau konfigurasi aneh-aneh (tentu saja dengan autentikasi tambahan untuk keamanan).

#### **Apakah Cloudflare Tunnel Cocok untuk Anda?**

Jika Anda:

-   Memiliki service/server di rumah yang ingin diakses dari internet.
-   Khawatir dengan keamanan port forwarding atau tidak mendapat IP Public dari internet provider sehingga tidak memungkinkan untuk melakukan Port Forwarding.
-   Ingin solusi yang gratis dan relatif mudah diatur.
-   Memiliki sebuah domain (atau mau beli satu, bisa dapat yang murah) tapi tidak mau membeli web hosting yang harganya jauh lebih mahal dari harga sebuah nama domain

Maka,  **YA!**  Cloudflare Tunnel adalah solusi yang sempurna untuk Anda.

#### **Tertarik Mencoba?**

Cloudflare memiliki dokumentasi yang sangat lengkap dan mudah diikuti. Anda bisa mulai dari sini:
[**Cloudflare Zero Trust Documentation - Tunnels**](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

Intinya, prosesnya adalah:

1.  Beli domain dan arahkan nameservernya ke Cloudflare (atau gunakan domain yang sudah ada di Cloudflare).
2.  Instal  `cloudflared`  (daemon Cloudflare Tunnel) di komputer/server Anda.
3.  Login dan konfigurasi tunnel le dashboard Cloudflare Zero Trust.
4.  Tentukan service lokal mana yang akan di-expose (e.g.,  `http://localhost:8123`  untuk Cloud drive anda).
5.  Setup subdomain publik (CNAME) yang mengarah ke tunnel Anda.
6.  (Opsional) Tambahkan rules autentikasi untuk membatasi akses.

----------

**Penutup**

Beralih ke Cloudflare Tunnel adalah salah satu keputusan terbaik yang saya buat untuk infrastruktur rumahan saya. Solusi ini menggabungkan keamanan kelas enterprise dengan kemudahan penggunaan dan harga yang tidak bisa dikalahkan (gratis!).

Jika Anda punya pertanyaan atau pengalaman sendiri dengan Cloudflare Tunnel, bagikan di kolom komentar di bawah! Mari berbagi konfigurasi dan service keren yang kita expose.
