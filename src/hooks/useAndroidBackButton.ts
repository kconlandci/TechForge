import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App } from "@capacitor/app";
import { Dialog } from "@capacitor/dialog";

export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef<number>(0);

  useEffect(() => {
    const handler = App.addListener("backButton", async ({ canGoBack }) => {
      const path = location.pathname;
      if (path.startsWith("/lab/")) {
        let confirmed = false;
        try {
          const { value } = await Dialog.confirm({
            title: "Exit Lab?",
            message: "Progress on this scenario will be lost.",
            okButtonTitle: "Exit",
            cancelButtonTitle: "Stay",
          });
          confirmed = value;
        } catch {
          confirmed = window.confirm("Exit Lab?\n\nProgress on this scenario will be lost.");
        }
        if (confirmed) navigate("/");
        return;
      }
      if (path === "/") {
        const now = Date.now();
        if (now - lastBackPress.current < 2000) { App.exitApp(); }
        else { lastBackPress.current = now; }
        return;
      }
      if (canGoBack) { navigate(-1); }
      else { navigate("/"); }
    });
    return () => { handler.then((h) => h.remove()); };
  }, [navigate, location]);
}
