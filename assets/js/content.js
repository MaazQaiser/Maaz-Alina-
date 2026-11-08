/*
  All the words on the site live here — edit freely.
  Lines marked  // TODO  are placeholders waiting for the real details.
*/
window.SITE = {
  groom: 'Maaz',
  bride: 'Alina',
  music: '', // e.g. 'assets/audio/music.mp3' to use your own track instead of the built-in piano
  hashtag: '#MaazWedsAlina', // TODO: your hashtag (or set to '' to hide)

  events: {
    barat: {
      label: 'Wedding Ceremony',
      urdu: '',
      // Pakistan time (UTC+5)
      start: '2026-12-01T12:30:00+05:00',
      end: '2026-12-01T17:00:00+05:00',
      dateLong: '01st of December 2026',
      dateShort: ['01', '12', '26'],
      weekday: 'Tuesday',
      time: '12:30 PM',
      venue: 'AK Farmhouse and Events',
      address: 'Manhala Road, Lahore',
      // Paste your exact Google Maps share link here for a precise pin
      mapsLink: '', // TODO
      mapQuery: 'AK Farmhouse and Events, Manhala Road, Jallo, Lahore',
      inviteLine: 'invite you to join them on their wedding day',
      after: 'reception to follow',
      // where the barat sets off from — shown under the countdown and in the FAQ
      departure: { time: '11:30 AM', place: 'J Block, Gulberg III', city: 'Lahore', mapQuery: 'J Block, Gulberg III, Lahore' },
      contact: { name: 'Ch Javeed Ahmad', phone: '+92 301 4453382' },
      faq: [
        { q: 'Where will the barat depart from?', a: 'The barat will depart from J Block, Gulberg III, Lahore at 11:30 AM.' },
      ],
      // From the card. The programme section appears once there are three or more moments.
      timeline: [
        { time: '12:30 PM', title: 'Ceremony begins', note: 'Welcome and seating' },
        { time: 'To follow', title: 'Reception', note: 'Stay and celebrate with us' },
      ],
    },

    walima: {
      label: 'Walima Reception',
      urdu: '',
      start: '2026-12-03T12:30:00+05:00',
      end: '2026-12-03T17:00:00+05:00',
      dateLong: '03 December 2026',
      dateShort: ['03', '12', '26'],
      weekday: 'Thursday',
      time: '12:30 PM',
      venue: 'Zainab Marquee',
      address: 'Khanpur',
      mapsLink: '', // TODO: exact Google Maps link (there is more than one Khanpur)
      mapQuery: 'Zainab Marquee, Khanpur',
      inviteLine: 'request the pleasure of your company',
      after: '',
      contact: { name: 'Khawaja Qaiser', phone: '+92 300 7119988' },
      // From the card. The programme section appears once there are three or more moments.
      timeline: [
        { time: '12:30 PM', title: 'Walima Reception', note: 'Zainab Marquee, Khanpur' },
      ],
    },
  },

  // TODO: replace titles and lines with your own story
  story: [
    // fx: fade | nature | soft | arch — how each picture is shown; closing is an optional last line
    { img: 'selfie.webp', fx: 'fade', label: 'Chapter one', title: 'With your blessings,', text: 'starting a new journey' },
    { img: 'walking.webp', fx: 'nature', label: 'Chapter two', title: 'A new chapter', text: 'Hand in hand, we step into a new journey — a home to build, a life to share, and every tomorrow to begin together, with your duas beside us.' },
    { img: 'friends.webp', fx: 'soft', label: 'Chapter three', title: 'Our people', text: 'Every happy memory we have, our friends and family were part of it — the laughter, the late nights, the dua in every goodbye. This day is not complete without you.', closing: 'We are waiting for you.' },
  ],

  families: {
    duaArabic: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    duaEnglish: 'May Allah bless you both, shower His blessings upon you, and unite you in goodness.',
    message: 'With grateful hearts and the blessings of Allah, our families warmly invite you to share in the joy of this union. Your presence and your duas mean the world to us.', // TODO
    signoff: 'The families of Maaz & Alina',
  },

  // shared questions; each event adds its own (above) plus "Whom do I contact" from its contact
  faq: [ // TODO
    { q: 'What time should we arrive?', a: 'Please arrive by 12:30 PM so you don’t miss a moment.' },
    { q: 'Is there parking at the venue?', a: 'Yes, parking is available on site.' },
  ],
};
