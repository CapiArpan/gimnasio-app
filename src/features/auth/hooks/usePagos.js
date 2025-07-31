import { useState, useEffect, useCallback } from "react";
import {
  fetchPagosAdmin,
  createPagoAdmin,
  deletePagoAdmin,
  fetchMisPagos
} from "../../../lib/api/pagos";

export function usePagosAdmin() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setPagos(await fetchPagosAdmin()); }
    catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { pagos, loading, reload, createPagoAdmin, deletePagoAdmin };
}

export function useMisPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setPagos(await fetchMisPagos()); }
      catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  return { pagos, loading };
}
