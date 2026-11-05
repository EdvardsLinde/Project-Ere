import type { ExhibitorStatus, MeetingStatus, TeamStatus } from "@/lib/data/types";

/** Allowed next statuses. Final states have none. */
export const exhibitorFlow: Record<ExhibitorStatus, ExhibitorStatus[]> = {
  submitted: ["approved", "rejected"],
  approved: [],
  rejected: [],
};

export const meetingFlow: Record<MeetingStatus, MeetingStatus[]> = {
  pending: ["accepted", "declined"],
  accepted: [],
  declined: [],
};

export const teamFlow: Record<TeamStatus, TeamStatus[]> = {
  applied: ["accepted"],
  accepted: ["presenting"],
  presenting: [],
};

export function canTransition<S extends string>(flow: Record<S, S[]>, from: S, to: S): boolean {
  return flow[from].includes(to);
}

/** Returns `to`, or throws when the change is not allowed (e.g. accepting a declined meeting). */
export function transition<S extends string>(flow: Record<S, S[]>, from: S, to: S): S {
  if (!canTransition(flow, from, to)) throw new Error(`Invalid status change: ${from} → ${to}`);
  return to;
}
