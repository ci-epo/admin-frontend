/*
 * FullCalendar (thème Admin-html), adapté pour Next.js : le calendrier n'est plus qu'une vue.
 * Cliquer une case vide ou un événement ne modifie jamais l'instance directement — ça dispatche
 * un événement DOM que React écoute pour ouvrir ses propres modales (Ajouter/Détails/Modifier/
 * Supprimer), qui passent par de vraies Server Actions. La grille se resynchronise ensuite via
 * `setCieCalendarEvents`, jamais par une modification locale.
 * — init / destroy exposés sur window
 * — getCieCalendarEvents() expose les événements courants
 * — setCieCalendarEvents(events) remplace la source d'événements
 * — cieCalendarEventsChanged dispatché à chaque resynchronisation
 */
(function () {
  var calendarInstance = null;

  function fireEventsChanged() {
    window.dispatchEvent(new CustomEvent("cieCalendarEventsChanged"));
  }

  function destroyCieAppsCalendar() {
    if (calendarInstance) {
      calendarInstance.destroy();
      calendarInstance = null;
    }
  }

  function getCieCalendarEvents() {
    return calendarInstance ? calendarInstance.getEvents() : [];
  }

  function toFullCalendarEvent(schedule) {
    return {
      id: schedule.id,
      title: schedule.title,
      start: schedule.start,
      end: schedule.end,
      extendedProps: schedule.extendedProps,
    };
  }

  function setCieCalendarEvents(schedules) {
    if (!calendarInstance) return;
    calendarInstance.removeAllEvents();
    (schedules || []).forEach(function (schedule) {
      calendarInstance.addEvent(toFullCalendarEvent(schedule));
    });
    fireEventsChanged();
  }

  function initCieAppsCalendar(initialEvents) {
    destroyCieAppsCalendar();

    var calendarEl = document.getElementById("calendar");
    if (!calendarEl || typeof FullCalendar === "undefined") {
      return;
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      selectable: false,
      editable: false,
      events: (initialEvents || []).map(toFullCalendarEvent),
      eventClick: function (info) {
        window.dispatchEvent(new CustomEvent("cieCalendarEventClicked", { detail: { id: info.event.id } }));
      },
      dateClick: function (info) {
        window.dispatchEvent(new CustomEvent("cieCalendarDateClicked", { detail: { dateStr: info.dateStr } }));
      },
    });

    calendar.render();
    calendarInstance = calendar;
    fireEventsChanged();

    window.setTimeout(function () {
      if (calendarInstance === calendar) {
        try {
          calendar.updateSize();
        } catch (e) {
          /* noop */
        }
      }
    }, 50);
  }

  window.initCieAppsCalendar = initCieAppsCalendar;
  window.destroyCieAppsCalendar = destroyCieAppsCalendar;
  window.getCieCalendarEvents = getCieCalendarEvents;
  window.setCieCalendarEvents = setCieCalendarEvents;
})();
