---
title: "Akses jaringan rumah dari mana saja pake cloudflare tunnel."
date: 2020-03-22T04:54:06+08:00
layout: "simple"
categories: "Zero Trust"
draft: false
showAuthor: true
showDate: true
cascade:
  showEdit: false
  showSummary: true
  showComment: true
---

----------

Jadi ceritanya saya punya beberapa aplikasi yang saya pasang di laptop maupun raspberry pi di rumah yang pengen bisa saya akses dari mana saja. Dulu  pas awal-awal langganan internet sih dari provider dapat ip public meskipun bukan ip static yah. Jadi pas dapat itu saya bisa pake feature **port forwarding** di routernya provider buat ngeforward port-port tertentu ke aplikasi saya di rumah.

Belakangan pas ngecek di router kok gak pernah dapat ip public lagi, pantesan port forwardingnya gak pernah jalan lagi. Akhirnya raspberry pi nya aku matiin sampe lama karna saya pikir percuma juga dinyalain terus tapi gak bisa di akses dari rumah.

Sampe satu hari dapat info dari satu blognya orang apa dari youtube channel gitu (lupa sih pastinya), kalau cloudflare itu punya service yang bisa buat expose aplikasi di rumah ke internet biar bisa di akses dari mana aja di internet. Saya pikir, menarik juga nih :D. Mulai bongkar sana-sini cari lagi raspi ku yang dulu dimatiin, udah lupa kan dimana simpennya sampe omelin istri segala kirain dia udah buang ke tempat sampah. 

Pas udah nemu kayaknya masih nyala sih tapi lupa username sama password buat remotenya dulu.
Mau install ulang, gak punya monitor. Gak punya card reader juga, akhirnya ambil jalan ninja, buka toko oren buat pesen card reader, sekalian beli sd card baru juga sih, soalnya was-was kalau sd card yang ada siapa tau udah rusak. Buat setup awalnya aku pake raspberry pi imager aja sih, nanti lain kali kalau sempat aku bikin tulisannya juga deh.

Intinya setelah raspberry pinya jalan, dua aplikasi pertama yang aku install disini tuh pertama pi-hole sama aplikasi owncloud. Detailnya bisa di lihat di website masing-masing atau cari aja di google, tapi singkatnya aplikasi pi-hole ini tuh buat jadi DNS server apa forwarder sekaligus add blocker buat ngeblok iklan-iklan yang nyebelin dari website yang dikunjungin, meskipun gak semua keblokir juga sih. Trus aplikasi owncloud tuh kayak google drive gitu cuma simpennya yah di tempat penyimpanan aku sendiri. Dua aplikasi ini aku jalanin di atas docker container, dan dua-duanya sudah bisa aku akses dari hp/laptop yang ada di rumah.

Lanjut aplikasi owncloudnya mau saya buat biar bisa akses dari mana aja, soalnya kadang ada file yang aku buat di laptop pengen akses dari mana aja, mau taro di google drive tapi di jaringan  kantor google drivenya di blok. Buat bisa kayak gini aku pake cloudlare tunnel deh, dokumentasinya lengkap banget lah, kalau mau baca langsung ke websitenya bisa klik link ini : 

Cloudflare memiliki dokumentasi yang sangat lengkap dan mudah diikuti. Anda bisa mulai dari [sini](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/). Biar dokumentasi udah lengkap tapi saya mau tulis disini lagi apa-apa aja sih yang saya buat sampe berhasil aplikasi owncloudnya bisa akses dari mana aja. Intinya tuh gini :

1.  Mesti punya nama domain dulu, trus name servernya di arahin ke cloudflare, kebetulan saya udah punya dan udah arahin name servernya ke cloudflare juga, jadi saya gak ceritain disini.
2.  Instal  `cloudflared`  di raspberry pi, pake command di bawah ini aja. (Ini sebenarnya bisa dilakukan dari dashboard cloudflare sih cuma saya nyaman aja pake command line jadi saya buat gini deh )
    ```bash
    $ sudo apt update
    $ sudo mkdir -p --mode=0755 /usr/share/keyrings
    $ echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared bookworm main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
    $ sudo apt updat && sudo apt install cloudflared -y
    $ cloudflared tunnel login
    ```
