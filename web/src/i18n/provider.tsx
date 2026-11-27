"use client";

import { type ReactNode, useState } from "react";
import { I18nextProvider } from "react-i18next";

import { createAppI18n } from "./instance";

export function AppI18nProvider({ children }: { children: ReactNode }) {
  const [instance] = useState(createAppI18n);
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
