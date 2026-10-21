/**
 * dictionaries.ts
 * All UI strings for Mili in English (en) and Bahasa Melayu (bm).
 *
 * - `en` is the source of truth. `bm` is typed against it, so a missing or
 *   misspelled BM key is a compile error.
 * - Keep wording plain and jargon-free (our users are micro-business owners).
 * - `tips` must have the same number of items in both languages so the
 *   "tip of the day" index points at the same tip in EN and BM.
 */

export type Language = 'en' | 'bm';
export const DEFAULT_LANGUAGE: Language = 'en';

const en = {
  common: {
    appName: 'Mili',
    mainNavigation: 'Main navigation',
    skipToContent: 'Skip to main content',
    comingSoon: 'This page is coming soon.',
  },

  // Sidebar links + page titles (the header title reads from here too)
  nav: {
    home: 'Home',
    financialTracker: 'Financial Tracker',
    income: 'Income',
    expenses: 'Expenses',
    receipts: 'Receipts',
    csvImport: 'CSV Import',
    sustainability: 'Sustainability Check',
    tips: 'Tips of the Day',
    community: 'Community & Directory',
    mentor: 'Become a Mentor',
    settings: 'Settings',
    profile: 'Profile',
  },

  header: {
    goHome: 'Go to home page',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    language: 'Language',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    notifications: 'Notifications',
    noNotifications: 'You are all caught up.',
    markAllRead: 'Mark all as read',
    tipOfTheDay: 'Business Tip of the Day',
    moreTips: 'See more tips',
    accountMenu: 'Account menu',
    guestName: 'Guest',
    businessTypeNotSet: 'Business type not set',
    logout: 'Log out',
  },

  notifications: {
    mentorFoundTitle: 'Mentor found!',
    mentorFoundBody: 'A mentor who matches your business is ready to connect.',
    forumReplyTitle: 'New reply in the forum',
    forumReplyBody: 'Someone replied to your question.',
  },

  // Pages outside the app shell
  auth: {
    login: 'Log in',
    loginComingSoon: 'The login page is coming soon.',
  },

  // Floating AI chat (components/FloatingChat.tsx)
  chat: {
    openChat: 'Ask Mili Assistant',
    closeChat: 'Close chat',
    title: 'Mili Assistant',
    subtitle: 'Ask about your business, money or saving costs',
    welcome:
      'Hi! I am Mili. Ask me anything about running your business, managing your money, or saving costs the green way. You can type, or tap the microphone and speak.',
    suggestionsLabel: 'Try asking:',
    suggestions: [
      'How do I know if I am making a profit?',
      'How should I price my products?',
      'What are easy ways to lower my electricity bill?',
    ],
    placeholder: 'Type your question…',
    send: 'Send',
    newChat: 'Start a new chat',
    startVoice: 'Speak your question',
    stopVoice: 'Stop listening',
    listening: 'Listening… please speak',
    micDenied: 'The microphone is blocked. Please allow microphone access in your browser settings.',
    micNoSpeech: 'I did not hear anything. Please try again.',
    micError: 'Voice typing did not work. You can type your question instead.',
    thinking: 'Mili is thinking…',
    disclaimer: 'Mili gives general tips, not professional financial, tax or legal advice.',
    retry: 'Try again',
    errors: {
      network: 'No internet connection. Please check it and try again.',
      not_configured: 'The assistant is not set up yet. Please tell the app team.',
      bad_request: 'Sorry, I could not read that message. Please try a shorter one.',
      rate_limited: 'Many people are asking right now. Please wait a moment and try again.',
      upstream: 'Sorry, something went wrong. Please try again.',
      blocked: 'Sorry, I cannot answer that one. Please try asking in a different way.',
    },
  },

  // Keys match the `business_type` value saved on the user profile
  businessTypes: {
    food_beverages: 'Food & Beverages',
    handcrafted: 'Handcrafted',
    retail: 'Retail',
    services: 'Services',
    agriculture: 'Agriculture',
    other: 'Other',
  },

  // Short, plain-language tips (placeholder list, replace with generated tips)
  tips: [
    'Write down every sale and every expense, even the small ones. Small amounts add up.',
    'Keep your business money and your personal money separate.',
    'Set aside a little from every sale as savings, even just 5%.',
    'Know your profit on each product: selling price minus everything it cost to make.',
    'Ask your regular customers what they like. Their answers are free market research.',
    'Reusable packaging and switching off idle equipment can lower your monthly bills.',
    'Pay yourself a fixed amount each month instead of taking cash whenever you need it.',
  ],
};

export type Dictionary = typeof en;

