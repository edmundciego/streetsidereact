import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { moduleList } from "../../ApiRoutes";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";
import { useEffect, useState } from "react";
import { filterOutRiderShareModules } from "helper-functions/moduleFilter";

const injectServiceModule = (data) => {
  if (!Array.isArray(data)) return data;

  const hasService = data.some((m) => m?.module_type === "service");
  if (hasService) return data;

  const activeZones = data[0]?.zones || [];

  return [...data];
};

const getModule = async () => {
  const { data } = await MainApi.get(moduleList);
  // return filterOutRiderShareModules(data);
  // return data;
  return injectServiceModule(data);
};

const normalizeZoneIdForKey = (zoneId) => {
  if (
    !zoneId ||
    zoneId === "undefined" ||
    zoneId === "null" ||
    /nan/i.test(zoneId)
  )
    return null;

  try {
    const parsed = JSON.parse(zoneId);
    if (Array.isArray(parsed)) {
      const ids = parsed
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item));
      return ids.length > 0 ? JSON.stringify(ids) : null;
    }
    const asNumber = Number(parsed);
    return Number.isFinite(asNumber) ? JSON.stringify([asNumber]) : null;
  } catch {
    const trimmed = String(zoneId).trim();
    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber)) return JSON.stringify([asNumber]);

    const parts = trimmed
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
    return parts.length > 0 ? JSON.stringify(parts) : null;
  }
};

const getZoneIdsKeyFromStorage = () => {
  if (typeof window === "undefined") return null;
  return normalizeZoneIdForKey(localStorage.getItem("zoneid"));
};

export default function useGetModule() {
  const [zoneIdsKey, setZoneIdsKey] = useState(() =>
    getZoneIdsKeyFromStorage(),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateZoneIds = () => {
      setZoneIdsKey((prev) => {
        const next = getZoneIdsKeyFromStorage();
        return prev === next ? prev : next;
      });
    };

    updateZoneIds();
    window.addEventListener("storage", updateZoneIds);
    window.addEventListener("focus", updateZoneIds);
    // Custom event fired by zone setters (see setZoneId helpers) so we
    // update instantly without 1s polling. Keeps state in sync with
    // zero idle CPU cost.
    window.addEventListener("zoneid-changed", updateZoneIds);

    return () => {
      window.removeEventListener("storage", updateZoneIds);
      window.removeEventListener("focus", updateZoneIds);
      window.removeEventListener("zoneid-changed", updateZoneIds);
    };
  }, []);

  const query = useQuery(["module-list", zoneIdsKey], getModule, {
    enabled: false,
    staleTime: 1000 * 60 * 5, // modules rarely change
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    onError: onErrorResponse,
  });
  const { refetch } = query;

  useEffect(() => {
    if (!zoneIdsKey) return;
    refetch();
  }, [zoneIdsKey, refetch]);

  return query;
}
