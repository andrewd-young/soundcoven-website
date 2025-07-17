import type { ApplicationData } from "./Application";

export interface Profile {
  id: string;
  role: string;
  other_description?: string;
  applications?: ApplicationData; // Should be singular, not array
}