3.  Buat file config untuk cloudflare tunnelnya pake perintah ini :
    ```bash
    $ sudo mkdir /etc/cloudflare
    $ sudo nano /etc/cloudflare/config.yml
    ```
    Isi file config cloudflare saya kurang lebih kayak gini :
    ```bash
    tunnel: ImNoob_CF_Tunnel
    credentials-file: /home/imnoob/.cloudflared/cloudflare/credfile.json

    ingres:
      - hostname: owndrive.imnoob.net
        service: http://localhost:8082
      - service: http_status: 404
    ```
    Sedikit penjelasan mengenai isi config filenya :
    - tunnel : Ini saya isi dengan nama tunnelnya, nanti akan kedetect di cloudflare dashboard juga ini tunnel
    - credentials-file : ini path ke credential file yang otomatis ke generate waktu berhasil login ke cloudflare pake pake perintah `cloudflared tunnel login` sebelumnya
    - hostname : alamat yang nanti dipake buat akses aplikasinya dari internet
    - service : ini saya  isi pake url dari aplikasi owncloud yang jalan di docker
    - Kalau mau tambah aplikasi lain untuk bisa diakses dari internet juga tinggal tambahin lagi hostname dengan alamat servicenya. Alamat service ini gak harus di host yang sama dengan cloudflared, bisa service dari host lain misalnya dari cctv kah, atau yang lain, tinggal sesuaikan dengan alamatnya kalau di akses dari jaringan rumah itu kayak gimana
4.  Ubah sedikit service `cloudflared` nya biar bisa nyambung ke file config yang kita buat :
    ```bash
    $ sudo systemctl edit --full cloudflared.service
    [Unit]
    Description=cloudflared
    After=network-online.target
    Wants=network-online.target

    [Service]
    TimeoutStartSec=0
    Type=notify
    ExecStart=/usr/bin/cloudflared --no-autoupdate --config /etc/cloudflared/config.yml tunnel run
    Restart=on-failure
    RestartSec=5s

    [Install]
    WantedBy=multi-user.target
    ```
    Cocokin aja path setelah `--config` ke path file confignya. Sudah sesuai semua langsung jalanin service cloudflarednya.
    ```bash
    $ sudo systemctl start cloudflared
    $ cloudflared tunnel list
    ```
    Perintah yang kedua buat nampilin nama tunnel cloudflare sama ID nya. Catat tunnel ID ini, ini nanti dipake buat arahin domain/subdomain ke cloudflare tunnelnya.

5.  Sekarang pergi ke [cloudflare dashboard](https://dash.cloudflare.com/) untuk buat DNS record baru yang diarahin ke cloudflare tunnel. Isiannya kurang lebih gini :
    - Type : CNAME
    - Name : owndrive
    - Target : tunnelid.cfargotunnel.com (sesuaikan tunnelid dengan yang udah dicatat sebelumnya)
    - Proxy status : Proxied
6.  Udah, gitu aja. tunggu beberapa saat trus coba deh akses alamat https://owndrive.imnoob.net (atau alamat lain sesuai config tadi) harusnya udah bisa muncul aplikasinya.

----------
Pokoknya pake cloudflare tunnel ini cukup puas lah, beberapa poin plus menurutku :
- Bisa akses aplikasi di jaringan rumah dari internet
- Gak perlu beli hosting yang mahal hanya untuk nge-host aplikasi-aplikasi kecil buatan sendiri 
- Bisa manfaatin fitur keamanan cloudflare yang gratis kalau masih skala kecil
- de el el, de el el

