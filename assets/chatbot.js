/**
 * KTMB KITS AI Assistant – Chatbot Engine
 * Rule-based knowledge base with bilingual support (EN / BM)
 */
(function () {
  'use strict';

  // ─── Knowledge Base ───────────────────────────────────────────────────────

  const KB = {
    en: {
      greeting: [
        "Hello! I'm <strong>KAI</strong>, your KTMB virtual assistant. How can I help you today? 🚆",
        "Hi there! I'm <strong>KAI</strong>, KTMB's AI helper. Ask me anything about train schedules, booking, or services!"
      ],
      farewell: [
        "Thank you for chatting! Have a pleasant journey! 🚆",
        "Safe travels! Feel free to chat again if you need help. Goodbye! 👋"
      ],
      thanks: [
        "You're welcome! Is there anything else I can help with?",
        "Happy to help! Let me know if you have more questions."
      ],
      unknown: [
        "I'm sorry, I didn't quite understand that. Could you rephrase? You can ask me about train types, schedules, fares, booking, or stations.",
        "Hmm, I'm not sure about that. Try asking about booking, ETS trains, Komuter routes, or station info!"
      ],

      // --- Topics ---
      booking: {
        keywords: ['book', 'ticket', 'purchase', 'buy', 'reserve', 'tempah', 'tiket'],
        response: `To book a train ticket:<br>
1️⃣ Go to <a href="index.html" style="color:var(--accent)">Home Page</a> and select your service, origin, destination, and date.<br>
2️⃣ Click <strong>"Search Available Trains"</strong>.<br>
3️⃣ Choose your train, pick your seats, and fill in passenger details.<br>
4️⃣ Choose your payment method and complete the booking!<br><br>
💡 <em>You need to be logged in to complete a booking.</em>`
      },

      roundtrip: {
        keywords: ['round trip', 'return', 'two way', 'balik', 'pergi balik', 'return ticket'],
        response: `For a <strong>Round Trip</strong> booking:<br>
• Select <strong>"Round Trip"</strong> on the home booking widget.<br>
• Choose both your <strong>Departure Date</strong> and <strong>Return Date</strong>.<br>
• The system will search for available trains for both journeys!<br><br>
💡 Both outbound and return trains must be selected separately.`
      },

      available_trains: {
        keywords: ['available', 'trains are available', 'available train', 'list of trains', 'what train', 'trains available', 'list trains', 'what trains are available', 'available trains', 'what trains are there', 'apa tren', 'tren yang ada'],
        response: `Here are the available train services in our KITS system:<br><br>
🚄 <strong>ETS & Intercity Services:</strong><br>
• <strong>ETS Platinum 9121 / 9131</strong> (Butterworth ⇄ KL Sentral)<br>
• <strong>ETS Gold 9023</strong> (Ipoh ⇄ KL Sentral)<br>
• <strong>KTM Northern Express</strong> (Butterworth ⇄ KL Sentral)<br>
• <strong>KTM Intercity</strong> (Gemas ⇄ JB Sentral ⇄ Singapore)<br><br>
🚆 <strong>KTM Komuter Services:</strong><br>
• <strong>Klang Valley Line:</strong> Batu Caves ⇄ KL Sentral ⇄ Pulau Sebang<br>
• <strong>Northern Line:</strong> Butterworth ⇄ Arau ⇄ Padang Besar<br><br>
💡 <em>You can check live schedules, timings, and platform details on the <a href="status.html" style="color:var(--accent)">Live Status Page</a>, or select a route on the <a href="index.html" style="color:var(--accent)">Home Page</a> to book seats!</em>`
      },

      ets: {
        keywords: ['ets', 'electric train', 'intercity', 'high speed', 'express', 'fast train'],
        response: `<strong>ETS (Electric Train Service)</strong> is KTMB's flagship service:<br>
🚄 <strong>Top Speed:</strong> 140 km/h<br>
📍 <strong>Coverage:</strong> KL Sentral ↔ Padang Besar (Perlis) + JB Sentral<br>
🎟️ <strong>Classes:</strong> Premier & Economy<br>
⏱️ <strong>KL–Penang:</strong> ~4 hrs 15 mins<br>
⏱️ <strong>KL–Ipoh:</strong> ~2 hrs 40 mins<br><br>
ETS & Intercity trains also feature Wi-Fi, power outlets, and bistro service.`
      },

      komuter: {
        keywords: ['komuter', 'commuter', 'klang valley', 'lembah klang', 'northern', 'suburban', 'ktm komuter'],
        response: `<strong>KTM Komuter</strong> serves two regions:<br><br>
🚆 <strong>Klang Valley Network:</strong><br>
• Batu Caves ↔ KL Sentral ↔ Pulau Sebang<br>
• Frequency: every 15–30 minutes<br><br>
🚆 <strong>Northern Network:</strong><br>
• Butterworth ↔ Padang Besar<br>
• Connects Penang mainland with Perlis<br><br>
💡 Komuter tickets are more affordable than ETS and ideal for daily commuters.`
      },

      intercity: {
        keywords: ['intercity', 'night train', 'diesel', 'east coast', 'pantai timur', 'jb', 'johor bahru'],
        response: `<strong>KTM Intercity</strong> is KTMB's long-distance classic rail:<br>
🚂 <strong>Type:</strong> Diesel Express<br>
📍 <strong>Routes:</strong> East Coast line + JB Sentral ↔ Singapore connections<br>
🌙 Includes overnight services for long-distance journeys<br>
🪑 Features comfortable reclining seats and a dining car<br><br>
Perfect for cross-state travel with scenic countryside views!`
      },

      stations: {
        keywords: ['station', 'stesen', 'where', 'location', 'stop', 'stops', 'berhenti'],
        response: `<strong>Major KTMB Stations:</strong><br><br>
🔵 <strong>ETS & Intercity:</strong><br>
KL Sentral • Tanjung Malim • Tapah Road • Ipoh • Sungai Petani • Butterworth • Arau • Padang Besar • Seremban • Gemas • Kluang • JB Sentral<br><br>
🟢 <strong>Komuter Klang Valley:</strong><br>
Batu Caves • Sentul • KL Sentral • Midvalley • Bandar Tasik Selatan • Kajang • Nilai<br><br>
🟡 <strong>Komuter Northern:</strong><br>
Butterworth • Bukit Tengah • Bukit Mertajam • Arau • Padang Besar`
      },

      fares: {
        keywords: ['fare', 'price', 'cost', 'how much', 'rm', 'berapa', 'harga', 'tambang', 'cheap'],
        response: `<strong>KTMB Fare Guide (Approximate):</strong><br><br>
🚄 <strong>ETS (Economy):</strong><br>
• KL Sentral → Ipoh: ~RM 35–45<br>
• KL Sentral → Butterworth: ~RM 65–90<br>
• KL Sentral → JB Sentral: ~RM 50–70<br><br>
🚆 <strong>Komuter:</strong><br>
• Most trips: RM 1.00 – RM 12.00<br><br>
💡 Prices vary by departure time and seat class. Book early for best prices!`
      },

      schedule: {
        keywords: ['schedule', 'timetable', 'jadual', 'when', 'time', 'depart', 'arrival', 'berlepas', 'tiba'],
        response: `To check train schedules:<br>
🗓️ Visit the <a href="index.html" style="color:var(--accent)">Home Page</a> and use the booking widget to search by date and route.<br>
📊 Or visit the <a href="status.html" style="color:var(--accent)">Live Status Page</a> for real-time departure & arrival info.<br><br>
<strong>General Operating Hours:</strong><br>
• ETS: First train ~06:00, Last ~22:00<br>
• Komuter: ~05:30 – 23:30 (Klang Valley)<br>
• Intercity: Some overnight services available`
      },

      payment: {
        keywords: ['payment', 'pay', 'bayar', 'card', 'fpx', 'tng', 'touch n go', 'ewallet', 'credit', 'debit', 'online banking'],
        response: `<strong>Accepted Payment Methods:</strong><br><br>
💳 <strong>Credit / Debit Card</strong> (Visa, Mastercard)<br>
🏦 <strong>FPX Online Banking</strong> (Maybank, CIMB, etc.)<br>
📱 <strong>Touch 'n Go eWallet</strong><br><br>
💡 All transactions are secure and encrypted. You will receive an e-ticket via the system upon successful payment.`
      },

      refund: {
        keywords: ['refund', 'cancel', 'batal', 'pulangkan', 'wang balik', 'cancellation'],
        response: `<strong>Cancellation & Refund Policy:</strong><br><br>
• Cancellations made <strong>&gt;48 hours</strong> before departure: Full refund (minus processing fee)<br>
• Cancellations within <strong>24–48 hours</strong>: 50% refund<br>
• Cancellations within <strong>24 hours</strong>: No refund<br><br>
💡 To cancel, visit <em>My Bookings</em> in your account. Refunds are processed within 7–14 business days.`
      },

      luggage: {
        keywords: ['luggage', 'baggage', 'bag', 'beg', 'barang', 'suitcase', 'cargo'],
        response: `<strong>KTMB Luggage Policy:</strong><br><br>
🧳 <strong>Free Allowance:</strong> 20 kg per passenger<br>
📦 <strong>Dimensions:</strong> Max 75 cm × 55 cm × 40 cm per piece<br>
🚫 Hazardous items and oversized goods are not permitted in passenger coaches<br><br>
💡 For large cargo, use KTMB's separate cargo service. Contact KTMB at <strong>03-2267 1200</strong>.`
      },

      contact: {
        keywords: ['contact', 'phone', 'call', 'hubungi', 'telefon', 'customer service', 'help', 'support', 'bantuan'],
        response: `<strong>KTMB Customer Support:</strong><br><br>
📞 <strong>Hotline:</strong> 03-2267 1200<br>
📧 <strong>Email:</strong> customerservice@ktmb.com.my<br>
🌐 <strong>Website:</strong> www.ktmb.com.my<br>
🕐 <strong>Operating Hours:</strong> Mon–Fri, 8:00 AM – 5:00 PM<br><br>
💡 For urgent matters like lost items or train delays, call the hotline directly.`
      },

      live_status: {
        keywords: ['live', 'delay', 'on time', 'status', 'real time', 'lewat', 'tepat', 'platform'],
        response: `To check <strong>Live Train Status</strong>:<br>
📊 Visit the <a href="status.html" style="color:var(--accent)">Live Status Page</a>.<br><br>
You can filter by:<br>
• 🚄 Service type (ETS, Komuter Klang Valley, Komuter Northern)<br>
• 📅 Date<br>
• 🔍 Train name or station name<br>
• 🛫 Departures or Arrivals tab`
      },

      wifi: {
        keywords: ['wifi', 'wi-fi', 'internet', 'connect', 'online'],
        response: `<strong>Onboard Wi-Fi:</strong><br>
📶 Free Wi-Fi is available on <strong>ETS</strong> and select <strong>Intercity</strong> trains.<br>
• Connect to <strong>"KTM_WiFi"</strong> network<br>
• No password required<br>
• Speed may vary depending on coverage area<br><br>
💡 KTM Komuter trains currently do not have onboard Wi-Fi.`
      },

      seats: {
        keywords: ['seat', 'class', 'premier', 'economy', 'tempat duduk', 'kelas', 'upgrade'],
        response: `<strong>Seat Classes on ETS:</strong><br><br>
⭐ <strong>Premier Class:</strong><br>
• Wider, more comfortable seats<br>
• Extra legroom<br>
• Hot meal included (selected services)<br>
• ~30% higher price than Economy<br><br>
💺 <strong>Economy Class:</strong><br>
• Standard comfortable seating<br>
• Power outlets at each seat<br>
• Great value for money<br><br>
Both classes have air-conditioning and access to bistro service.`
      },

      children: {
        keywords: ['child', 'children', 'kid', 'baby', 'infant', 'kanak', 'bayi', 'anak'],
        response: `<strong>Children's Fares & Policy:</strong><br><br>
👶 <strong>Infants (Under 2):</strong> Free (no seat assigned)<br>
🧒 <strong>Children (Ages 2–12):</strong> 50% discount off adult fare<br>
👦 <strong>Ages 13+:</strong> Full adult fare<br><br>
💡 Children must be accompanied by an adult at all times. Children aged 2–12 must have their own ticket.`
      },

      senior: {
        keywords: ['senior', 'elderly', 'oku', 'disabled', 'warga emas', 'kurang upaya', 'discount'],
        response: `<strong>Special Discounts:</strong><br><br>
👴 <strong>Senior Citizens (60+):</strong> 50% discount on ETS & Komuter (valid Malaysian IC required)<br>
♿ <strong>OKU (Disabled Persons):</strong> 50% discount (valid OKU card required)<br>
🎓 <strong>Students:</strong> Available for selected services (valid student card required)<br><br>
💡 Discounts must be claimed at the ticket counter or during online booking with valid documents.`
      },

      bistro: {
        keywords: ['bistro', 'food', 'meal', 'makan', 'eat', 'drink', 'minuman', 'makanan', 'nasi lemak'],
        response: `<strong>KTM Bistro Onboard:</strong><br><br>
🍱 Available on <strong>ETS</strong> and <strong>Intercity</strong> long-distance trains<br><br>
<strong>Menu Highlights:</strong><br>
• Nasi Lemak<br>
• Mee Goreng<br>
• Hot beverages (Teh Tarik, Coffee)<br>
• Snacks & packaged drinks<br><br>
💡 Prices are reasonable. Premier Class passengers may receive complimentary meals on selected services.`
      }
    },

    bm: {
      greeting: [
        "Selamat datang! Saya <strong>KAI</strong>, pembantu maya KTMB anda. Apa yang boleh saya bantu? 🚆",
        "Helo! Saya <strong>KAI</strong>, pembantu AI KTMB. Tanya saya tentang jadual tren, tempahan, atau perkhidmatan!"
      ],
      farewell: [
        "Terima kasih kerana berbual! Selamat menikmati perjalanan! 🚆",
        "Selamat jalan! Sila berbual lagi jika perlukan bantuan. Jumpa lagi! 👋"
      ],
      thanks: [
        "Sama-sama! Ada lagi yang boleh saya bantu?",
        "Dengan senang hati! Tanya saya jika ada soalan lain."
      ],
      unknown: [
        "Maaf, saya kurang faham. Boleh ulang semula? Anda boleh tanya tentang jenis tren, jadual, tambang, tempahan, atau stesen.",
        "Hmm, saya tidak pasti tentang itu. Cuba tanya tentang tempahan, tren ETS, laluan Komuter, atau maklumat stesen!"
      ],

      booking: {
        keywords: ['tempah', 'tiket', 'beli', 'book', 'pesan', 'ticket'],
        response: `Untuk tempah tiket tren:<br>
1️⃣ Pergi ke <a href="index.html" style="color:var(--accent)">Halaman Utama</a> dan pilih perkhidmatan, asal, destinasi, dan tarikh.<br>
2️⃣ Klik <strong>"Cari Kereta Api Tersedia"</strong>.<br>
3️⃣ Pilih tren anda, pilih tempat duduk, dan isi maklumat penumpang.<br>
4️⃣ Pilih kaedah pembayaran dan lengkapkan tempahan!<br><br>
💡 <em>Anda perlu log masuk untuk melengkapkan tempahan.</em>`
      },

      roundtrip: {
        keywords: ['pergi balik', 'tiket balik', 'pulang', 'return', 'dua hala'],
        response: `Untuk tempahan <strong>Pergi Balik</strong>:<br>
• Pilih <strong>"Pergi Balik"</strong> pada widget tempahan di Halaman Utama.<br>
• Pilih <strong>Tarikh Berlepas</strong> dan <strong>Tarikh Kembali</strong>.<br>
• Sistem akan mencari tren yang ada untuk kedua-dua perjalanan!<br><br>
💡 Tren pergi dan balik perlu dipilih secara berasingan.`
      },

      available_trains: {
        keywords: ['tren yang ada', 'tren ada', 'apa tren', 'kereta api', 'senarai tren', 'train yang ada', 'tren tersedia'],
        response: `Berikut adalah perkhidmatan tren yang tersedia dalam sistem KITS kami:<br><br>
🚄 <strong>Perkhidmatan ETS & Intercity:</strong><br>
• <strong>ETS Platinum 9121 / 9131</strong> (Butterworth ⇄ KL Sentral)<br>
• <strong>ETS Gold 9023</strong> (Ipoh ⇄ KL Sentral)<br>
• <strong>KTM Northern Express</strong> (Butterworth ⇄ KL Sentral)<br>
• <strong>KTM Intercity</strong> (Gemas ⇄ JB Sentral ⇄ Singapore)<br><br>
🚆 <strong>Perkhidmatan KTM Komuter:</strong><br>
• <strong>Laluan Lembah Klang:</strong> Batu Caves ⇄ KL Sentral ⇄ Pulau Sebang<br>
• <strong>Laluan Utara:</strong> Butterworth ⇄ Arau ⇄ Padang Besar<br><br>
💡 <em>Anda boleh menyemak jadual waktu, masa pelepasan, dan maklumat platform di <a href="status.html" style="color:var(--accent)">Halaman Status Live</a>, atau pilih laluan di <a href="index.html" style="color:var(--accent)">Halaman Utama</a> untuk menempah tempat duduk!</em>`
      },

      ets: {
        keywords: ['ets', 'elektrik', 'intercity', 'laju', 'ekspres', 'pantas'],
        response: `<strong>ETS (Electric Train Service)</strong> adalah perkhidmatan utama KTMB:<br>
🚄 <strong>Kelajuan Maks:</strong> 140 km/j<br>
📍 <strong>Liputan:</strong> KL Sentral ↔ Padang Besar (Perlis) + JB Sentral<br>
🎟️ <strong>Kelas:</strong> Premier & Ekonomi<br>
⏱️ <strong>KL–Penang:</strong> ~4 jam 15 minit<br>
⏱️ <strong>KL–Ipoh:</strong> ~2 jam 40 minit<br><br>
Tren ETS & Intercity dilengkapi Wi-Fi, soket kuasa, dan perkhidmatan bistro.`
      },

      komuter: {
        keywords: ['komuter', 'lembah klang', 'utara', 'northern', 'suburb'],
        response: `<strong>KTM Komuter</strong> melayani dua kawasan:<br><br>
🚆 <strong>Rangkaian Lembah Klang:</strong><br>
• Batu Caves ↔ KL Sentral ↔ Pulau Sebang<br>
• Kekerapan: setiap 15–30 minit<br><br>
🚆 <strong>Rangkaian Utara:</strong><br>
• Butterworth ↔ Padang Besar<br>
• Menghubungkan daratan Pulau Pinang dengan Perlis<br><br>
💡 Tiket Komuter lebih murah daripada ETS dan sesuai untuk penumpang harian.`
      },

      intercity: {
        keywords: ['intercity', 'tren malam', 'diesel', 'pantai timur', 'johor bahru'],
        response: `<strong>KTM Intercity</strong> adalah perkhidmatan jarak jauh KTMB:<br>
🚂 <strong>Jenis:</strong> Ekspres Diesel<br>
📍 <strong>Laluan:</strong> Pantai Timur + JB Sentral ↔ Singapura<br>
🌙 Termasuk perkhidmatan malam untuk perjalanan jauh<br>
🪑 Dilengkapi kerusi kline dan gerabak makan<br><br>
Sesuai untuk perjalanan merentasi negeri dengan pemandangan yang indah!`
      },

      stations: {
        keywords: ['stesen', 'station', 'mana', 'lokasi', 'berhenti'],
        response: `<strong>Stesen Utama KTMB:</strong><br><br>
🔵 <strong>ETS & Intercity:</strong><br>
KL Sentral • Tanjung Malim • Tapah Road • Ipoh • Sungai Petani • Butterworth • Arau • Padang Besar • Seremban • Gemas • Kluang • JB Sentral<br><br>
🟢 <strong>Komuter Lembah Klang:</strong><br>
Batu Caves • Sentul • KL Sentral • Midvalley • Bandar Tasik Selatan • Kajang • Nilai<br><br>
🟡 <strong>Komuter Utara:</strong><br>
Butterworth • Bukit Tengah • Bukit Mertajam • Arau • Padang Besar`
      },

      fares: {
        keywords: ['tambang', 'harga', 'berapa', 'murah', 'mahal', 'kos', 'rm'],
        response: `<strong>Panduan Tambang KTMB (Anggaran):</strong><br><br>
🚄 <strong>ETS (Ekonomi):</strong><br>
• KL Sentral → Ipoh: ~RM 35–45<br>
• KL Sentral → Butterworth: ~RM 65–90<br>
• KL Sentral → JB Sentral: ~RM 50–70<br><br>
🚆 <strong>Komuter:</strong><br>
• Kebanyakan perjalanan: RM 1.00 – RM 12.00<br><br>
💡 Harga berbeza mengikut masa berlepas dan kelas tempat duduk. Tempah awal untuk harga terbaik!`
      },

      schedule: {
        keywords: ['jadual', 'waktu', 'masa', 'bila', 'berlepas', 'tiba', 'schedule'],
        response: `Untuk semak jadual tren:<br>
🗓️ Lawati <a href="index.html" style="color:var(--accent)">Halaman Utama</a> dan gunakan widget tempahan untuk cari mengikut tarikh dan laluan.<br>
📊 Atau lawati <a href="status.html" style="color:var(--accent)">Halaman Status Live</a> untuk maklumat berlepas & ketibaan terkini.<br><br>
<strong>Waktu Operasi Umum:</strong><br>
• ETS: Tren pertama ~06:00, terakhir ~22:00<br>
• Komuter: ~05:30 – 23:30 (Lembah Klang)<br>
• Intercity: Terdapat perkhidmatan malam`
      },

      payment: {
        keywords: ['bayar', 'pembayaran', 'kad', 'fpx', 'tng', 'touch n go', 'ewallet', 'bank'],
        response: `<strong>Kaedah Pembayaran Yang Diterima:</strong><br><br>
💳 <strong>Kad Kredit / Debit</strong> (Visa, Mastercard)<br>
🏦 <strong>FPX Perbankan Online</strong> (Maybank, CIMB, dll.)<br>
📱 <strong>Touch 'n Go eWallet</strong><br><br>
💡 Semua transaksi adalah selamat dan disulitkan. Anda akan menerima e-tiket setelah pembayaran berjaya.`
      },

      refund: {
        keywords: ['batal', 'refund', 'pulangkan', 'wang balik', 'pembatalan'],
        response: `<strong>Polisi Pembatalan & Bayaran Balik:</strong><br><br>
• Pembatalan <strong>&gt;48 jam</strong> sebelum berlepas: Bayaran balik penuh (tolak yuran pemprosesan)<br>
• Pembatalan dalam <strong>24–48 jam</strong>: 50% bayaran balik<br>
• Pembatalan dalam <strong>24 jam</strong>: Tiada bayaran balik<br><br>
💡 Untuk batal, pergi ke <em>Tempahan Saya</em> dalam akaun anda. Bayaran balik diproses dalam 7–14 hari bekerja.`
      },

      luggage: {
        keywords: ['bagasi', 'beg', 'barang', 'luggage', 'kargo'],
        response: `<strong>Polisi Bagasi KTMB:</strong><br><br>
🧳 <strong>Had Percuma:</strong> 20 kg setiap penumpang<br>
📦 <strong>Saiz:</strong> Maks 75 sm × 55 sm × 40 sm setiap beg<br>
🚫 Bahan berbahaya dan barang bersaiz besar tidak dibenarkan dalam gerabak penumpang<br><br>
💡 Untuk kargo besar, gunakan perkhidmatan kargo KTMB. Hubungi KTMB di <strong>03-2267 1200</strong>.`
      },

      contact: {
        keywords: ['hubungi', 'telefon', 'nombor', 'customer service', 'bantuan', 'sokongan', 'contact'],
        response: `<strong>Sokongan Pelanggan KTMB:</strong><br><br>
📞 <strong>Hotline:</strong> 03-2267 1200<br>
📧 <strong>E-mel:</strong> customerservice@ktmb.com.my<br>
🌐 <strong>Laman Web:</strong> www.ktmb.com.my<br>
🕐 <strong>Waktu Operasi:</strong> Isnin–Jumaat, 8:00 PG – 5:00 PTG<br><br>
💡 Untuk hal mendesak seperti barang hilang atau kelewatan tren, hubungi terus talian hotline.`
      },

      live_status: {
        keywords: ['status live', 'lewat', 'tepat masa', 'platform', 'status tren', 'real time'],
        response: `Untuk semak <strong>Status Tren Live</strong>:<br>
📊 Lawati <a href="status.html" style="color:var(--accent)">Halaman Status Live</a>.<br><br>
Anda boleh tapis mengikut:<br>
• 🚄 Jenis perkhidmatan (ETS, Komuter Lembah Klang, Komuter Utara)<br>
• 📅 Tarikh<br>
• 🔍 Nama tren atau nama stesen<br>
• 🛫 Tab Berlepas atau Ketibaan`
      },

      wifi: {
        keywords: ['wifi', 'wi-fi', 'internet', 'sambung', 'online'],
        response: `<strong>Wi-Fi Dalam Tren:</strong><br>
📶 Wi-Fi percuma tersedia di tren <strong>ETS</strong> dan sesetengah tren <strong>Intercity</strong>.<br>
• Sambung ke rangkaian <strong>"KTM_WiFi"</strong><br>
• Tiada kata laluan diperlukan<br>
• Kelajuan mungkin berbeza mengikut kawasan liputan<br><br>
💡 Tren KTM Komuter pada masa ini tidak mempunyai Wi-Fi dalam tren.`
      },

      seats: {
        keywords: ['tempat duduk', 'kelas', 'premier', 'ekonomi', 'naik taraf', 'seat'],
        response: `<strong>Kelas Tempat Duduk ETS:</strong><br><br>
⭐ <strong>Kelas Premier:</strong><br>
• Tempat duduk lebih lebar dan selesa<br>
• Ruang kaki yang lebih besar<br>
• Makanan panas termasuk (perkhidmatan terpilih)<br>
• ~30% lebih mahal daripada Ekonomi<br><br>
💺 <strong>Kelas Ekonomi:</strong><br>
• Tempat duduk standard yang selesa<br>
• Soket kuasa di setiap tempat duduk<br>
• Nilai yang berpatutan<br><br>
Kedua-dua kelas ada pendingin hawa dan akses perkhidmatan bistro.`
      },

      children: {
        keywords: ['kanak', 'budak', 'anak', 'bayi', 'child', 'baby'],
        response: `<strong>Tambang & Polisi Kanak-Kanak:</strong><br><br>
👶 <strong>Bayi (Bawah 2 tahun):</strong> Percuma (tiada tempat duduk diberikan)<br>
🧒 <strong>Kanak-kanak (2–12 tahun):</strong> Diskaun 50% daripada tambang dewasa<br>
👦 <strong>Umur 13+:</strong> Tambang dewasa penuh<br><br>
💡 Kanak-kanak mesti ditemani oleh orang dewasa. Kanak-kanak berumur 2–12 tahun mesti mempunyai tiket sendiri.`
      },

      senior: {
        keywords: ['warga emas', 'oku', 'kurang upaya', 'diskaun', 'senior', 'disabled'],
        response: `<strong>Diskaun Khas:</strong><br><br>
👴 <strong>Warga Emas (60+):</strong> Diskaun 50% untuk ETS & Komuter (perlu IC Malaysia yang sah)<br>
♿ <strong>OKU (Orang Kurang Upaya):</strong> Diskaun 50% (perlu kad OKU yang sah)<br>
🎓 <strong>Pelajar:</strong> Tersedia untuk perkhidmatan terpilih (perlu kad pelajar yang sah)<br><br>
💡 Diskaun mesti dituntut di kaunter tiket atau semasa tempahan dalam talian dengan dokumen yang sah.`
      },

      bistro: {
        keywords: ['bistro', 'makan', 'makanan', 'minuman', 'nasi lemak', 'food', 'eat'],
        response: `<strong>KTM Bistro Dalam Tren:</strong><br><br>
🍱 Tersedia di tren <strong>ETS</strong> dan tren <strong>Intercity</strong> jarak jauh<br><br>
<strong>Menu Pilihan:</strong><br>
• Nasi Lemak<br>
• Mee Goreng<br>
• Minuman panas (Teh Tarik, Kopi)<br>
• Snek & minuman botol<br><br>
💡 Harga adalah berpatutan. Penumpang Kelas Premier mungkin menerima makanan percuma pada perkhidmatan terpilih.`
      }
    }
  };

  // ─── Suggested Questions ──────────────────────────────────────────────────

  const SUGGESTIONS = {
    en: [
      "How do I book a ticket?",
      "What trains are available?",
      "What are the fares?",
      "How to check live status?",
      "What payment methods are accepted?"
    ],
    bm: [
      "Macam mana nak tempah tiket?",
      "Apa tren yang ada?",
      "Berapa tambang tren?",
      "Macam mana nak semak status live?",
      "Kaedah bayaran apa yang diterima?"
    ]
  };

  // ─── AI Response Engine ───────────────────────────────────────────────────

  function getLang() {
    return localStorage.getItem('kits_lang') || 'en';
  }

  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getResponse(userInput) {
    const lang = getLang();
    const dict = KB[lang] || KB.en;
    const input = userInput.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|helo|assalamualaikum|selamat|salam|good morning|good afternoon|hai|oi)\b/.test(input)) {
      return getRandom(dict.greeting);
    }

    // Farewells
    if (/\b(bye|goodbye|selamat tinggal|jumpa lagi|thanks bye|ok bye|ok thanks|ok terima kasih)\b/.test(input)) {
      return getRandom(dict.farewell);
    }

    // Thanks
    if (/\b(thank|thanks|terima kasih|tq|syukran|thank you)\b/.test(input)) {
      return getRandom(dict.thanks);
    }

    // Topic matching
    const topics = ['available_trains', 'booking', 'roundtrip', 'ets', 'komuter', 'intercity', 'stations', 'fares', 'schedule', 'payment', 'refund', 'luggage', 'contact', 'live_status', 'wifi', 'seats', 'children', 'senior', 'bistro'];

    for (const topic of topics) {
      if (!dict[topic]) continue;
      const keywords = dict[topic].keywords || [];
      if (keywords.some(kw => input.includes(kw))) {
        return dict[topic].response;
      }
    }

    // Fallback
    return getRandom(dict.unknown);
  }

  // ─── Chatbot UI ───────────────────────────────────────────────────────────

  const CHAT_WIDGET_ID = 'ktmb-chatbot-widget';
  const CHAT_TOGGLE_ID = 'ktmb-chat-toggle';
  const CHAT_PANEL_ID  = 'ktmb-chat-panel';
  const CHAT_MSGS_ID   = 'ktmb-chat-messages';
  const CHAT_INPUT_ID  = 'ktmb-chat-input';
  const CHAT_SEND_ID   = 'ktmb-chat-send';
  const CHAT_CLOSE_ID  = 'ktmb-chat-close';
  const CHAT_SUGG_ID   = 'ktmb-chat-suggestions';

  let isOpen = false;
  let hasGreeted = false;

  function createWidget() {
    const existing = document.getElementById(CHAT_WIDGET_ID);
    if (existing) return;

    const widget = document.createElement('div');
    widget.id = CHAT_WIDGET_ID;
    widget.innerHTML = `
      <!-- Toggle Button -->
      <button id="${CHAT_TOGGLE_ID}" class="chatbot-toggle" aria-label="Open KAI Assistant" title="Chat with KAI">
        <span class="chatbot-toggle-icon chatbot-icon-open">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span class="chatbot-toggle-icon chatbot-icon-close" style="display:none;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
        <span class="chatbot-notif-dot" id="chatbot-notif-dot"></span>
      </button>

      <!-- Chat Panel -->
      <div id="${CHAT_PANEL_ID}" class="chatbot-panel" style="display:none;" role="dialog" aria-label="KTMB KAI Assistant">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4z"/>
                <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor"/>
                <circle cx="16.5" cy="15.5" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div class="chatbot-name">KAI Assistant</div>
              <div class="chatbot-status">
                <span class="chatbot-status-dot"></span>
                Online
              </div>
            </div>
          </div>
          <button id="${CHAT_CLOSE_ID}" class="chatbot-close-btn" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div id="${CHAT_MSGS_ID}" class="chatbot-messages" aria-live="polite"></div>

        <!-- Suggestions -->
        <div id="${CHAT_SUGG_ID}" class="chatbot-suggestions"></div>

        <!-- Input Area -->
        <div class="chatbot-input-area">
          <input type="text" id="${CHAT_INPUT_ID}" class="chatbot-input" placeholder="Type your message..." maxlength="300" autocomplete="off">
          <button id="${CHAT_SEND_ID}" class="chatbot-send-btn" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="chatbot-footer-note">Powered by <strong>KAI</strong> · KTMB Virtual Assistant</div>
      </div>
    `;

    document.body.appendChild(widget);
    bindEvents();
  }

  function addMessage(text, sender, delay = 0) {
    const msgs = document.getElementById(CHAT_MSGS_ID);
    if (!msgs) return;

    const wrapper = document.createElement('div');
    wrapper.className = `chatbot-msg-wrapper ${sender === 'bot' ? 'bot' : 'user'}`;

    if (sender === 'bot') {
      wrapper.innerHTML = `
        <div class="chatbot-msg-avatar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4z"/>
            <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor"/>
            <circle cx="16.5" cy="15.5" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <div class="chatbot-bubble bot">${text}</div>
      `;
    } else {
      wrapper.innerHTML = `<div class="chatbot-bubble user">${text}</div>`;
    }

    msgs.appendChild(wrapper);
    setTimeout(() => {
      msgs.scrollTop = msgs.scrollHeight;
    }, 10);
  }

  function showTyping() {
    const msgs = document.getElementById(CHAT_MSGS_ID);
    if (!msgs) return null;

    const typingEl = document.createElement('div');
    typingEl.className = 'chatbot-msg-wrapper bot';
    typingEl.id = 'chatbot-typing';
    typingEl.innerHTML = `
      <div class="chatbot-msg-avatar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4z"/>
          <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor"/>
          <circle cx="16.5" cy="15.5" r="1.5" fill="currentColor"/>
        </svg>
      </div>
      <div class="chatbot-bubble bot chatbot-typing-bubble">
        <span class="chatbot-dot"></span>
        <span class="chatbot-dot"></span>
        <span class="chatbot-dot"></span>
      </div>
    `;
    msgs.appendChild(typingEl);
    msgs.scrollTop = msgs.scrollHeight;
    return typingEl;
  }

  function removeTyping() {
    const el = document.getElementById('chatbot-typing');
    if (el) el.remove();
  }

  function renderSuggestions() {
    // Initial suggestions shown in the fixed bar on first open
    const suggEl = document.getElementById(CHAT_SUGG_ID);
    if (!suggEl) return;
    const lang = getLang();
    const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.en;
    suggEl.innerHTML = '';
    suggestions.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-sugg-btn';
      btn.textContent = s;
      btn.addEventListener('click', () => {
        // Remove this suggestion bar when user picks one
        suggEl.style.display = 'none';
        handleSend(s);
      });
      suggEl.appendChild(btn);
    });
    suggEl.style.display = 'flex';
  }

  function addInlineSuggestions() {
    // Render suggestion chips directly inside the message thread after a bot reply
    const msgs = document.getElementById(CHAT_MSGS_ID);
    if (!msgs) return;
    const lang = getLang();
    const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.en;

    // Remove any previous inline suggestion row
    const oldRow = msgs.querySelector('.chatbot-inline-sugg-row');
    if (oldRow) oldRow.remove();

    const row = document.createElement('div');
    row.className = 'chatbot-inline-sugg-row';

    const label = document.createElement('div');
    label.className = 'chatbot-inline-sugg-label';
    label.textContent = lang === 'bm' ? 'Ada lagi soalan?' : 'Ask another question:';
    row.appendChild(label);

    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'chatbot-inline-sugg-chips';

    suggestions.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-sugg-btn chatbot-inline-chip';
      btn.textContent = s;
      btn.addEventListener('click', () => {
        // Remove the row when user picks a chip
        row.remove();
        handleSend(s);
      });
      chipsWrap.appendChild(btn);
    });

    row.appendChild(chipsWrap);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function handleSend(text) {
    const input = text || (document.getElementById(CHAT_INPUT_ID) || {}).value;
    if (!input || !input.trim()) return;

    // Clear input
    const inputEl = document.getElementById(CHAT_INPUT_ID);
    if (inputEl) inputEl.value = '';

    // Hide the fixed suggestion bar permanently once user starts chatting
    const suggEl = document.getElementById(CHAT_SUGG_ID);
    if (suggEl) suggEl.style.display = 'none';

    // Remove any existing inline suggestion row immediately
    const msgs = document.getElementById(CHAT_MSGS_ID);
    if (msgs) {
      const oldRow = msgs.querySelector('.chatbot-inline-sugg-row');
      if (oldRow) oldRow.remove();
    }

    // Add user message
    addMessage(input.trim(), 'user');

    // Show typing indicator
    showTyping();

    // Bot reply with simulated delay
    const thinkTime = 600 + Math.random() * 700;
    setTimeout(() => {
      removeTyping();
      const reply = getResponse(input.trim());
      addMessage(reply, 'bot');
      // After bot replies, show inline suggestions again
      addInlineSuggestions();
    }, thinkTime);
  }

  function openPanel() {
    const panel = document.getElementById(CHAT_PANEL_ID);
    const toggleIconOpen = document.querySelector('.chatbot-icon-open');
    const toggleIconClose = document.querySelector('.chatbot-icon-close');
    const notifDot = document.getElementById('chatbot-notif-dot');

    if (!panel) return;
    isOpen = true;
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';

    if (toggleIconOpen) toggleIconOpen.style.display = 'none';
    if (toggleIconClose) toggleIconClose.style.display = 'block';
    if (notifDot) notifDot.style.display = 'none';

    // Animate in
    requestAnimationFrame(() => {
      panel.classList.add('open');
    });

    // Greet on first open
    if (!hasGreeted) {
      hasGreeted = true;
      const lang = getLang();
      const dict = KB[lang] || KB.en;
      setTimeout(() => {
        addMessage(getRandom(dict.greeting), 'bot');
        renderSuggestions();
      }, 300);
    }

    // Focus input
    setTimeout(() => {
      const inputEl = document.getElementById(CHAT_INPUT_ID);
      if (inputEl) inputEl.focus();
    }, 350);
  }

  function closePanel() {
    const panel = document.getElementById(CHAT_PANEL_ID);
    const toggleIconOpen = document.querySelector('.chatbot-icon-open');
    const toggleIconClose = document.querySelector('.chatbot-icon-close');
    if (!panel) return;

    isOpen = false;
    panel.classList.remove('open');

    if (toggleIconOpen) toggleIconOpen.style.display = 'block';
    if (toggleIconClose) toggleIconClose.style.display = 'none';

    setTimeout(() => {
      if (!isOpen) panel.style.display = 'none';
    }, 300);
  }

  function bindEvents() {
    const toggle = document.getElementById(CHAT_TOGGLE_ID);
    const closeBtn = document.getElementById(CHAT_CLOSE_ID);
    const sendBtn = document.getElementById(CHAT_SEND_ID);
    const inputEl = document.getElementById(CHAT_INPUT_ID);

    if (toggle) toggle.addEventListener('click', () => { isOpen ? closePanel() : openPanel(); });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (sendBtn) sendBtn.addEventListener('click', () => handleSend());
    if (inputEl) {
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }

    // Update placeholder on language change (observe localStorage)
    const langObs = new MutationObserver(() => {
      if (inputEl) {
        const lang = getLang();
        inputEl.placeholder = lang === 'bm' ? 'Taip mesej anda...' : 'Type your message...';
      }
    });
    langObs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    // Show notif dot after 3s to attract attention
    setTimeout(() => {
      if (!isOpen) {
        const dot = document.getElementById('chatbot-notif-dot');
        if (dot) dot.style.display = 'block';
      }
    }, 3000);
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidget);
    } else {
      createWidget();
    }
  }

  init();

})();
