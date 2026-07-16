import { driver } from "driver.js";

export function startDashboardTour() {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Finish",

    steps: [
      {
        element: "#tour-sidebar",
        popover: {
          title: "Navigation",
          description:
            "Use the sidebar to access your documents, activities, signatures and settings.",
        },
      },
      {
        element: "#tour-upload",
        popover: {
          title: "Upload Document",
          description:
            "Upload a PDF here to create a new signing request.",
        },
      },
      {
        element: "#tour-recent-documents",
        popover: {
          title: "Recent Documents",
          description:
            "View your recently created documents and continue where you left off.",
        },
      },
    ],
  });

  driverObj.drive();
}