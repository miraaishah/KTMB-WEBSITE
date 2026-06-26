/**
 * KITS Notification Inbox Engine — notifications.js
 * ─────────────────────────────────────────────────
 * Injects a notification bell into the navbar and manages
 * train-status alerts for ticket holders, stored in localStorage.
 */

(function () {
  'use strict';

  var LS_KEY      = 'kits_notifications';
  var LS_USER     = 'kits_user_session';
  var LS_BOOKINGS = 'kits_bookings';

  var TYPE_ICON = {
    reminder:  '🕐',
    delay:     '⚠️',
    ontime:    '✅',
    cancelled: '🛑',
    arrived:   '🟣',
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function hashCode(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  function t(key, fallback) {
    var lang = localStorage.getItem('kits_lang') || 'en';
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return fallback || key;
  }

  function getMYT() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  }

  function formatRelativeTime(tsMs) {
    var diffMs = Date.now() - tsMs;
    var mins   = Math.floor(diffMs / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24)  return hrs + 'h ago';
    return Math.floor(hrs / 24) + 'd ago';
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    var parts = timeStr.split(':');
    var h  = parseInt(parts[0], 10);
    var m  = parseInt(parts[1], 10);
    var ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 || 12;
    return hh + ':' + m.toString().padStart(2, '0') + ' ' + ap;
  }

  function addMinutes(timeStr, mins) {
    if (!timeStr) return timeStr;
    var parts = timeStr.split(':');
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var total = h * 60 + m + mins;
    var nh = Math.floor(total / 60) % 24;
    var nm = total % 60;
    return nh.toString().padStart(2, '0') + ':' + nm.toString().padStart(2, '0');
  }

  function getTodayStr() {
    return getMYT().toLocaleDateString('en-CA');
  }

  function getTomorrowStr() {
    var d = getMYT();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-CA');
  }

  function isTodayOrTomorrow(dateStr) {
    return dateStr === getTodayStr() || dateStr === getTomorrowStr();
  }

  function isToday(dateStr) {
    return dateStr === getTodayStr();
  }

  function escHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ─── Notification generation ──────────────────────────────────────────────

  function generateNotificationsForUser(userEmail) {
    if (!userEmail) return [];
    var bookings     = JSON.parse(localStorage.getItem(LS_BOOKINGS) || '[]');
    var userBookings = bookings.filter(function (b) {
      return b.userEmail && b.userEmail.toLowerCase() === userEmail.toLowerCase();
    });

    var generated = [];
    var isBM = (localStorage.getItem('kits_lang') || 'en') === 'bm';

    userBookings.forEach(function (b) {
      if (!b.departDate) return;
      if (!isTodayOrTomorrow(b.departDate)) return;

      var seed = hashCode(b.bookingRef || (b.trainName + b.departDate));
      var r    = seed % 100;

      var type;
      if      (r < 15) type = 'cancelled';
      else if (r < 40) type = 'delay';
      else if (r < 55) type = 'ontime';
      else              type = 'reminder';

      if (isToday(b.departDate) && b.depTime) {
        var now   = getMYT();
        var tParts = (b.depTime || '23:59').split(':');
        var depMs  = new Date(now).setHours(parseInt(tParts[0], 10), parseInt(tParts[1], 10), 0, 0);
        if (Date.now() > depMs + 5 * 60000) type = 'arrived';
      }

      var delayMins  = 10 + (seed % 36);
      var newDepTime = addMinutes(b.depTime, delayMins);
      var notifId    = 'notif-' + (b.bookingRef || seed) + '-' + type;
      var orig       = (b.originText || 'Origin').split(',')[0].split('(')[0].trim();
      var dest       = (b.destText   || 'Destination').split(',')[0].split('(')[0].trim();
      var train      = b.trainName || 'Your Train';
      var ref        = b.bookingRef || '-';

      var title, body;
      if (type === 'reminder') {
        title = t('notif-type-reminder', 'Departure Reminder');
        body  = isBM
          ? 'Tren ' + train + ' berlepas pada ' + formatTime(b.depTime) + ' dari ' + orig + ' ke ' + dest + (isToday(b.departDate) ? ' hari ini' : ' esok') + '. Tiba 15 minit awal. (Ref: ' + ref + ')'
          : 'Train ' + train + ' departs at ' + formatTime(b.depTime) + ' from ' + orig + ' to ' + dest + (isToday(b.departDate) ? ' today' : ' tomorrow') + '. Please arrive 15 min early. (Ref: ' + ref + ')';
      } else if (type === 'delay') {
        title = t('notif-type-delay', 'Train Delayed');
        body  = isBM
          ? train + ' mengalami kelewatan \u00b1' + delayMins + ' minit. Berlepas baru: ' + formatTime(newDepTime) + '. Mohon maaf atas kesulitan ini.'
          : train + ' from ' + orig + ' is delayed ~' + delayMins + ' min. New departure: ' + formatTime(newDepTime) + '. We apologise for the inconvenience.';
      } else if (type === 'ontime') {
        title = t('notif-type-ontime', 'Train On Time');
        body  = isBM
          ? train + ' menepati jadual. Berlepas pada ' + formatTime(b.depTime) + ' seperti dirancang. Selamat menaiki tren!'
          : train + ' is running on schedule. Departs at ' + formatTime(b.depTime) + ' as planned. Have a great journey!';
      } else if (type === 'cancelled') {
        title = t('notif-type-cancelled', 'Train Cancelled');
        body  = isBM
          ? train + ' dari ' + orig + ' ke ' + dest + ' telah dibatalkan. Sila hubungi kaunter KTMB untuk bayaran balik. (Ref: ' + ref + ')'
          : train + ' from ' + orig + ' to ' + dest + ' has been cancelled. Contact KTMB counter for refunds. (Ref: ' + ref + ')';
      } else {
        title = t('notif-type-arrived', 'Train Arrived');
        body  = isBM
          ? train + ' dari ' + orig + ' telah tiba di ' + dest + '. Terima kasih kerana menggunakan KTMB!'
          : train + ' from ' + orig + ' has arrived at ' + dest + '. Thank you for choosing KTMB!';
      }

      var spreadMs  = (seed % 180) * 60 * 1000;
      var timestamp = Date.now() - spreadMs;

      generated.push({
        id: notifId, type: type, title: title, body: body,
        trainName: train, bookingRef: ref, route: orig + ' \u2192 ' + dest,
        depTime: b.depTime, departDate: b.departDate, timestamp: timestamp, read: false,
      });
    });

    generated.sort(function (a, b) { return b.timestamp - a.timestamp; });
    return generated;
  }

  // ─── Storage ──────────────────────────────────────────────────────────────

  function loadStoredNotifs(email) {
    var all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return (email && all[email]) ? all[email] : [];
  }

  function saveStoredNotifs(email, notifs) {
    var all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    all[email] = notifs;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  }

  function mergeNotifications(stored, generated) {
    var readSet = {};
    stored.forEach(function (n) { if (n.read) readSet[n.id] = true; });
    return generated.map(function (n) {
      return Object.assign({}, n, { read: !!readSet[n.id] });
    });
  }

  // ─── KITSNotify API ───────────────────────────────────────────────────────

  var KITSNotify = {
    _email: null, _notifs: [],
    init: function () {
      var s = localStorage.getItem(LS_USER);
      if (!s) { this._email = null; this._notifs = []; return; }
      try { this._email = JSON.parse(s).email; } catch (e) { this._email = null; return; }
      var stored    = loadStoredNotifs(this._email);
      var generated = generateNotificationsForUser(this._email);
      this._notifs  = mergeNotifications(stored, generated);
      saveStoredNotifs(this._email, this._notifs);
    },
    getAll: function (filter) {
      if (filter === 'unread') return this._notifs.filter(function (n) { return !n.read; });
      return this._notifs;
    },
    getUnreadCount: function () {
      return this._notifs.filter(function (n) { return !n.read; }).length;
    },
    markRead: function (id) {
      var n = this._notifs.filter(function (x) { return x.id === id; })[0];
      if (n) n.read = true;
      if (this._email) saveStoredNotifs(this._email, this._notifs);
    },
    markAllRead: function () {
      this._notifs.forEach(function (n) { n.read = true; });
      if (this._email) saveStoredNotifs(this._email, this._notifs);
    },
  };
  window.KITSNotify = KITSNotify;

  // ─── UI state ─────────────────────────────────────────────────────────────

  var bellBtn = null, badge = null, panel = null, listEl = null;
  var currentFilter = 'all', isPanelOpen = false;

  function buildWrapper() {
    var w = document.createElement('div');
    w.className = 'notif-bell-wrapper';
    w.id = 'notif-bell-wrapper';
    w.innerHTML =
      '<button class="notif-bell-btn" id="notif-bell-btn" aria-label="Notifications">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>' +
          '<path d="M13.73 21a2 2 0 0 1-3.46 0"/>' +
        '</svg>' +
        '<span class="notif-badge" id="notif-badge">0</span>' +
      '</button>' +
      '<div class="notif-panel" id="notif-panel" role="dialog" aria-label="Inbox">' +
        '<div class="notif-panel-header">' +
          '<div class="notif-panel-title">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>' +
              '<path d="M13.73 21a2 2 0 0 1-3.46 0"/>' +
            '</svg>' +
            '<span id="notif-title-text">Inbox</span>' +
          '</div>' +
          '<button class="notif-mark-all-btn" id="notif-mark-all-btn">Mark all as read</button>' +
        '</div>' +
        '<div class="notif-filter-tabs">' +
          '<button class="notif-filter-tab active" data-filter="all" id="notif-tab-all">All</button>' +
          '<button class="notif-filter-tab" data-filter="unread" id="notif-tab-unread">Unread</button>' +
        '</div>' +
        '<div class="notif-list" id="notif-list"></div>' +
        '<div class="notif-panel-footer">' +
          '<a href="mybookings.html" class="notif-view-all-link" id="notif-view-all-link">View booking history</a>' +
        '</div>' +
      '</div>';
    return w;
  }

  function renderList() {
    if (!listEl) return;
    var items = KITSNotify.getAll(currentFilter);
    if (items.length === 0) {
      listEl.innerHTML =
        '<div class="notif-empty-state">' +
          '<div class="notif-empty-icon">\uD83D\uDD14</div>' +
          '<div class="notif-empty-title">' + escHtml(t('notif-empty-title', "You're all caught up!")) + '</div>' +
          '<div class="notif-empty-sub">' + escHtml(t('notif-empty-sub', "No notifications. We'll alert you about your train status here.")) + '</div>' +
        '</div>';
      return;
    }
    listEl.innerHTML = items.map(function (n, i) {
      return '<div class="notif-item ' + (n.read ? '' : 'unread') + '" data-id="' + escHtml(n.id) + '" style="animation-delay:' + (i * 0.04) + 's">' +
        '<div class="notif-icon-bubble type-' + n.type + '">' + (TYPE_ICON[n.type] || '\uD83D\uDCE2') + '</div>' +
        '<div class="notif-text">' +
          '<div class="notif-title-row">' +
            '<div class="notif-item-title">' + escHtml(n.title) + '</div>' +
            '<div class="notif-time">' + formatRelativeTime(n.timestamp) + '</div>' +
          '</div>' +
          '<div class="notif-item-body">' + escHtml(n.body) + '</div>' +
        '</div>' +
        (n.read ? '' : '<div class="notif-unread-dot"></div>') +
      '</div>';
    }).join('');

    listEl.querySelectorAll('.notif-item').forEach(function (el) {
      el.addEventListener('click', function () {
        KITSNotify.markRead(el.getAttribute('data-id'));
        el.classList.remove('unread');
        var dot = el.querySelector('.notif-unread-dot');
        if (dot) dot.remove();
        updateBadge();
      });
    });
  }

  function updateBadge() {
    if (!badge || !bellBtn) return;
    var c = KITSNotify.getUnreadCount();
    badge.textContent = c > 99 ? '99+' : String(c);
    badge.classList[c > 0 ? 'add' : 'remove']('visible');
    bellBtn.classList[c > 0 ? 'add' : 'remove']('has-unread');
  }

  function openPanel() {
    if (!panel) return;
    isPanelOpen = true;
    panel.classList.add('open');
    if (bellBtn) bellBtn.classList.add('active');
    renderList();
  }

  function closePanel() {
    if (!panel) return;
    isPanelOpen = false;
    panel.classList.remove('open');
    if (bellBtn) bellBtn.classList.remove('active');
  }

  function applyLang() {
    var titleEl   = document.getElementById('notif-title-text');
    var markAllEl = document.getElementById('notif-mark-all-btn');
    var tabAllEl  = document.getElementById('notif-tab-all');
    var tabUnEl   = document.getElementById('notif-tab-unread');
    var viewAllEl = document.getElementById('notif-view-all-link');
    if (titleEl)   titleEl.textContent   = t('nav-inbox', 'Inbox');
    if (markAllEl) markAllEl.textContent = t('notif-mark-read', 'Mark all as read');
    if (tabAllEl)  tabAllEl.textContent  = t('notif-tab-all', 'All');
    if (tabUnEl)   tabUnEl.textContent   = t('notif-tab-unread', 'Unread');
    if (viewAllEl) viewAllEl.textContent = t('notif-view-all', 'View booking history');
  }

  // ─── Inject bell into navbar ──────────────────────────────────────────────

  function injectBell() {
    if (document.getElementById('notif-bell-wrapper')) return;
    if (!localStorage.getItem(LS_USER)) return;

    var navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    var wrapper = buildWrapper();
    var authEl  = document.getElementById('auth-container');
    if (authEl) navActions.insertBefore(wrapper, authEl);
    else        navActions.appendChild(wrapper);

    bellBtn = document.getElementById('notif-bell-btn');
    badge   = document.getElementById('notif-badge');
    panel   = document.getElementById('notif-panel');
    listEl  = document.getElementById('notif-list');

    bellBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isPanelOpen) { closePanel(); } else { KITSNotify.init(); openPanel(); }
    });

    document.getElementById('notif-mark-all-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      KITSNotify.markAllRead();
      renderList();
      updateBadge();
    });

    document.querySelectorAll('.notif-filter-tab').forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.notif-filter-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentFilter = tab.getAttribute('data-filter');
        renderList();
      });
    });

    document.addEventListener('click', function (e) {
      if (isPanelOpen && panel && !panel.contains(e.target) && e.target !== bellBtn) closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isPanelOpen) closePanel();
    });

    applyLang();

    var obs = new MutationObserver(function () {
      applyLang();
      if (isPanelOpen) { KITSNotify.init(); renderList(); }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    updateBadge();

    setTimeout(function () {
      if (KITSNotify.getUnreadCount() > 0 && bellBtn) {
        bellBtn.classList.remove('has-unread');
        void bellBtn.offsetWidth;
        bellBtn.classList.add('has-unread');
      }
    }, 2000);
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────

  function boot() {
    KITSNotify.init();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectBell);
    } else {
      injectBell();
    }

    window.addEventListener('storage', function (e) {
      if (e.key !== LS_USER) return;
      var ex = document.getElementById('notif-bell-wrapper');
      if (ex) ex.remove();
      bellBtn = badge = panel = listEl = null;
      if (e.newValue) { KITSNotify.init(); injectBell(); }
    });

    setInterval(function () {
      if (!localStorage.getItem(LS_USER)) return;
      KITSNotify.init();
      updateBadge();
      if (isPanelOpen) renderList();
    }, 30000);
  }

  boot();

})();

