import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useValidateUserToken } from "../hooks/useQueries";

interface TokenGateDialogProps {
  onTokenVerified: () => void;
}

export default function TokenGateDialog({
  onTokenVerified,
}: TokenGateDialogProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const validateMutation = useValidateUserToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Token tidak boleh kosong.");
      return;
    }
    setError("");
    try {
      const valid = await validateMutation.mutateAsync(token.trim());
      if (valid) {
        toast.success("Token berhasil diverifikasi! Selamat datang.");
        onTokenVerified();
      } else {
        setError(
          "Token tidak valid. Hubungi admin untuk mendapatkan token yang benar.",
        );
      }
    } catch {
      setError("Terjadi kesalahan saat memverifikasi token. Coba lagi.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)" }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        data-ocid="token_gate.dialog"
      >
        {/* Header */}
        <div
          className="px-6 py-5 text-center"
          style={{
            background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
          }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldAlert size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-white">Verifikasi Akses</h2>
          <p className="text-white/75 text-xs mt-1">
            Masukkan token unik yang diberikan oleh admin untuk melanjutkan
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label
              htmlFor="token-input"
              className="text-sm font-semibold text-gray-700"
            >
              Token Akses
            </Label>
            <div className="relative mt-1.5">
              <KeyRound
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                id="token-input"
                data-ocid="token_gate.input"
                type="text"
                placeholder="Masukkan token akses Anda"
                className="pl-9 font-mono tracking-widest"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setError("");
                }}
                autoFocus
                autoComplete="off"
              />
            </div>
            {error && (
              <p
                data-ocid="token_gate.error_state"
                className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2"
              >
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-ocid="token_gate.submit_button"
            className="w-full font-semibold"
            disabled={validateMutation.isPending}
            style={{
              background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
              color: "#fff",
            }}
          >
            {validateMutation.isPending ? (
              <>
                <Loader2 size={15} className="mr-2 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Verifikasi Token"
            )}
          </Button>

          <p className="text-center text-xs text-gray-400">
            Tidak punya token? Hubungi administrator Anda.
          </p>
        </form>
      </div>
    </div>
  );
}
