"use client";

import { Badge, type BadgeTone } from "@/components/ui/misc";
import type { ExhibitorStatus, MeetingStatus, TeamStatus } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n";

const EXHIBITOR: Record<ExhibitorStatus, BadgeTone> = { submitted: "warning", approved: "success", rejected: "danger" };
const MEETING: Record<MeetingStatus, BadgeTone> = { pending: "warning", accepted: "success", declined: "danger" };
const TEAM: Record<TeamStatus, BadgeTone> = { applied: "primary", accepted: "success", presenting: "accent" };

export function ExhibitorStatusBadge({ status }: { status: ExhibitorStatus }) {
  const { t } = useI18n();
  return <Badge tone={EXHIBITOR[status]}>{t.options.exhibitorStatus[status]}</Badge>;
}

export function MeetingStatusBadge({ status }: { status: MeetingStatus }) {
  const { t } = useI18n();
  return <Badge tone={MEETING[status]}>{t.options.meetingStatus[status]}</Badge>;
}

export function TeamStatusBadge({ status }: { status: TeamStatus }) {
  const { t } = useI18n();
  return <Badge tone={TEAM[status]}>{t.options.teamStatus[status]}</Badge>;
}
