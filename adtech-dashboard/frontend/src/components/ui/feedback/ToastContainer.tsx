import { Alert, Snackbar, Stack } from "@mui/material";
import { useToastStore } from "../../../store/toastStore";
import type { Toast } from "../../../types";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <Stack
      spacing={1}
      sx={{ position: "fixed", top: 24, right: 24, zIndex: 2000 }}
    >
      {toasts.map((t: Toast) => (
        <Snackbar
          key={t.id}
          open
          autoHideDuration={4000}
          onClose={() => removeToast(t.id)}
          sx={{ position: "static" }}
        >
          <Alert
            severity={t.severity}
            variant="filled"
            onClose={() => removeToast(t.id)}
            sx={{ minWidth: 300 }}
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
