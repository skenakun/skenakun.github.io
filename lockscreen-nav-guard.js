(() => {
  "use strict";

  const phone = document.getElementById("pixelScreen");
  const gesture = document.getElementById("androidGesturePill");

  if (!phone || !gesture) return;

  const isLockVisible = () => !!phone.querySelector("#lockPage");
  let gestureStart = null;

  function dispatchLockSwipe(startY, endY, clientX) {
    const lockPage = phone.querySelector("#lockPage");
    if (!lockPage) return;

    const common = {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 991,
      pointerType: "touch",
      isPrimary: true,
      clientX
    };

    lockPage.dispatchEvent(new PointerEvent("pointerdown", {
      ...common,
      clientY: startY,
      buttons: 1,
      pressure: 0.5
    }));

    lockPage.dispatchEvent(new PointerEvent("pointerup", {
      ...common,
      clientY: endY,
      buttons: 0,
      pressure: 0
    }));
  }

  // The navigation pill must never unlock the phone from a simple tap.
  document.addEventListener("click", (event) => {
    if (!isLockVisible()) return;

    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest("#androidGesturePill")) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return;
    }

    // Prevent the simulated 3-button Home/Recents keys from bypassing the lock screen.
    const systemButton = target.closest("[data-system-nav]");
    if (systemButton) {
      const action = systemButton.getAttribute("data-system-nav");
      if (action === "home" || action === "recent") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    }
  }, true);

  // Preserve Android-like behavior: an upward swipe that starts on the pill
  // is forwarded to the existing lock-screen swipe handler. That handler
  // opens PIN/pattern authentication instead of bypassing it.
  gesture.addEventListener("pointerdown", (event) => {
    if (!isLockVisible()) return;
    gestureStart = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId
    };
  }, true);

  gesture.addEventListener("pointerup", (event) => {
    if (!gestureStart || !isLockVisible()) {
      gestureStart = null;
      return;
    }

    const start = gestureStart;
    gestureStart = null;
    const dy = event.clientY - start.y;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (dy < -36) {
      dispatchLockSwipe(start.y, event.clientY, start.x);
    }
  }, true);

  gesture.addEventListener("pointercancel", () => {
    gestureStart = null;
  }, true);
})();