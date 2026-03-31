"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  QrCode, CheckCircle2, XCircle, AlertTriangle,
  ArrowLeft, Loader2, User, Mail, GraduationCap, Clock, Camera, CameraOff
} from "lucide-react";
import Link from "next/link";

type ScanResult = null | {
  type: "success" | "duplicate" | "error";
  ticketId: string;
  fullName?: string;
  email?: string;
  university?: string;
  checkedInAt?: string;
  message: string;
};

export default function ScanPage() {
  const { data: session, status } = useSession();
  const [result, setResult] = useState<ScanResult>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef("");

  const handleScan = useCallback(async (decodedText: string) => {
    if (processing) return;
    if (decodedText === lastScanRef.current) return;

    lastScanRef.current = decodedText;
    setProcessing(true);

    setTimeout(() => { lastScanRef.current = ""; }, 3000);

    const ticketId = decodedText.startsWith("AT-")
      ? decodedText
      : decodedText.match(/AT-[A-Z0-9]{8}/)?.[0];

    if (!ticketId) {
      setResult({ type: "error", ticketId: decodedText, message: "Invalid ticket format" });
      setProcessing(false);
      return;
    }

    try {
      const res = await fetch("/api/ticket/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ type: "error", ticketId, message: data.message || "Check-in failed" });
      } else if (data.alreadyCheckedIn) {
        setResult({
          type: "duplicate",
          ticketId,
          fullName: data.fullName,
          email: data.email,
          university: data.university,
          checkedInAt: data.checkedInAt,
          message: "Already checked in",
        });
      } else {
        setResult({
          type: "success",
          ticketId,
          fullName: data.fullName,
          email: data.email,
          university: data.university,
          message: "Entry approved",
        });
      }
    } catch {
      setResult({ type: "error", ticketId, message: "Network error. Check connection." });
    }

    setProcessing(false);
  }, [processing]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "admin") return;

    let scanner: Html5Qrcode | null = null;
    let cancelled = false;

    async function init() {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (cancelled) return;

        if (!devices || devices.length === 0) {
          setCameraError("No cameras found. Please allow camera access.");
          return;
        }

        setCameras(devices);

        const backCamera = devices.find(d =>
          /back|rear|environment|wide/i.test(d.label)
        );
        const cameraId = backCamera?.id || devices[0].id;
        setSelectedCamera(cameraId);

        scanner = new Html5Qrcode("qr-reader", { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { deviceId: { exact: cameraId } },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          handleScan,
          () => {}
        );

        if (!cancelled) setCameraReady(true);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg.includes("Permission") || msg.includes("NotAllowed")) {
          setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (msg.includes("NotFound") || msg.includes("DevicesNotFoundError")) {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError(`Camera error: ${msg}`);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (scanner) {
        scanner.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [status, session, handleScan]);

  const switchCamera = async (deviceId: string) => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
    } catch {}

    setSelectedCamera(deviceId);
    setCameraReady(false);

    try {
      await scannerRef.current.start(
        { deviceId: { exact: deviceId } },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        handleScan,
        () => {}
      );
      setCameraReady(true);
    } catch {
      setCameraError("Failed to switch camera");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-8">Only administrators can access the scanner</p>
          <Link href="/" className="px-6 py-3 rounded-xl font-bold bg-maroon-700 text-white hover:bg-maroon-800 transition-colors inline-block">
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 pt-8 pb-6">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Admin</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${cameraReady ? "bg-green-400" : cameraError ? "bg-red-400" : "bg-amber-400"}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${cameraReady ? "text-green-400" : cameraError ? "text-red-400" : "text-amber-400"}`}>
                {cameraReady ? "Scanner Active" : cameraError ? "Camera Error" : "Initializing..."}
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white mt-4">Gate Scanner</h1>
          <p className="text-slate-400 text-sm mt-1">Point camera at ticket QR code</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Camera selector */}
        {cameras.length > 1 && cameraReady && (
          <div className="mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCamera}
              onChange={(e) => switchCamera(e.target.value)}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-maroon-700"
            >
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.label || `Camera ${cam.id.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scanner viewport */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div id="qr-reader" className="w-full" />
          {cameraError && (
            <div className="p-8 text-center">
              <CameraOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-red-500 font-medium mb-2">{cameraError}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-maroon-700 font-semibold hover:underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {processing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-maroon-700 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Verifying ticket...</p>
          </motion.div>
        )}

        {result && !processing && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`mt-6 rounded-2xl shadow-lg border p-6 ${
            result.type === "success" ? "bg-green-50 border-green-200" :
            result.type === "duplicate" ? "bg-amber-50 border-amber-200" :
            "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                result.type === "success" ? "bg-green-500" :
                result.type === "duplicate" ? "bg-amber-500" :
                "bg-red-500"
              }`}>
                {result.type === "success" ? <CheckCircle2 className="w-8 h-8 text-white" /> :
                 result.type === "duplicate" ? <AlertTriangle className="w-8 h-8 text-white" /> :
                 <XCircle className="w-8 h-8 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-black ${
                  result.type === "success" ? "text-green-800" :
                  result.type === "duplicate" ? "text-amber-800" : "text-red-800"
                }`}>
                  {result.type === "success" ? "Entry Approved" :
                   result.type === "duplicate" ? "Duplicate Entry" : "Invalid Ticket"}
                </h3>
                <p className={`text-sm mt-0.5 ${
                  result.type === "success" ? "text-green-600" :
                  result.type === "duplicate" ? "text-amber-600" : "text-red-600"
                }`}>{result.message}</p>
                {result.type !== "error" && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">{result.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{result.email}</span>
                    </div>
                    {result.university && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{result.university}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <QrCode className="w-4 h-4 text-slate-400" />
                      <span className="font-mono font-bold text-slate-700">{result.ticketId}</span>
                    </div>
                    {result.checkedInAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500">Checked in at {new Date(result.checkedInAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
