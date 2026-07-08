
// src/updateApp/useUpdateChecker.ts
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isOutdated } from "./versionCompare";

const API_BASEURL = "https://eduxl2.up.railway.app/";
const LAST_SHOWN_KEY = "update_modal_last_shown";
const SHOW_INTERVAL_MS = 1000 * 60 * 60 * 6; // show non-force modal at most every 6h

export function useUpdateChecker() {
  const [visible, setVisible] = useState(false);
  const [force, setForce] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [latestVersion, setLatestVersion] = useState<string | undefined>();

  const currentVersion = Constants.expoConfig?.version 

  console.log({
    aaa:currentVersion
  });
  

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASEURL}updateapp`);
        const data = await res.json();

        console.log("Update check response:", data);

        // Actual backend shape: { status, service, timestamp, version, forceUpdate }
        const backendVersion = data?.version;
        const isForce = !!data?.forceUpdate;
        const msg = data?.message; // not currently sent by backend, will be undefined

        if (!backendVersion) return;

        setLatestVersion(backendVersion);
        setForce(isForce);
        setMessage(msg);

        if (!isOutdated(currentVersion, backendVersion)) {
          setVisible(false);
          return;
        }

        if (isForce) {
          // Always show, no throttling, cannot be dismissed
          setVisible(true);
          return;
        }

        // Non-force: only show every SHOW_INTERVAL_MS
        const lastShownRaw = await AsyncStorage.getItem(LAST_SHOWN_KEY);
        const lastShown = lastShownRaw ? parseInt(lastShownRaw, 10) : 0;
        const now = Date.now();

        if (now - lastShown > SHOW_INTERVAL_MS) {
          setVisible(true);
          await AsyncStorage.setItem(LAST_SHOWN_KEY, String(now));
        }
      } catch (err) {
        console.log("Update check failed:", err);
      }
    };

    check();
  }, []);

  const dismiss = () => {
    if (!force) setVisible(false);
  };

  return { visible, force, message, latestVersion, currentVersion, dismiss };
}