const bm: Dictionary = {
  common: {
    appName: 'Mili',
    mainNavigation: 'Navigasi utama',
    skipToContent: 'Langkau ke kandungan utama',
    comingSoon: 'Halaman ini akan hadir tidak lama lagi.',
  },

  nav: {
    home: 'Utama',
    financialTracker: 'Penjejak Kewangan',
    income: 'Pendapatan',
    expenses: 'Perbelanjaan',
    receipts: 'Resit',
    csvImport: 'Import CSV',
    sustainability: 'Semakan Kelestarian',
    tips: 'Tip Hari Ini',
    community: 'Komuniti & Direktori',
    mentor: 'Jadi Mentor',
    settings: 'Tetapan',
    profile: 'Profil',
  },

  header: {
    goHome: 'Pergi ke halaman utama',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    collapseSidebar: 'Kecilkan bar sisi',
    expandSidebar: 'Besarkan bar sisi',
    language: 'Bahasa',
    switchToDark: 'Tukar ke mod gelap',
    switchToLight: 'Tukar ke mod cerah',
    notifications: 'Notifikasi',
    noNotifications: 'Tiada notifikasi baharu.',
    markAllRead: 'Tandakan semua sudah dibaca',
    tipOfTheDay: 'Tip Perniagaan Hari Ini',
    moreTips: 'Lihat lebih banyak tip',
    accountMenu: 'Menu akaun',
    guestName: 'Tetamu',
    businessTypeNotSet: 'Jenis perniagaan belum ditetapkan',
    logout: 'Log keluar',
  },

  notifications: {
    mentorFoundTitle: 'Mentor ditemui!',
    mentorFoundBody: 'Seorang mentor yang sesuai dengan perniagaan anda sedia untuk berhubung.',
    forumReplyTitle: 'Balasan baharu di forum',
    forumReplyBody: 'Seseorang telah membalas soalan anda.',
  },

  auth: {
    login: 'Log masuk',
    loginComingSoon: 'Halaman log masuk akan hadir tidak lama lagi.',
  },

  chat: {
    openChat: 'Tanya Pembantu Mili',
    closeChat: 'Tutup sembang',
    title: 'Pembantu Mili',
    subtitle: 'Tanya tentang perniagaan, wang atau cara jimat kos',
    welcome:
      'Hai! Saya Mili. Tanya apa sahaja tentang menjalankan perniagaan, mengurus wang atau menjimatkan kos dengan cara mesra alam. Anda boleh menaip, atau tekan mikrofon dan bercakap.',
    suggestionsLabel: 'Cuba tanya:',
    suggestions: [
      'Bagaimana saya tahu perniagaan saya untung?',
      'Bagaimana hendak tetapkan harga produk saya?',
      'Apakah cara mudah untuk kurangkan bil elektrik?',
    ],
    placeholder: 'Taip soalan anda…',
    send: 'Hantar',
    newChat: 'Mulakan sembang baharu',
    startVoice: 'Sebut soalan anda',
    stopVoice: 'Berhenti mendengar',
    listening: 'Sedang mendengar… sila bercakap',
    micDenied: 'Mikrofon disekat. Sila benarkan akses mikrofon dalam tetapan pelayar anda.',
    micNoSpeech: 'Saya tidak dengar apa-apa. Sila cuba lagi.',
    micError: 'Menaip dengan suara tidak berfungsi. Anda boleh menaip soalan anda.',
    thinking: 'Mili sedang berfikir…',
    disclaimer: 'Mili memberi petua am, bukan nasihat profesional kewangan, cukai atau undang-undang.',
    retry: 'Cuba lagi',
    errors: {
      network: 'Tiada sambungan internet. Sila semak dan cuba lagi.',
      not_configured: 'Pembantu belum disediakan. Sila maklumkan kepada pasukan aplikasi.',
      bad_request: 'Maaf, saya tidak dapat membaca mesej itu. Sila cuba mesej yang lebih pendek.',
      rate_limited: 'Ramai yang sedang bertanya. Sila tunggu sebentar dan cuba lagi.',
      upstream: 'Maaf, ada masalah. Sila cuba lagi.',
      blocked: 'Maaf, saya tidak boleh menjawab soalan itu. Sila cuba tanya dengan cara lain.',
    },
  },

  businessTypes: {
    food_beverages: 'Makanan & Minuman',
    handcrafted: 'Kraftangan',
    retail: 'Runcit',
    services: 'Perkhidmatan',
    agriculture: 'Pertanian',
    other: 'Lain-lain',
  },

  tips: [
    'Catat setiap jualan dan perbelanjaan, walaupun yang kecil. Jumlah kecil boleh menjadi besar.',
    'Asingkan wang perniagaan daripada wang peribadi.',
    'Simpan sedikit daripada setiap jualan sebagai simpanan, walaupun hanya 5%.',
    'Ketahui untung setiap produk: harga jualan tolak semua kos untuk menghasilkannya.',
    'Tanya pelanggan tetap apa yang mereka suka. Jawapan mereka ialah kajian pasaran percuma.',
    'Pembungkusan boleh guna semula dan mematikan peralatan yang tidak digunakan boleh mengurangkan bil bulanan.',
    'Bayar diri sendiri jumlah tetap setiap bulan, bukannya mengambil wang tunai setiap kali perlu.',
  ],
};

export const dictionaries: Record<Language, Dictionary> = { en, bm };
