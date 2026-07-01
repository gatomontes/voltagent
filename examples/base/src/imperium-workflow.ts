import { andThen, createWorkflow } from "@voltagent/core";
import { z } from "zod";

const imperiumMissionInput = z.object({
  mission_id: z.string().optional(),
  campaign_id: z.string().optional(),
  payload: z
    .object({
      task: z.string().optional(),
    })
    .passthrough()
    .optional(),
  capabilities: z.array(z.string()).optional(),
  constraints: z.record(z.unknown()).optional(),
  governance_context: z.record(z.unknown()).optional(),
  correlation_id: z.string().optional(),
});

const imperiumMissionResult = z.object({
  status: z.literal("completed"),
  summary: z.string(),
  result: z.object({
    accepted: z.boolean(),
    task: z.string(),
    boundary: z.literal("executor_contract"),
  }),
  artifacts: z.array(
    z.object({
      artifact_id: z.string(),
      artifact_type: z.string(),
      content_ref: z.string(),
    }),
  ),
});

export const imperiumMissionWorkflow = createWorkflow(
  {
    id: "imperium-mission-demo",
    name: "Imperium Mission Demo",
    purpose: "Minimal deterministic workflow for Imperium Executor Contract validation.",
    input: imperiumMissionInput,
    result: imperiumMissionResult,
  },
  andThen({
    id: "return-executor-contract-result",
    execute: async ({ data }) => {
      const missionId = data.mission_id ?? "mission-unknown";
      const task = data.payload?.task ?? "No task provided.";

      return {
        status: "completed" as const,
        summary: `VoltAgent executed Imperium mission ${missionId}.`,
        result: {
          accepted: true,
          task,
          boundary: "executor_contract" as const,
        },
        artifacts: [
          {
            artifact_id: `${missionId}-summary`,
            artifact_type: "structured_result",
            content_ref: `memory://voltagent/${missionId}/summary`,
          },
        ],
      };
    },
  }),
);
