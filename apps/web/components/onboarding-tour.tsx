"use client";

import { HarmoniaMark } from "@harmonia/ui";
import { StepType, TourProvider, useTour } from "@reactour/tour";
import { ArrowLeft, ArrowRight, Check, Compass } from "lucide-react";
import React, { useEffect } from "react";

const TOUR_STORAGE_KEY = "harmonia_tour_completed_v1";

export const TOUR_STEPS: StepType[] = [
  {
    selector: '[data-tour="sidebar-nav"]',
    content: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Navegação Principal</h4>
            <p className="text-[11px] text-zinc-400">Tudo em um só lugar</p>
          </div>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Navegue entre sua Visão Geral, a lista de Playlists sincronizadas e as Configurações de conexões a qualquer momento.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="services-status"]',
    content: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
            <HarmoniaMark className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Status das Conexões</h4>
            <p className="text-[11px] text-zinc-400">YouTube &amp; Spotify</p>
          </div>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Acompanhe se suas duas plataformas estão conectadas. O YouTube fornece as playlists e o Spotify recebe suas faixas.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="dashboard-kpis"]',
    content: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
            <span className="text-xs font-bold font-mono">%</span>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Métricas em Tempo Real</h4>
            <p className="text-[11px] text-zinc-400">Músicas, playlists e precisão</p>
          </div>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Veja quantas playlists estão ativas, o total de faixas transferidas no Spotify e a taxa de correspondência do algoritmo.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="quick-new-sync"]',
    content: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
            <span className="text-sm font-bold">+</span>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Nova Sincronização</h4>
            <p className="text-[11px] text-zinc-400">Simples e rápido</p>
          </div>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Basta colar o link de qualquer playlist do YouTube aqui para que o Harmonia replique todas as faixas direto no seu Spotify.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="recent-activity"]',
    content: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
            <span className="text-xs font-bold">⚡</span>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Histórico e Quarentena</h4>
            <p className="text-[11px] text-zinc-400">Controle completo</p>
          </div>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Acompanhe o status de cada sincronização e resolva eventuais divergências na tela de detalhes da playlist.
        </p>
      </div>
    ),
  },
];

function markTourCompleted() {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  } catch {
    // ignore
  }
}

function TourAutoStarter() {
  const { setIsOpen } = useTour();

  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!hasCompleted) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, [setIsOpen]);

  return null;
}

export function OnboardingTourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TourProvider
      steps={TOUR_STEPS}
      padding={8}
      showBadge={true}
      showDots={true}
      showNavigation={true}
      badgeContent={({ currentStep, totalSteps }) =>
        `${currentStep + 1} de ${totalSteps}`
      }
      onClickClose={({ setIsOpen }) => {
        markTourCompleted();
        setIsOpen(false);
      }}
      beforeClose={() => {
        markTourCompleted();
      }}
      prevButton={({ currentStep, setCurrentStep }) => {
        if (currentStep === 0) return null;
        return (
          <button
            type="button"
            onClick={() => setCurrentStep((s) => s - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" />
            Anterior
          </button>
        );
      }}
      nextButton={({ currentStep, stepsLength, setCurrentStep, setIsOpen }) => {
        const isLast = currentStep === stepsLength - 1;
        return (
          <button
            type="button"
            onClick={() => {
              if (isLast) {
                markTourCompleted();
                setIsOpen(false);
              } else {
                setCurrentStep((s) => s + 1);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-harmonia-lime text-harmonia-green hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {isLast ? (
              <>
                Concluir
                <Check className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        );
      }}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#0d140f",
          color: "#f4f4f5",
          borderRadius: "16px",
          padding: "24px 24px 20px",
          border: "1px solid rgba(217, 242, 122, 0.22)",
          boxShadow:
            "0 24px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(217, 242, 122, 0.1)",
          maxWidth: "380px",
        }),
        maskArea: (base) => ({
          ...base,
          rx: 14,
        }),
        maskWrapper: (base) => ({
          ...base,
          color: "rgba(5, 10, 7, 0.78)",
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: "#d9f27a",
          color: "#0b3d24",
          fontWeight: 700,
          fontSize: "11px",
          padding: "3px 9px",
          borderRadius: "9999px",
          top: "-12px",
          left: "20px",
        }),
        dot: (base, state) => ({
          ...base,
          backgroundColor: state?.current ? "#d9f27a" : "rgba(255, 255, 255, 0.22)",
          width: state?.current ? 22 : 6,
          height: 6,
          borderRadius: 4,
          transition: "all 0.25s ease",
        }),
        close: (base) => ({
          ...base,
          color: "#9ca3af",
          right: 14,
          top: 14,
          width: 14,
          height: 14,
          cursor: "pointer",
        }),
        controls: (base) => ({
          ...base,
          marginTop: 18,
          paddingTop: 12,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }),
      }}
    >
      <TourAutoStarter />
      {children}
    </TourProvider>
  );
}

export function useStartTour() {
  const { setIsOpen, setCurrentStep } = useTour();
  return () => {
    setCurrentStep(0);
    setIsOpen(true);
  };
}
